import hre = require("hardhat");
// import keccak256 from "keccak256";
// import MerkleTree from "merkletreejs";

// import axelar from "../axelar.json";
import bridge from "../bridge.json";
import { supplyLimit } from "../constants/static";
// import { mintPrice, supplyLimit } from "../constants/static";

async function main() {
  const [owner] = await hre.ethers.getSigners();
  const root = "";
  const proofs: any = [];

  const merkleNFTTarget = await hre.ethers.getContractAt("MerkleNFTTarget", bridge.target.contract);
  const tx = await merkleNFTTarget.setRoot(root);
  await tx.wait();
  for (let i = 0; i < supplyLimit; i++) {
    const tx = await merkleNFTTarget.mint(owner.address, i, proofs[i]);
    await tx.wait();
  }
  console.log(test);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
