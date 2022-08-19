// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  let [backend, client1, client2] = await ethers.getSigners();

  const ERC20Basic = await ethers.getContractFactory("ERC20Basic");
  let token = await ERC20Basic.deploy(
    1000
  );
  await token.deployed();

  

  const Airdrop = await ethers.getContractFactory("Airdrop");
  let airdrop = await Airdrop.deploy(
    "savvycoin",
    "SVC",
    18,
    token.address,
    backend.address
  );
  await airdrop.deployed();

  await token.connect(backend).transfer(airdrop.address, 500);

  let signature = await client1._signTypedData(
    {
      name: "savvycoin",
      version: "1",
      chainId: 31337,
      verifyingContract: airdrop.address,
    },
    {
      Permit: [
        { name: "owner", type: "address" },
        { name: "spender", type: "address" },
        { name: "value", type: "uint256" },
        { name: "deadline", type: "uint256" },
        { name: "nonce", type: "uint256" },
      ],
    },
    {
      owner: client1.address,
      spender: backend.address,
      value: 10,
      deadline: 100000000000,
      nonce: 0,
    }
  );

  console.log(backend.address, airdrop.address);

  signature = signature.substring(2);
  const r = "0x" + signature.substring(0, 64);
  const s = "0x" + signature.substring(64, 128);
  const v = parseInt(signature.substring(128, 130), 16);

  console.log("r:", r);
  console.log("s:", s);
  console.log("v:", v);
  console.log(signature);

  await airdrop.withdrawWrapper(
    client1.address,
    10,
    100000000000,
    0,
    v,
    r,
    s
  );

  console.log(await token.balanceOf(client1.address));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});