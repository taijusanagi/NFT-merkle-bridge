// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import {AxelarExecutable} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/executables/AxelarExecutable.sol";

import {ERC721, ERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {MerkleProof} from "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract MerkleNFTSource is AxelarExecutable, ERC721Enumerable {
  uint256 public immutable mintPrice;
  uint256 public immutable supplyLimit;

  constructor(
    address gateway_,
    uint256 mintPrice_,
    uint256 supplyLimit_
  ) AxelarExecutable(gateway_) ERC721("MerkleNFTSource", "MNFTS") {
    mintPrice = mintPrice_;
    supplyLimit = supplyLimit_;
  }

  function mint(address to) public payable {
    require(msg.value == mintPrice, "MerkleNFTSource: value invalid");
    uint256 tokenId = totalSupply();
    require(tokenId < supplyLimit, "MerkleNFTSource: mint closed");
    _mint(to, tokenId);
  }

  function sendMerkleRoot(
    string calldata destinationChain,
    string calldata destinationAddress,
    bytes32 merkleRoot,
    bytes32[][] memory proofs
  ) external payable {
    uint256 totalSupply = totalSupply();
    require(totalSupply == supplyLimit, "MerkleNFTSource: mint not closed");
    require(verifyMerkleTree(merkleRoot, proofs), "MerkleNFTSource: merkle tree is invalid");
    bytes memory payload = abi.encode(merkleRoot);
    gateway.callContract(destinationChain, destinationAddress, payload);
  }

  function verifyMerkleTree(bytes32 merkleRoot, bytes32[][] memory proofs) public view returns (bool) {
    uint256 totalSupply = totalSupply();
    bool result = true;
    for (uint256 i = 0; i < totalSupply; i++) {
      uint256 tokenId = tokenByIndex(i);
      bytes32 hash = getMintHash(tokenId);
      bool verified = MerkleProof.verify(proofs[i], merkleRoot, hash);
      if (!verified) {
        result = false;
      }
    }
    return result;
  }

  function getMintHash(uint256 tokenId) public view returns (bytes32) {
    address holder = ownerOf(tokenId);
    return keccak256(abi.encodePacked(tokenId, holder));
  }

  function _transfer(
    address,
    address,
    uint256
  ) internal override {
    revert("MerkleNFTSource: transfer is not allowed");
  }
}
