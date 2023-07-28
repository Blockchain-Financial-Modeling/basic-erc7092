const ERC20 = artifacts.require("ERC20");
const ERC7092 = artifacts.require("ERC7092");

module.exports = async function (deployer, network, accounts) {
  let ISSUER = accounts[0];

  //== Deploy the ERC20 contract: Currency
  await deployer.deploy(ERC20, "USDC Token", "USDC");
  let erc20 = await ERC20.deployed();

  //== Deploy the ERC7092 contract: Bonds
  let _issueDate = Math.round(Date.now() / 1000);

  let bond = {
    isin: "FR601G7NB1L8",
    name: "Peugeot 2030",
    currency: erc20.address,
    denomination: 100,
    issueVolume: 1000,
    couponRate: 100000,
    issueDate: _issueDate,
    maturityDate: _issueDate + 600
  }

  let issuer = {
    accountAddress: ISSUER,
    name: "Peugeot",
    country: "France",
    email: "info@peugeot.fr",
    category: "CORP",
    creditRating: "AA-",
    carbonCredit: 1200
  }

  await deployer.deploy(ERC7092, bond, issuer);
};
