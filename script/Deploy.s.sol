// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import "../src/Modular-NFT.sol";

contract Deploy is Script {
    struct DeploymentConfig {string collectionName; string collectionSymbol; uint256 maxSupply; uint256 mintPrice; string baseURI; address owner; bool verifyContract;}
    
    function getLocalConfig() internal pure returns (DeploymentConfig memory) {
        return DeploymentConfig({collectionName: "Dev NFT Collection", collectionSymbol: "DEVNFT", maxSupply: 100, mintPrice: 0, baseURI: "http://localhost:8080/ipfs/", owner: address(0), verifyContract: false});
    }
    
    function getSepoliaConfig() internal view returns (DeploymentConfig memory) {
        return DeploymentConfig({collectionName: vm.envOr("COLLECTION_NAME", string("Test NFT Collection")), collectionSymbol: vm.envOr("COLLECTION_SYMBOL", string("TESTNFT")), maxSupply: vm.envOr("MAX_SUPPLY", uint256(100)), mintPrice: vm.envOr("MINT_PRICE", uint256(0.01 ether)), baseURI: vm.envOr("BASE_URI", string("https://gateway.pinata.cloud/ipfs/")), owner: address(0), verifyContract: vm.envOr("VERIFY_CONTRACT", true)});
    }
    
    function getMainnetConfig() internal view returns (DeploymentConfig memory) {
        return DeploymentConfig({collectionName: vm.envOr("COLLECTION_NAME", string("Modular NFT Collection")), collectionSymbol: vm.envOr("COLLECTION_SYMBOL", string("MNFT")), maxSupply: vm.envOr("MAX_SUPPLY", uint256(100)), mintPrice: vm.envOr("MINT_PRICE", uint256(0.05 ether)), baseURI: vm.envOr("BASE_URI", string("https://ipfs.io/ipfs/")), owner: vm.envAddress("MULTISIG_OWNER"), verifyContract: vm.envOr("VERIFY_CONTRACT", true)});
    }
    
    function run() external {
        uint256 chainId = block.chainid;
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("=== MODULAR NFT DEPLOYMENT ===");
        console.log("Chain ID:", chainId);
        console.log("Deployer:", deployer);
        console.log("Balance:", deployer.balance / 1e18, "ETH");
        
        DeploymentConfig memory config = getConfigForChain(chainId);
        
        if (config.owner == address(0)) {config.owner = deployer;}
        
        validateConfig(config);
        logDeploymentConfig(config);
        
        vm.startBroadcast(deployerPrivateKey);
        
        ModularNFT nft = new ModularNFT(config.collectionName, config.collectionSymbol, config.maxSupply, config.mintPrice, config.baseURI);
        
        if (config.owner != deployer) {console.log("Transferring ownership to:", config.owner); nft.transferOwnership(config.owner);}
        
        nft.setDefaultRoyalty(config.owner, 500);
        
        if (chainId != 31337) {nft.setMintingActive(true);}
        
        vm.stopBroadcast();
        
        logDeploymentResults(address(nft), config, chainId);
        saveDeploymentInfo(address(nft), config, chainId);
        
        if (config.verifyContract && chainId != 31337) {console.log("Contract verification will be handled by Foundry"); console.log("Run: forge verify-contract", address(nft), "ModularNFT");}
    }
    
    function getConfigForChain(uint256 chainId) internal view returns (DeploymentConfig memory) {
        if (chainId == 31337) {return getLocalConfig();} 
        else if (chainId == 11155111) {return getSepoliaConfig();} 
        else if (chainId == 1) {return getMainnetConfig();} 
        else {revert("Unsupported chain ID");}
    }
    
    function validateConfig(DeploymentConfig memory config) internal pure {
        require(bytes(config.collectionName).length > 0, "Collection name required");
        require(bytes(config.collectionSymbol).length > 0, "Collection symbol required");
        require(config.maxSupply > 0, "Max supply must be > 0");
        require(config.owner != address(0), "Owner address required");
        require(bytes(config.baseURI).length > 0, "Base URI required");
    }
    
    function logDeploymentConfig(DeploymentConfig memory config) internal pure {
        console.log("\n=== DEPLOYMENT CONFIGURATION ===");
        console.log("Collection Name:", config.collectionName);
        console.log("Collection Symbol:", config.collectionSymbol);
        console.log("Max Supply:", config.maxSupply);
        console.log("Mint Price:", config.mintPrice / 1e18, "ETH");
        console.log("Base URI:", config.baseURI);
        console.log("Owner:", config.owner);
        console.log("Verify Contract:", config.verifyContract);
        console.log("");
    }
    
    function logDeploymentResults(address contractAddress, DeploymentConfig memory, uint256 chainId) internal pure {
        console.log("\n=== DEPLOYMENT SUCCESSFUL ===");
        console.log("Contract Address:", contractAddress);
        console.log("Transaction Hash: Check your terminal output");
        console.log("Gas Used: Check transaction receipt");
        
        if (chainId == 1) {console.log("Etherscan:", string.concat("https://etherscan.io/address/", addressToString(contractAddress)));}
        else if (chainId == 11155111) {console.log("Etherscan:", string.concat("https://sepolia.etherscan.io/address/", addressToString(contractAddress)));}
        
        console.log("\n=== NEXT STEPS ===");
        if (chainId == 31337) {console.log("1. Test contract locally with cast commands"); console.log("2. Run integration tests");}
        else {console.log("1. Verify contract on Etherscan"); console.log("2. Test basic functions"); console.log("3. Set up OpenSea collection");}
        console.log("");
    }
    
    function saveDeploymentInfo(address contractAddress, DeploymentConfig memory config, uint256 chainId) internal {
        string memory chainName = getChainName(chainId);
        string memory filePath = string.concat("deployments/", chainName, ".json");
        
        string memory json = string.concat('{\n', '  "chainId": ', vm.toString(chainId), ',\n', '  "contractAddress": "', addressToString(contractAddress), '",\n', '  "collectionName": "', config.collectionName, '",\n', '  "collectionSymbol": "', config.collectionSymbol, '",\n', '  "maxSupply": ', vm.toString(config.maxSupply), ',\n', '  "mintPrice": "', vm.toString(config.mintPrice), '",\n', '  "baseURI": "', config.baseURI, '",\n', '  "owner": "', addressToString(config.owner), '",\n', '  "deployedAt": ', vm.toString(block.timestamp), '\n', '}');
        
        vm.writeFile(filePath, json);
        console.log("Deployment info saved to:", filePath);
    }
    
    function getChainName(uint256 chainId) internal pure returns (string memory) {
        if (chainId == 31337) return "anvil";
        if (chainId == 11155111) return "sepolia";
        if (chainId == 1) return "mainnet";
        return "unknown";
    }
    
    function addressToString(address addr) internal pure returns (string memory) {return vm.toString(addr);}
    
    function deployWithParams(string memory name, string memory symbol, uint256 maxSupply, uint256 mintPrice, string memory baseURI) public returns (address) {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        ModularNFT nft = new ModularNFT(name, symbol, maxSupply, mintPrice, baseURI);
        vm.stopBroadcast();
        
        console.log("Custom deployment successful:");
        console.log("Address:", address(nft));
        
        return address(nft);
    }
    
    function deployLocal() public returns (address) {
        return deployWithParams("Test Collection", "TEST", 100, 0, "http://localhost:8080/ipfs/");
    }
}