const ERC20 = artifacts.require("ERC20");
const ERC7092 = artifacts.require("ERC7092");
const CouponPayment = artifacts.require("CouponPayment");

module.exports = async function (deployer, network, accounts) {
  let ISSUER = accounts[0];

  //== Deploy the ERC20 contract: Currency
  await deployer.deploy(ERC20, "USDC Token", "USDC");
  let erc20 = await ERC20.deployed();

  //== Deploy the ERC7092 contract: Bonds
  let _issueDate = Math.round(Date.now() / 1000);

  let bond = {
    isin: "US601G7NB1L8",
    name: "TESLA 2030",
    symbol: "TSLA30",
    currency: erc20.address,
    denomination: 100000,
    issueVolume: 10000000000,
    couponRate: 750,
    issueDate: _issueDate,
    maturityDate: _issueDate + 600
  }

  let issuer = {
    accountAddress: ISSUER,
    name: "Tesla",
    country: "US",
    email: "info@tesla.com",
    category: "CORP",
    creditRating: "AA-",
    carbonCredit: 1200
  }

  await deployer.deploy(ERC7092, bond, issuer);

  // Deploy the CouponPayment contract
  await deployer.deploy(
    CouponPayment,
    "Tesla",
    10000000000,
    100000,
    750,
    erc20.address
  );
  let couponPayment = await CouponPayment.deployed();
};
