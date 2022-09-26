import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import keccak256 from "keccak256";
import MerkleTree from "merkletreejs";

// this is using Ropsten forking
// docs.axelar.dev/dev/build/contract-addresses/testnet
const gateway = "0xBC6fcce7c5487d43830a219CA6E7B83238B41e71"; // Gateway contract at Ropsten
const mintPrice = 1;
const supplyLimit = 3;

const sourceChain = "Ethereum"; // Test is done in single chain
const destinationChain = "Ethereum"; // Test is done in single chain

describe("Integration", function () {
  async function fixture() {
    const [owner, other] = await ethers.getSigners();
    const MerkleNFTSource = await ethers.getContractFactory("MerkleNFTSource");
    const merkleNFTSource = await MerkleNFTSource.deploy(gateway, mintPrice, supplyLimit);

    const MerkleNFTTarget = await ethers.getContractFactory("MerkleNFTTargetMock"); // this is using mock which has setRoot
    const merkleNFTTarget = await MerkleNFTTarget.deploy(gateway, sourceChain, merkleNFTSource.address);
    return {
      owner,
      other,
      merkleNFTSource,
      merkleNFTTarget,
    };
  }

  describe("MerkleNFTBridge", function () {
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
              "MerkleNFTSource: mint closed"
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

    describe("verifyMerkleTree", function () {
      it("should work", async function () {
        const { owner, merkleNFTSource } = await loadFixture(fixture);
        const mintHashes = [];
        for (let i = 0; i < supplyLimit; i++) {
          await merkleNFTSource.mint(owner.address, { value: mintPrice });
          const mintHash = await merkleNFTSource.getMintHash(i);
          mintHashes.push(mintHash);
        }
        const tree = new MerkleTree(mintHashes, keccak256, { sort: true });
        const root = tree.getHexRoot();
        const proofs = [];
        for (let i = 0; i < supplyLimit; i++) {
          const proof = tree.getHexProof(mintHashes[i]);
          proofs.push(proof);
        }
        expect(await merkleNFTSource.verifyMerkleTree(root, proofs)).to.eq(true);
      });
    });

    describe("sendMerkleRoot", function () {
      it("should work", async function () {
        const { owner, merkleNFTSource, merkleNFTTarget } = await loadFixture(fixture);
        const mintHashes = [];
        for (let i = 0; i < supplyLimit; i++) {
          await merkleNFTSource.mint(owner.address, { value: mintPrice });
          const mintHash = await merkleNFTSource.getMintHash(i);
          mintHashes.push(mintHash);
        }
        const tree = new MerkleTree(mintHashes, keccak256, { sort: true });
        const root = tree.getHexRoot();
        const proofs = [];
        for (let i = 0; i < supplyLimit; i++) {
          const proof = tree.getHexProof(mintHashes[i]);
          proofs.push(proof);
        }
        await merkleNFTSource.sendMerkleRoot(destinationChain, merkleNFTTarget.address, root, proofs);
      });
    });
  });

  describe("MerkleNFTBridge", function () {
    describe("mint", function () {
      it("should work", async function () {
        const { owner, merkleNFTSource, merkleNFTTarget } = await loadFixture(fixture);
        const mintHashes = [];
        for (let i = 0; i < supplyLimit; i++) {
          await merkleNFTSource.mint(owner.address, { value: mintPrice });
          const mintHash = await merkleNFTSource.getMintHash(i);
          mintHashes.push(mintHash);
        }
        const tree = new MerkleTree(mintHashes, keccak256, { sort: true });
        const root = tree.getHexRoot();
        const proofs = [];
        for (let i = 0; i < supplyLimit; i++) {
          const proof = tree.getHexProof(mintHashes[i]);
          proofs.push(proof);
        }
        // await merkleNFTSource.sendMerkleRoot(destinationChain, merkleNFTTarget.address, root, proofs);
        await merkleNFTTarget.setRoot(root);
        const tokenId = 0;
        const [proof] = proofs;
        await merkleNFTTarget.mint(owner.address, tokenId, proof);
        expect(await merkleNFTTarget.ownerOf(tokenId)).to.eq(owner.address);
      });
      it("revert when root is not set", async function () {
        const { owner, merkleNFTTarget } = await loadFixture(fixture);
        const tokenId = 0;
        const proof: string[] = [];
        await expect(merkleNFTTarget.mint(owner.address, tokenId, proof)).to.revertedWith(
          "MerkleNFTTarget: root not set"
        );
      });
      it("revert when root is not set", async function () {
        const { owner, merkleNFTTarget } = await loadFixture(fixture);
        await merkleNFTTarget.setRoot("0x012f2fa64c23bd45af3b9ca61c95be67cd86322798ae876b83a401e38c3d4043");
        const tokenId = 0;
        const proof: string[] = [];
        await expect(merkleNFTTarget.mint(owner.address, tokenId, proof)).to.revertedWith(
          "MerkleNFTTarget: proof invalid"
        );
      });
    });
  });
});
