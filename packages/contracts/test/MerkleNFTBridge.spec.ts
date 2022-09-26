import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("MerkleNFTBridge", function () {
  async function fixture() {
    const [owner, other] = await ethers.getSigners();
    const MerkleNFTBridge = await ethers.getContractFactory("MerkleNFTBridge");
    const merkleNFTBridge = await MerkleNFTBridge.deploy();
    return {
      owner,
      other,
      merkleNFTBridge,
    };
  }

  describe("deployment", function () {
    it("should work", async function () {
      const { merkleNFTBridge } = await loadFixture(fixture);
    });
  });
});
