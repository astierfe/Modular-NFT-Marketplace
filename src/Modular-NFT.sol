// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";

contract ModularNFT is ERC721, ERC721Enumerable, ERC721URIStorage, IERC2981, Ownable, ReentrancyGuard {
    uint256 private _tokenCounter;
    uint256 public maxSupply;
    uint256 public mintPrice;
    string private _baseTokenURI;
    bool public mintingActive;
    address private _defaultRoyaltyRecipient;
    uint96 private _defaultRoyaltyPercentage;
    mapping(uint256 => address) private _tokenRoyaltyRecipients;
    mapping(uint256 => uint96) private _tokenRoyaltyPercentages;

    struct MintParams { address to; string tokenURI; address royaltyRecipient; uint96 royaltyPercentage; }
    struct CollectionInfo { string name; string symbol; uint256 totalSupply; uint256 maxSupply; uint256 mintPrice; bool mintingActive; string baseURI; }
    struct TokenInfo { uint256 tokenId; address owner; string tokenURI; address royaltyRecipient; uint96 royaltyPercentage; }

    event BaseURIUpdated(string newBaseURI);
    event MintPriceUpdated(uint256 newPrice);
    event MintingToggled(bool active);
    event MaxSupplyUpdated(uint256 newMaxSupply);
    event DefaultRoyaltySet(address indexed recipient, uint96 feeNumerator);
    event RoyaltySet(uint256 indexed tokenId, address indexed recipient, uint96 feeNumerator);
    event Withdrawal(address indexed to, uint256 amount);
    event EmergencyWithdrawal(address indexed to, uint256 amount);
    event TokenMinted(uint256 indexed tokenId, address indexed to, string tokenURI);
    event BatchMinted(address indexed to, uint256[] tokenIds);

    error InvalidAddress();
    error TokenNotFound(uint256 tokenId);
    error Unauthorized();
    error InvalidInput(string parameter);
    error MintingNotActive();
    error MaxSupplyReached();
    error IncorrectPayment(uint256 sent, uint256 required);
    error InvalidTokenURI(string uri);
    error RoyaltyTooHigh(uint96 percentage);
    error InvalidRoyaltyRecipient();
    error CannotIncreaseSupply(uint256 current, uint256 requested);
    error InvalidSupplyReduction(uint256 totalSupply, uint256 newMaxSupply);

    constructor(string memory name_, string memory symbol_, uint256 maxSupply_, uint256 mintPrice_, string memory baseURI_) ERC721(name_, symbol_) {
        if (maxSupply_ == 0) revert InvalidInput("maxSupply cannot be zero");
        maxSupply = maxSupply_;
        mintPrice = mintPrice_;
        _baseTokenURI = baseURI_;
        mintingActive = false;
        _tokenCounter = 1;
        _defaultRoyaltyRecipient = msg.sender;
        _defaultRoyaltyPercentage = 500;
        emit DefaultRoyaltySet(msg.sender, 500);
    }

    function ownerMint(address to, string memory tokenURI_) external onlyOwner returns (uint256) {
        if (to == address(0)) revert InvalidAddress();
        if (bytes(tokenURI_).length == 0) revert InvalidTokenURI("URI cannot be empty");
        if (_tokenCounter > maxSupply) revert MaxSupplyReached();
        uint256 tokenId = _tokenCounter;
        _tokenCounter++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI_);
        emit TokenMinted(tokenId, to, tokenURI_);
        return tokenId;
    }

    function ownerMintBatch(MintParams[] memory params) external onlyOwner returns (uint256[] memory) {
        if (params.length == 0) revert InvalidInput("Empty params array");
        if (_tokenCounter + params.length - 1 > maxSupply) revert MaxSupplyReached();
        uint256[] memory tokenIds = new uint256[](params.length);
        for (uint256 i = 0; i < params.length; i++) {
            MintParams memory param = params[i];
            if (param.to == address(0)) revert InvalidAddress();
            if (bytes(param.tokenURI).length == 0) revert InvalidTokenURI("URI cannot be empty");
            uint256 tokenId = _tokenCounter;
            _tokenCounter++;
            _safeMint(param.to, tokenId);
            _setTokenURI(tokenId, param.tokenURI);
            if (param.royaltyRecipient != address(0) && param.royaltyPercentage > 0) {
                _setTokenRoyalty(tokenId, param.royaltyRecipient, param.royaltyPercentage);
            }
            tokenIds[i] = tokenId;
            emit TokenMinted(tokenId, param.to, param.tokenURI);
        }
        emit BatchMinted(msg.sender, tokenIds);
        return tokenIds;
    }

    function publicMint(string memory tokenURI_) external payable nonReentrant returns (uint256) {
        if (!mintingActive) revert MintingNotActive();
        if (msg.value != mintPrice) revert IncorrectPayment(msg.value, mintPrice);
        if (bytes(tokenURI_).length == 0) revert InvalidTokenURI("URI cannot be empty");
        if (_tokenCounter > maxSupply) revert MaxSupplyReached();
        uint256 tokenId = _tokenCounter;
        _tokenCounter++;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI_);
        emit TokenMinted(tokenId, msg.sender, tokenURI_);
        return tokenId;
    }

    function setBaseURI(string memory newBaseURI) external onlyOwner {
        _baseTokenURI = newBaseURI;
        emit BaseURIUpdated(newBaseURI);
    }

    function setMintPrice(uint256 newPrice) external onlyOwner {
        mintPrice = newPrice;
        emit MintPriceUpdated(newPrice);
    }

    function setMintingActive(bool active) external onlyOwner {
        mintingActive = active;
        emit MintingToggled(active);
    }

    function setMaxSupply(uint256 newMaxSupply) external onlyOwner {
        if (newMaxSupply > maxSupply) revert CannotIncreaseSupply(maxSupply, newMaxSupply);
        if (newMaxSupply < totalSupply()) revert InvalidSupplyReduction(totalSupply(), newMaxSupply);
        if (newMaxSupply == 0) revert InvalidInput("maxSupply cannot be zero");
        maxSupply = newMaxSupply;
        emit MaxSupplyUpdated(newMaxSupply);
    }

    function setDefaultRoyalty(address recipient, uint96 feeNumerator) external onlyOwner {
        if (recipient == address(0)) revert InvalidRoyaltyRecipient();
        if (feeNumerator > 1000) revert RoyaltyTooHigh(feeNumerator);
        _defaultRoyaltyRecipient = recipient;
        _defaultRoyaltyPercentage = feeNumerator;
        emit DefaultRoyaltySet(recipient, feeNumerator);
    }

    function setTokenRoyalty(uint256 tokenId, address recipient, uint96 feeNumerator) external onlyOwner {
        if (!_exists(tokenId)) revert TokenNotFound(tokenId);
        _setTokenRoyalty(tokenId, recipient, feeNumerator);
    }

    function _setTokenRoyalty(uint256 tokenId, address recipient, uint96 feeNumerator) internal {
        if (recipient == address(0)) revert InvalidRoyaltyRecipient();
        if (feeNumerator > 1000) revert RoyaltyTooHigh(feeNumerator);
        _tokenRoyaltyRecipients[tokenId] = recipient;
        _tokenRoyaltyPercentages[tokenId] = feeNumerator;
        emit RoyaltySet(tokenId, recipient, feeNumerator);
    }

    function royaltyInfo(uint256 tokenId, uint256 salePrice) external view override returns (address receiver, uint256 royaltyAmount) {
        if (!_exists(tokenId)) revert TokenNotFound(tokenId);
        address tokenRecipient = _tokenRoyaltyRecipients[tokenId];
        uint96 tokenPercentage = _tokenRoyaltyPercentages[tokenId];
        if (tokenRecipient != address(0)) {
            receiver = tokenRecipient;
            royaltyAmount = (salePrice * tokenPercentage) / 10000;
        } else {
            receiver = _defaultRoyaltyRecipient;
            royaltyAmount = (salePrice * _defaultRoyaltyPercentage) / 10000;
        }
    }

    function getDefaultRoyalty() external view returns (address recipient, uint96 percentage) {
        return (_defaultRoyaltyRecipient, _defaultRoyaltyPercentage);
    }

    function withdraw() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        if (balance == 0) revert InvalidInput("No funds to withdraw");
        (bool success, ) = payable(owner()).call{value: balance}("");
        if (!success) revert("Withdrawal failed");
        emit Withdrawal(owner(), balance);
    }

    function emergencyWithdraw(address payable to) external onlyOwner {
        if (to == address(0)) revert InvalidAddress();
        uint256 balance = address(this).balance;
        if (balance == 0) revert InvalidInput("No funds to withdraw");
        (bool success, ) = to.call{value: balance}("");
        if (!success) revert("Emergency withdrawal failed");
        emit EmergencyWithdrawal(to, balance);
    }

    function getCollectionInfo() external view returns (CollectionInfo memory) {
        return CollectionInfo({name: name(), symbol: symbol(), totalSupply: totalSupply(), maxSupply: maxSupply, mintPrice: mintPrice, mintingActive: mintingActive, baseURI: _baseTokenURI});
    }

    function getTokenInfo(uint256 tokenId) external view returns (TokenInfo memory) {
        if (!_exists(tokenId)) revert TokenNotFound(tokenId);
        (address royaltyRecipient, uint256 royaltyAmount) = this.royaltyInfo(tokenId, 10000);
        return TokenInfo({tokenId: tokenId, owner: ownerOf(tokenId), tokenURI: tokenURI(tokenId), royaltyRecipient: royaltyRecipient, royaltyPercentage: uint96((royaltyAmount * 10000) / 10000)});
    }

    function getTokensBatch(uint256[] memory tokenIds) external view returns (TokenInfo[] memory) {
        TokenInfo[] memory tokens = new TokenInfo[](tokenIds.length);
        for (uint256 i = 0; i < tokenIds.length; i++) {
            tokens[i] = this.getTokenInfo(tokenIds[i]);
        }
        return tokens;
    }

    function exists(uint256 tokenId) external view returns (bool) {
        return _exists(tokenId);
    }

    function tokensOfOwner(address owner) external view returns (uint256[] memory) {
        uint256 tokenCount = balanceOf(owner);
        uint256[] memory tokenIds = new uint256[](tokenCount);
        for (uint256 i = 0; i < tokenCount; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(owner, i);
        }
        return tokenIds;
    }

    function baseURI() external view returns (string memory) {
        return _baseTokenURI;
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
        delete _tokenRoyaltyRecipients[tokenId];
        delete _tokenRoyaltyPercentages[tokenId];
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable, ERC721URIStorage, IERC165) returns (bool) {
        return interfaceId == type(IERC2981).interfaceId || super.supportsInterface(interfaceId);
    }
}