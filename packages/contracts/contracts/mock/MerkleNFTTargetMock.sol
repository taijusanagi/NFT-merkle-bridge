// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "../MerkleNFTTarget.sol";

contract MerkleNFTTargetMock is MerkleNFTTarget {
  constructor(
    address gateway_,
    string memory sourceChain_,
    string memory sourceAddress_
  ) MerkleNFTTarget(gateway_, sourceChain_, sourceAddress_) {}

  function setRoot(bytes32 root_) public {
    root = root_;
  }
}
