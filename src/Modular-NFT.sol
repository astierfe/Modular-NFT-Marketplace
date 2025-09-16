// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";

/**
 * @title ModularNFT
 * @dev Complete NFT implementation for Modular NFT Marketplace Phase 1
 * @dev Implements ERC721 + Enumerable + URIStorage + EIP-2981 Royalties
 */
contract ModularNFT is 
    ERC721,
    ERC721Enumerable,
    ERC721URIStorage,
    IERC2981,
    Ownable,
    ReentrancyGuard
{
    // ==================== STATE VARIABLES ====================
    
    /// @dev Current token counter for sequential minting
    uint256 private _tokenCounter;
    
    /// @dev Maximum supply for the collection
    uint256 public maxSupply;
    
    /// @dev Price for public minting in wei
    uint256 public mintPrice;
    
    /// @dev Base URI for token metadata
    string private _baseTokenURI;
    
    /// @dev Flag to control public minting
    bool public mintingActive;
    
    // Royalty management
    /// @dev Default royalty recipient
    address private _defaultRoyaltyRecipient;
    
    /// @dev Default royalty percentage in basis points (100 = 1%)
    uint96 private _defaultRoyaltyPercentage;
    
    /// @dev Per-token royalty recipients
    mapping(uint256 => address) private _tokenRoyaltyRecipients;
    
    /// @dev Per-token royalty percentages
    mapping(uint256 => uint96) private _tokenRoyaltyPercentages;
    
    // ==================== CUSTOM TYPES ====================
    
    /// @dev Struct for batch minting parameters
    struct MintParams {
        address to;
        string tokenURI;
        address royaltyRecipient;  // address(0) for default
        uint96 royaltyPercentage;  // 0 for default
    }
    
    /// @dev Struct for collection information
    struct CollectionInfo {
        string name;
        string symbol;
        uint256 totalSupply;
        uint256 maxSupply;
        uint256 mintPrice;
        bool mintingActive;
        string baseURI;
    }
    
    /// @dev Struct for token information
    struct TokenInfo {
        uint256 tokenId;
        address owner;
        string tokenURI;
        address royaltyRecipient;
        uint96 royaltyPercentage;
    }
    
    // ==================== EVENTS ====================
    
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
    
    // ==================== CUSTOM ERRORS ====================
    
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
    
    // ==================== CONSTRUCTOR ====================
    
    /**
     * @dev Initialize the NFT collection
     * @param name_ Collection name
     * @param symbol_ Collection symbol
     * @param maxSupply_ Maximum number of tokens that can be minted
     * @param mintPrice_ Price for public minting in wei
     * @param baseURI_ Base URI for token metadata
     */
    constructor(
        string memory name_,
        string memory symbol_,
        uint256 maxSupply_,
        uint256 mintPrice_,
        string memory baseURI_
    ) ERC721(name_, symbol_) {
        if (maxSupply_ == 0) revert InvalidInput("maxSupply cannot be zero");
        
        maxSupply = maxSupply_;
        mintPrice = mintPrice_;
        _baseTokenURI = baseURI_;
        mintingActive = false;
        _tokenCounter = 1; // Start tokens at ID 1
        
        // Set default royalty to contract owner (5%)
        _defaultRoyaltyRecipient = msg.sender;
        _defaultRoyaltyPercentage = 500; // 5%
        
        emit DefaultRoyaltySet(msg.sender, 500);
    }
    
    // ==================== MINTING FUNCTIONS ====================
    
    /**
     * @dev Owner can mint NFTs for free to any address
     * @param to Address to mint token to
     * @param tokenURI_ URI for token metadata
     * @return tokenId The minted token ID
     */
    function ownerMint(
        address to,
        string memory tokenURI_
    ) external onlyOwner returns (uint256) {
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
    
    /**
     * @dev Owner can mint multiple NFTs in a single transaction
     * @param params Array of minting parameters
     * @return tokenIds Array of minted token IDs
     */
    function ownerMintBatch(
        MintParams[] memory params
    ) external onlyOwner returns (uint256[] memory) {
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
            
            // Set custom royalty if provided
            if (param.royaltyRecipient != address(0) && param.royaltyPercentage > 0) {
                _setTokenRoyalty(tokenId, param.royaltyRecipient, param.royaltyPercentage);
            }
            
            tokenIds[i] = tokenId;
            emit TokenMinted(tokenId, param.to, param.tokenURI);
        }
        
        emit BatchMinted(msg.sender, tokenIds);
        return tokenIds;
    }
    
    /**
     * @dev Public paid minting function
     * @param tokenURI_ URI for token metadata
     * @return tokenId The minted token ID
     */
    function publicMint(
        string memory tokenURI_
    ) external payable nonReentrant returns (uint256) {
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
    
    // ==================== CONFIGURATION FUNCTIONS ====================
    
    /**
     * @dev Set base URI for token metadata
     * @param newBaseURI New base URI
     */
    function setBaseURI(string memory newBaseURI) external onlyOwner {
        _baseTokenURI = newBaseURI;
        emit BaseURIUpdated(newBaseURI);
    }
    
    /**
     * @dev Set price for public minting
     * @param newPrice New mint price in wei
     */
    function setMintPrice(uint256 newPrice) external onlyOwner {
        mintPrice = newPrice;
        emit MintPriceUpdated(newPrice);
    }
    
    /**
     * @dev Toggle public minting on/off
     * @param active New minting status
     */
    function setMintingActive(bool active) external onlyOwner {
        mintingActive = active;
        emit MintingToggled(active);
    }
    
    /**
     * @dev Reduce maximum supply (cannot increase)
     * @param newMaxSupply New maximum supply (must be >= current total supply)
     */
    function setMaxSupply(uint256 newMaxSupply) external onlyOwner {
        if (newMaxSupply > maxSupply) revert CannotIncreaseSupply(maxSupply, newMaxSupply);
        if (newMaxSupply < totalSupply()) revert InvalidSupplyReduction(totalSupply(), newMaxSupply);
        if (newMaxSupply == 0) revert InvalidInput("maxSupply cannot be zero");
        
        maxSupply = newMaxSupply;
        emit MaxSupplyUpdated(newMaxSupply);
    }
    
    // ==================== ROYALTY FUNCTIONS ====================
    
    /**
     * @dev Set default royalty for all tokens
     * @param recipient Address to receive royalties
     * @param feeNumerator Royalty percentage in basis points (100 = 1%)
     */
    function setDefaultRoyalty(address recipient, uint96 feeNumerator) external onlyOwner {
        if (recipient == address(0)) revert InvalidRoyaltyRecipient();
        if (feeNumerator > 1000) revert RoyaltyTooHigh(feeNumerator); // Max 10%
        
        _defaultRoyaltyRecipient = recipient;
        _defaultRoyaltyPercentage = feeNumerator;
        
        emit DefaultRoyaltySet(recipient, feeNumerator);
    }
    
    /**
     * @dev Set royalty for specific token
     * @param tokenId Token ID to set royalty for
     * @param recipient Address to receive royalties
     * @param feeNumerator Royalty percentage in basis points
     */
    function setTokenRoyalty(
        uint256 tokenId,
        address recipient,
        uint96 feeNumerator
    ) external onlyOwner {
        if (!_exists(tokenId)) revert TokenNotFound(tokenId);
        
        _setTokenRoyalty(tokenId, recipient, feeNumerator);
    }
    
    /**
     * @dev Internal function to set token royalty
     */
    function _setTokenRoyalty(
        uint256 tokenId,
        address recipient,
        uint96 feeNumerator
    ) internal {
        if (recipient == address(0)) revert InvalidRoyaltyRecipient();
        if (feeNumerator > 1000) revert RoyaltyTooHigh(feeNumerator);
        
        _tokenRoyaltyRecipients[tokenId] = recipient;
        _tokenRoyaltyPercentages[tokenId] = feeNumerator;
        
        emit RoyaltySet(tokenId, recipient, feeNumerator);
    }
    
    /**
     * @dev Returns royalty information for a token (EIP-2981)
     * @param tokenId Token ID to get royalty info for
     * @param salePrice Sale price to calculate royalty from
     * @return receiver Address to receive royalties
     * @return royaltyAmount Amount of royalties in wei
     */
    function royaltyInfo(
        uint256 tokenId,
        uint256 salePrice
    ) external view override returns (address receiver, uint256 royaltyAmount) {
        if (!_exists(tokenId)) revert TokenNotFound(tokenId);
        
        // Check if token has specific royalty
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
    
    // ==================== FUND MANAGEMENT ====================
    
    /**
     * @dev Withdraw contract balance to owner
     */
    function withdraw() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        if (balance == 0) revert InvalidInput("No funds to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        if (!success) revert("Withdrawal failed");
        
        emit Withdrawal(owner(), balance);
    }
    
    /**
     * @dev Emergency withdrawal to specific address
     * @param to Address to send funds to
     */
    function emergencyWithdraw(address payable to) external onlyOwner {
        if (to == address(0)) revert InvalidAddress();
        
        uint256 balance = address(this).balance;
        if (balance == 0) revert InvalidInput("No funds to withdraw");
        
        (bool success, ) = to.call{value: balance}("");
        if (!success) revert("Emergency withdrawal failed");
        
        emit EmergencyWithdrawal(to, balance);
    }
    
    // ==================== VIEW FUNCTIONS ====================
    
    /**
     * @dev Returns complete collection information
     */
    function getCollectionInfo() external view returns (CollectionInfo memory) {
        return CollectionInfo({
            name: name(),
            symbol: symbol(),
            totalSupply: totalSupply(),
            maxSupply: maxSupply,
            mintPrice: mintPrice,
            mintingActive: mintingActive,
            baseURI: _baseTokenURI
        });
    }
    
    /**
     * @dev Returns complete token information
     * @param tokenId Token ID to get info for
     */
    function getTokenInfo(uint256 tokenId) external view returns (TokenInfo memory) {
        if (!_exists(tokenId)) revert TokenNotFound(tokenId);
        
        (address royaltyRecipient, uint256 royaltyAmount) = this.royaltyInfo(tokenId, 10000);
        
        return TokenInfo({
            tokenId: tokenId,
            owner: ownerOf(tokenId),
            tokenURI: tokenURI(tokenId),
            royaltyRecipient: royaltyRecipient,
            royaltyPercentage: uint96((royaltyAmount * 10000) / 10000) // Convert back to basis points
        });
    }
    
    /**
     * @dev Returns batch token information
     * @param tokenIds Array of token IDs
     */
    function getTokensBatch(uint256[] memory tokenIds) external view returns (TokenInfo[] memory) {
        TokenInfo[] memory tokens = new TokenInfo[](tokenIds.length);
        
        for (uint256 i = 0; i < tokenIds.length; i++) {
            tokens[i] = this.getTokenInfo(tokenIds[i]);
        }
        
        return tokens;
    }
    
    /**
     * @dev Check if a token exists
     * @param tokenId Token ID to check
     */
    function exists(uint256 tokenId) external view returns (bool) {
        return _exists(tokenId);
    }
    
    /**
     * @dev Get all token IDs owned by an address
     * @param owner Address to get tokens for
     */
    function tokensOfOwner(address owner) external view returns (uint256[] memory) {
        uint256 tokenCount = balanceOf(owner);
        uint256[] memory tokenIds = new uint256[](tokenCount);
        
        for (uint256 i = 0; i < tokenCount; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(owner, i);
        }
        
        return tokenIds;
    }
    
    /**
     * @dev Returns base URI for tokens
     */
    function baseURI() external view returns (string memory) {
        return _baseTokenURI;
    }
    
    // ==================== INTERNAL OVERRIDES ====================
    
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }
    
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }
    
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
        
        // Clear token royalty
        delete _tokenRoyaltyRecipients[tokenId];
        delete _tokenRoyaltyPercentages[tokenId];
    }
    
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
    
    // ==================== INTERFACE SUPPORT ====================
    
    /**
     * @dev Returns true if contract implements interface
     * @param interfaceId Interface identifier
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage, IERC165)
        returns (bool)
    {
        return
            interfaceId == type(IERC2981).interfaceId ||
            super.supportsInterface(interfaceId);
    }
}