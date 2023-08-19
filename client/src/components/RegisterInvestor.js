import React, { useState } from "react";
import { Button, Card, CardContent, Input } from "semantic-ui-react";
import ERC20Instance from "../contracts/ERC20.json";
import ERC7092Instance from "../contracts/ERC7092.json";
import { web3Connection } from "../utils/web3Connection";
import { getContract } from "../utils/getContract";
import { useDispatch } from "react-redux";
import { setInvestors, setLoading, setUSDCBalance } from "../store";

function RegisterInvestor() {
    const [amount, setAmount] = useState('');
    const [investorAddress, setInvestorAddress] = useState('');

    const dispatch = useDispatch();

    const register = async () => {
        let {web3, account} = await web3Connection();
        let erc20 = await getContract(web3, ERC20Instance);
        let erc7092 = await getContract(web3, ERC7092Instance);

        let _amount = web3.utils.toWei(amount);

        await erc7092.methods.register(investorAddress, _amount)
            .send({ from: account })
            .on('transactionHash', hash => {
                dispatch(setLoading(true));
                setAmount('');
                setInvestorAddress('');
            })
            .on('receipt', receipt => {
                dispatch(setLoading(false));
            });

        let balance = await erc20.methods.balanceOf(account).call({ from: account });
        balance = web3.utils.fromWei(balance);

        let _listOfInvestors = await erc7092.methods.getListOfInvestorsOffer().call({ from: account });

        dispatch(setUSDCBalance(balance));
        dispatch(setInvestors(_listOfInvestors));
    }

    return (
        <div className="register-investor">
            <Card fluid>
                <CardContent textAlign="left">
                    <strong>Register Investor</strong>
                    <br></br>
                    <br></br>
                    <Input
                        fluid
                        size="large"
                    placeholder="INVESTOR ADDRESS"
                        value={investorAddress}
                        onChange={e => setInvestorAddress(e.target.value)}
                    />
                    <br></br>
                    <Input
                        fluid
                        size="large"
                        placeholder="AMOUNT TO INVEST"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                    />
                    <br></br>
                    <Button primary fluid onClick={register}>
                        Register
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

export default RegisterInvestor;