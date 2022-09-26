import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";
import "hardhat-deploy";

import * as dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/config";

dotenv.config();

export const accounts = process.env.DEPLOYER_PRIVATE_KEY !== undefined ? [process.env.DEPLOYER_PRIVATE_KEY] : [];

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      forking: {
        url: "https://ethereum-ropsten-rpc.allthatnode.com",
      },
    },
    ropsten: {
      chainId: 3,
      url: "https://ethereum-ropsten-rpc.allthatnode.com",
      accounts,
    },
    "moombeam-alpha": {
      chainId: 1287,
      url: "https://rpc.api.moonbase.moonbeam.network",
      accounts,
    },
  },
};

export default config;
