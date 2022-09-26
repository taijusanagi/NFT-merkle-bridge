import hre = require("hardhat");
import keccak256 from "keccak256";
import MerkleTree from "merkletreejs";

import axelar from "../axelar.json";
import bridge from "../bridge.json";
import { mintPrice, supplyLimit } from "../constants/static";

async function main() {
  const [owner] = await hre.ethers.getSigners();

  const merkleNFTSource = await hre.ethers.getContractAt("MerkleNFTSource", bridge.source.contract);

  const mintHashes = [];
  for (let i = 0; i < supplyLimit; i++) {
    const tx = await merkleNFTSource.mint(owner.address, { value: mintPrice });
    await tx.wait();
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
  const { hash } = await merkleNFTSource.sendMerkleRoot(axelar.target.name, bridge.target.contract, root, proofs, {
    value: "1000000000000000",
  });
  console.log(hash);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
