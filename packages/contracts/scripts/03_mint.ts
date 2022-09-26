import hre = require("hardhat");
// import keccak256 from "keccak256";
// import MerkleTree from "merkletreejs";

// import axelar from "../axelar.json";
import bridge from "../bridge.json";
import { supplyLimit } from "../constants/static";
// import { mintPrice, supplyLimit } from "../constants/static";

async function main() {
  const [owner] = await hre.ethers.getSigners();
  const root = "0xf6d5ab86fc1ff61b7243ce0f8baa97bbbb3b8c19a64f689b48a1cefd0244395c";
  const proofs: any = [
    ["0x446d28eb0b958428d8c6dba26d93cee016924ad9de6fa4044c0687db37f12f89"],
    ["0x5dd5d67f6a2a7cb65be1a7ff0758a0c15ac02d6a189cfaceb27b202ce16ff72a"],
  ];

  const merkleNFTTarget = await hre.ethers.getContractAt("MerkleNFTTarget", bridge.target.contract);
  // this is only for testing
  // const tx = await merkleNFTTarget.setRoot(root);
  // await tx.wait();
  for (let i = 0; i < supplyLimit; i++) {
    const tx = await merkleNFTTarget.mint(owner.address, i, proofs[i]);
    await tx.wait();
  }
  // console.log(test);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
