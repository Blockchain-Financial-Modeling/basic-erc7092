import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import 'semantic-ui-css/semantic.min.css';
import { Input, Button, Loader, Grid, GridRow, GridColumn } from "semantic-ui-react";
import ERC20Instance from "./contracts/ERC20.json";
import ERC7092Instance from "./contracts/ERC7092.json";
import { web3Connection } from "./utils/web3Connection";
import { getContract } from "./utils/getContract";
import RegisterInvestor from "./components/RegisterInvestor";
import IssueBonds from "./components/IssueBonds";
import RedeemBonds from "./components/RedeemBonds";
import Allowance from "./components/Allowance";
import MintERC20 from "./components/MintERC20";
import BondInformation from "./components/BondInformation";
import InvestorsList from "./components/InvestorsList";
import "./App.css";
import { setBonds, setBondsSymbol, setInvestors, setInvestorsBalances, setTokenSymbol, setUSDCBalance } from "./store";
import Formate from "./utils/Formate";

function App() {
  const [amount, setAmount] = useState('');

  const dispatch = useDispatch();

  const loading = useSelector(state => {
    return state.data.loading;
  });

  const usdcBalance = useSelector(state => {
    return state.data.usdcBalance;
  });

  const investors = useSelector(state => {
    return state.data.investors;
  });

  const loadDataFromContract = useCallback(async () => {
    let {web3, account} = await web3Connection();
    let erc20 = await getContract(web3, ERC20Instance);
    let erc7092 = await getContract(web3, ERC7092Instance);

    let balance = await erc20.methods.balanceOf(account).call({ from: account });
    balance = web3.utils.fromWei(balance);

    let bond = await erc7092.methods.getBondInfo().call({ from: account });
    let symbol = await erc20.methods.symbol().call({ from: account });
    let bondSymbol = await erc7092.methods.symbol().call({ from: account });
    let listOfInvestors = await erc7092.methods.getListOfInvestorsOffer().call({ from: account });

    let bondBalance = [];
    for(let i = 0; i < listOfInvestors.length; i++) {
      let _investor = listOfInvestors[i].investor;

      let principal = await erc7092.methods.principalOf(_investor).call({ from: account });
      let denomination = await erc7092.methods.denomination().call({ from: account });
      let balance = principal / denomination;

      bondBalance.push(balance);
    }

    dispatch(setUSDCBalance(balance));
    dispatch(setInvestors(listOfInvestors));
    dispatch(setInvestorsBalances(bondBalance));
    dispatch(setTokenSymbol(symbol));
    dispatch(setBondsSymbol(bondSymbol));
    dispatch(setBonds(bond));
  });

  useEffect(() => {
    loadDataFromContract();
  }); 

  return (
    <div className="App">
      <Grid stackable columns={2}>
        <GridRow>
          <GridColumn textAlign="left">
            <strong style={{ marginLeft: 50 }}>Balance: {Formate(usdcBalance)} USDC</strong>
          </GridColumn>
          <GridColumn textAlign="right">
            <div className="notification">
              {loading && <Loader inline active size="small">Processing Transaction</Loader>}
            </div>
          </GridColumn>
        </GridRow>
      </Grid>
      <div>
        <Grid stackable columns={2}>
          <GridRow>
            <GridColumn width={5}>
              <IssueBonds />
              <RedeemBonds />
              <RegisterInvestor />
              <br></br>
              <MintERC20 />
              <Allowance />
            </GridColumn>
            <GridColumn width={11}>
              <BondInformation />
              <InvestorsList />
            </GridColumn>
          </GridRow>
        </Grid>
      </div>
    </div>
  );
}

export default App;
