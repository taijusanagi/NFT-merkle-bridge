import hre = require("hardhat");
import axelar from "../axelar.json";
import bridge from "../bridge.json";

async function main() {
  const MerkleNFTTarget = await hre.ethers.getContractFactory("MerkleNFTTarget");
  const merkleNFTTarget = await MerkleNFTTarget.deploy(
    axelar.target.gateway,
    axelar.source.name,
    bridge.source.contract
  );
  await merkleNFTTarget.deployed();
  console.log(`MerkleNFTTarget deployed to ${merkleNFTTarget.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
