import React from "react";
import { Button, Card, CardContent } from "semantic-ui-react";
import { useDispatch } from "react-redux";
import ERC7092Instance from "../contracts/ERC7092.json";
import CouponPayment from "../contracts/CouponPayment.json";
import { web3Connection } from "../utils/web3Connection";
import { getContract } from "../utils/getContract";
import { setLoading } from "../store";

function AddInvestorsToPayment() {
    const dispatch = useDispatch();

    const addInvestors = async() => {
        let {web3, account} = await web3Connection();
        let erc7092 = await getContract(web3, ERC7092Instance);
        let couponPayment = await getContract(web3, CouponPayment);

        let listOfInvestors = await erc7092.methods.getListOfInvestorsOffer().call({ from: account });

        let list = [];
        for(let i = 0; i < listOfInvestors.length; i++) {
            let _listOfInvestors = listOfInvestors[i];
            let _list = {
                investor: _listOfInvestors.investor,
                principal: _listOfInvestors.principal
            }

            list.push(_list);
        }

        await couponPayment.methods.setInvestersOffers(list)
            .send({ from: account })
            .on('transactionHash', hash => {
                dispatch(setLoading(true));
            })
            .on('receipt', receipt => {
                dispatch(setLoading(false));
            });


    }
    return (
        <div className="register-investor">
            <Card fluid>
                <CardContent textAlign="left">
                    <strong>Submit Investors List To Payment</strong>
                    <br></br>
                    <br></br>
                    <Button primary fluid onClick={addInvestors}>
                        Submit
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

export default AddInvestorsToPayment;