require("@nomicfoundation/hardhat-toolbox");


/** @type import('hardhat/config').HardhatUserConfig */

module.exports = {
  defaultNetwork: "develop",
  networks: {
    hardhat: {},
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/ed07f93396a94062945b28125bf6f8f5",
      accounts: [
        "0x7c5312f73d84e969da53987e2d7dbb969c7548ac544123b4306177e49637542c",
      ],
    },
    polygonMumbai: {
      url: "https://polygon-mumbai.g.alchemy.com/v2/GWt1lXNDpSF4krdpwWVUGYsno7n-YMha",
      accounts: [
        "0x7c5312f73d84e969da53987e2d7dbb969c7548ac544123b4306177e49637542c",
      ],
    },
    develop: {
      url: "http://127.0.0.1:8545/",
    },
  },
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  mocha: {
    timeout: 40000,
  },
};
