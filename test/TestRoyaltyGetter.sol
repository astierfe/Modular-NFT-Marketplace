// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/Modular-NFT.sol";

contract TestRoyaltyGetter is Test {
    ModularNFT public nft;
    address public owner = address(0x123);
    
    function setUp() public {
        vm.prank(owner);
        nft = new ModularNFT("Test NFT", "TNFT", 100, 0.01 ether, "https://test.com/");
    }
    
    function testGetDefaultRoyaltyInitial() public {
        (address recipient, uint96 percentage) = nft.getDefaultRoyalty();
        assertEq(recipient, owner);
        assertEq(percentage, 500);
        console.log("Initial royalty recipient:", recipient);
        console.log("Initial royalty percentage:", percentage, "(5%)");
    }
    
    function testGetDefaultRoyaltyAfterChange() public {
        address newRecipient = address(0x456);
        uint96 newPercentage = 750;
        
        vm.prank(owner);
        nft.setDefaultRoyalty(newRecipient, newPercentage);
        
        (address recipient, uint96 percentage) = nft.getDefaultRoyalty();
        assertEq(recipient, newRecipient);
        assertEq(percentage, newPercentage);
        console.log("Updated royalty recipient:", recipient);
        console.log("Updated royalty percentage:", percentage, "(7.5%)");
    }
}