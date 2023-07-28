import React, { useCallback, useEffect } from "react";
import 'semantic-ui-css/semantic.min.css';
import ERC20Instance from "./contracts/ERC20.json";
import ERC7092Instance from "./contracts/ERC7092.json";
import { web3Connection } from "./utils/web3Connection";
import { getContract } from "./utils/getContract";
import "./App.css";

function App() {
  const loadDataFromContract = useCallback(async () => {
    let {web3, account} = await web3Connection();
    let erc20 = await getContract(web3, ERC20Instance);
    let erc7092 = await getContract(web3, ERC7092Instance);

    let bond = await erc7092.methods.getBondInfo().call({ from: account });

    console.log('bond;', bond);
  });

  useEffect(() => {
    loadDataFromContract();
  });

  return (
    <div className="App">
      App
    </div>
  );
}

export default App;
