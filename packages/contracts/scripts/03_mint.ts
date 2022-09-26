import hre = require("hardhat");
// import keccak256 from "keccak256";
// import MerkleTree from "merkletreejs";

// import axelar from "../axelar.json";
import bridge from "../bridge.json";
// import { mintPrice, supplyLimit } from "../constants/static";

async function main() {
  // const [owner] = await hre.ethers.getSigners();

  const merkleNFTSource = await hre.ethers.getContractAt("MerkleNFTTarget", bridge.target.contract);
  const test = await merkleNFTSource.root();
  console.log(test);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
