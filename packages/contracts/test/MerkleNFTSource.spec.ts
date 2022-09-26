import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

// this is using Ropsten forking
// docs.axelar.dev/dev/build/contract-addresses/testnet
const gateway = "0xBC6fcce7c5487d43830a219CA6E7B83238B41e71"; // Gateway contract at Ropsten
const gasService = "0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6"; // Gas Service at Ropsten
const mintPrice = 1;
const supplyLimit = 3;

describe("MerkleNFTBridge", function () {
  async function fixture() {
    const [owner, other] = await ethers.getSigners();
    const MerkleNFTSource = await ethers.getContractFactory("MerkleNFTSource");
    const merkleNFTSource = await MerkleNFTSource.deploy(gateway, gasService, mintPrice, supplyLimit);
    return {
      owner,
      other,
      merkleNFTSource,
    };
  }

  describe("deployment", function () {
    it("should work", async function () {
      const { merkleNFTSource } = await loadFixture(fixture);
      expect(await merkleNFTSource.mintPrice()).to.eq(mintPrice);
      expect(await merkleNFTSource.supplyLimit()).to.eq(supplyLimit);
    });
  });

  describe("mint", function () {
    it("should work", async function () {
      const { owner, merkleNFTSource } = await loadFixture(fixture);
      const mintedTokenId = 0;
      await merkleNFTSource.mint(owner.address, { value: mintPrice });
      expect(await merkleNFTSource.ownerOf(mintedTokenId)).to.eq(owner.address);
    });

    it("revert when price is invalid", async function () {
      const { owner, merkleNFTSource } = await loadFixture(fixture);
      await expect(merkleNFTSource.mint(owner.address)).to.revertedWith("MerkleNFTSource: value invalid");
    });

    it("revert when limit exceeded", async function () {
      const { owner, merkleNFTSource } = await loadFixture(fixture);
      for (let i = 0; i <= supplyLimit; i++) {
        if (i !== supplyLimit) {
          await merkleNFTSource.mint(owner.address, { value: mintPrice });
        } else {
          await expect(merkleNFTSource.mint(owner.address, { value: mintPrice })).to.revertedWith(
            "MerkleNFTSource: closed"
          );
        }
      }
    });
  });

  describe("not transferable", function () {
    it("should work", async function () {
      const { owner, other, merkleNFTSource } = await loadFixture(fixture);
      const mintedTokenId = 0;
      await merkleNFTSource.mint(owner.address, { value: mintPrice });
      await expect(merkleNFTSource.transferFrom(owner.address, other.address, mintedTokenId)).to.revertedWith(
        "MerkleNFTSource: transfer is not allowed"
      );
    });
  });
});
