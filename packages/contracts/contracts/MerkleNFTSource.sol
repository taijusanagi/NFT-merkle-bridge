// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import {AxelarExecutable} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/executables/AxelarExecutable.sol";
import {IAxelarGateway} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGateway.sol";
import {IAxelarGasService} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGasService.sol";

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MerkleNFTSource is AxelarExecutable, ERC721 {
  IAxelarGasService public immutable gasReceiver;
  uint256 public immutable mintPrice;
  uint256 public immutable supplyLimit;

  uint256 public totalSupply;

  constructor(
    address gateway_,
    address gasReceiver_,
    uint256 mintPrice_,
    uint256 supplyLimit_
  ) AxelarExecutable(gateway_) ERC721("MerkleNFTSource", "MNFTS") {
    gasReceiver = IAxelarGasService(gasReceiver_);
    mintPrice = mintPrice_;
    supplyLimit = supplyLimit_;
  }

  function mint(address to) public payable {
    require(msg.value == mintPrice, "MerkleNFTSource: value invalid");
    require(totalSupply < supplyLimit, "MerkleNFTSource: closed");
    uint256 tokenId = totalSupply;
    _mint(to, tokenId);
    totalSupply++;
  }

  function sendMerkleRoot(
    string calldata destinationChain,
    string calldata destinationAddress,
    bytes memory merkleRoot,
    bytes[] memory proofs
  ) external payable {
    require(verifyMerkleTree(merkleRoot, proofs), "MerkleNFTSource: merkle tree is invalid");
    bytes memory payload = abi.encode(merkleRoot);
    gateway.callContract(destinationChain, destinationAddress, payload);
  }

  function verifyMerkleTree(bytes memory merkleRoot, bytes[] memory proofs) public view returns (bool) {
    return true;
  }

  function _transfer(
    address,
    address,
    uint256
  ) internal override {
    revert("MerkleNFTSource: transfer is not allowed");
  }
}
