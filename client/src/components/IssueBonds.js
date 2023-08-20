import React from "react";
import { Button, Card, CardContent } from "semantic-ui-react";
import { useDispatch } from "react-redux";
import ERC20Instance from "../contracts/ERC20.json";
import ERC7092Instance from "../contracts/ERC7092.json";
import { web3Connection } from "../utils/web3Connection";
import { getContract } from "../utils/getContract";
import { setInvestorsBalances, setLoading } from "../store";

function IssueBonds() {
    const dispatch = useDispatch();

    const issue = async () => {
        let {web3, account} = await web3Connection();
        let erc7092 = await getContract(web3, ERC7092Instance);

        await erc7092.methods.issue()
            .send({ from: account })
            .on('transactionHash', hash => {
                dispatch(setLoading(true));
            })
            .on('receipt', receipt => {
                dispatch(setLoading(false));
            });

        let listOfInvestors = await erc7092.methods.getListOfInvestorsOffer().call({ from: account });

        let bondBalance = [];
        for(let i = 0; i < listOfInvestors.length; i++) {
            let _investor = listOfInvestors[i].investor;
    
            let principal = await erc7092.methods.principalOf(_investor).call({ from: account });
            let denomination = await erc7092.methods.denomination().call({ from: account });
            let balance = principal / denomination;
    
            bondBalance.push(balance);
        }

        dispatch(setInvestorsBalances(bondBalance));
    };

    return (
        <div className="register-investor">
            <Card fluid>
                <CardContent textAlign="left">
                    <strong>Issue Bonds</strong>
                    <br></br>
                    <br></br>
                    <Button primary fluid onClick={issue}>
                        Issue
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

export default IssueBonds;