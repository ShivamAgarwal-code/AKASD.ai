require("@matterlabs/hardhat-zksync-solc");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  zksolc: {
    version: "1.3.9",
    compilerSource: "binary",
    settings: {
      optimizer: {
        enabled: true,
      },
    },
  },
  networks: {
    amoy: {
      url: "https://rpc-amoy.polygon.technology/",
      ethNetwork: "amoy",
      accounts: [`0x${process.env.PRIVATE_KEY}`],
      chainId: 80002,
      zksync: true,
    },
  },
  paths: {
    artifacts: "./artifacts-zk",
    cache: "./cache-zk",
    sources: "./contracts",
    tests: "./test",
  },
  solidity: {
    version: "0.8.17",
    defaultNetwork: "amoy",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
