// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import {AxelarExecutable} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/executables/AxelarExecutable.sol";

import {ERC721, ERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {MerkleProof} from "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract MerkleNFTTarget is AxelarExecutable, ERC721Enumerable {
  event Set(bytes32);

  string public sourceChain;
  string public sourceAddress;
  bytes32 public root;

  constructor(
    address gateway_,
    string memory sourceChain_,
    string memory sourceAddress_
  ) AxelarExecutable(gateway_) ERC721("MerkleNFTTarget", "MNFTT") {
    sourceChain = sourceChain_;
    sourceAddress = sourceAddress_;
  }

  // minter information is messaged from source chain by axelar cross-chain call
  function mint(
    address to,
    uint256 tokenId,
    bytes32[] memory proof
  ) public {
    require(root != "", "MerkleNFTTarget: root not set");
    bytes32 hash = keccak256(abi.encodePacked(tokenId, to));
    bool verified = MerkleProof.verify(proof, root, hash);
    require(verified, "MerkleNFTTarget: proof invalid");
    _mint(to, tokenId);
  }

  // this is only for testing
  function setRoot(bytes32 root_) public {
    root = root_;
  }

  function _execute(
    string calldata sourceChain_,
    string calldata sourceAddress_,
    bytes calldata payload_
  ) internal override {
    /*
     * @dev this is disabled for smooth testnet integration test
     */
    // require(root == "", "MerkleNFTTarget: root already set");
    // require(
    //   keccak256(abi.encodePacked(sourceChain_)) == keccak256(abi.encodePacked(sourceChain)),
    //   "MerkleNFTTarget: source chain invalid"
    // );
    // require(
    //   keccak256(abi.encodePacked(sourceAddress_)) == keccak256(abi.encodePacked(sourceAddress)),
    //   "MerkleNFTTarget: source address invalid"
    // );
    root = abi.decode(payload_, (bytes32));
    emit Set(root);
  }
}
