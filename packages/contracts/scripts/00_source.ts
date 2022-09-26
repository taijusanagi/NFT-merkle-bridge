import hre = require("hardhat");
import axelar from "../axelar.json";
import { mintPrice, supplyLimit } from "../constants/static";

async function main() {
  const MerkleNFTSource = await hre.ethers.getContractFactory("MerkleNFTSource");
  const merkleNFTSource = await MerkleNFTSource.deploy(
    axelar.source.gateway,
    axelar.source.gasReceiver,
    mintPrice,
    supplyLimit
  );
  await merkleNFTSource.deployed();
  console.log(`MerkleNFTSource deployed to ${merkleNFTSource.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
