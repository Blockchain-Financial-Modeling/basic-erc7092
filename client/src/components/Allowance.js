import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Input, Button, Card, CardContent, Dropdown } from "semantic-ui-react";
import ERC20Instance from "../contracts/ERC20.json";
import ERC7092Instance from "../contracts/ERC7092.json";
import { web3Connection } from "../utils/web3Connection";
import { getContract } from "../utils/getContract";
import { setLoading } from "../store";

function Allowance() {
    const [amount, setAmount] = useState('');
    const [asset, setAsset] = useState('');

    const dispatch = useDispatch();

    const options = [
        { key: 1, text: "USDC", value: "USDC" },
        { key: 2, text: "TSLA30", value: "TSLA30" }
    ];

    const allow = async () => {
        let {web3, account} = await web3Connection();
        let erc7092 = await getContract(web3, ERC7092Instance);

        let erc7092Address = erc7092._address;

        let contract = null;
        let allowedAmount = amount;

        if(asset === "USDC") {
            contract = await getContract(web3, ERC20Instance);
            allowedAmount = web3.utils.toWei(amount);
        } else {
            contract = await getContract(web3, ERC7092Instance);
        }

        await contract.methods.approve(erc7092Address, allowedAmount)
            .send({ from: account })
            .on('transactionHash', hash => {
                dispatch(setLoading(true));
                setAmount('');
                console.log('Tx Hash:', hash);
            })
            .on('receipt', receipt => {
                console.log('receipt:', receipt);
                dispatch(setLoading(false));
            });

        setAsset('');
        setAmount('');
    }

    return (
        <div className="register-investor">
            <Card fluid>
                <CardContent textAlign="left">
                    <strong>Allow the Manager to Transfer your Assets</strong>
                    <br></br>
                    <br></br>
                    <Dropdown
                        placeholder="SELECT ASSET"
                        options={options}
                        value={asset}
                        onChange={(e, data) => setAsset(data.value)}
                    />
                    <br></br>
                    <br></br>
                    <Input
                        fluid
                        size="large"
                        placeholder="AMOUNT TO ALLOW"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                    />
                    <br></br>
                    <Button primary fluid onClick={allow}>
                        Allow
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

export default Allowance;