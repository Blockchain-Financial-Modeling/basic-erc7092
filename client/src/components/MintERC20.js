import React from "react";
import { Button, Card, CardContent } from "semantic-ui-react";
import { useDispatch } from "react-redux";
import ERC20Instance from "../contracts/ERC20.json";
import { web3Connection } from "../utils/web3Connection";
import { getContract } from "../utils/getContract";
import { setLoading, setUSDCBalance } from "../store";

function MintERC20() {
    const dispatch = useDispatch();

    const issue = async() => {
        let {web3, account} = await web3Connection();
        let erc20 = await getContract(web3, ERC20Instance);

        let amount = web3.utils.toWei('10000');

        await erc20.methods.mint(account, amount)
            .send({ from: account })
            .on('transactionHash', hash => {
                dispatch(setLoading(true));
            })
            .on('receipt', receipt => {
                dispatch(setLoading(false));
            });

        let balance = await erc20.methods.balanceOf(account).call({ from: account });
        dispatch(setUSDCBalance(balance));
    }
    return (
        <div className="register-investor">
            <Card fluid>
                <CardContent textAlign="left">
                    <strong>Get USDC</strong>
                    <br></br>
                    <br></br>
                    <Button primary fluid onClick={issue}>
                        Get
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

export default MintERC20;