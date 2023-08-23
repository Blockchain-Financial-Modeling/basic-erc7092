import React from "react";
import { Button, Card, CardContent } from "semantic-ui-react";
import { useDispatch } from "react-redux";
import ERC20Instance from "../contracts/ERC20.json";
import CouponPayment from "../contracts/CouponPayment.json";
import { web3Connection } from "../utils/web3Connection";
import { getContract } from "../utils/getContract";
import { setLoading, setPaymentBalance, setUSDCBalance } from "../store";

function FundPaymentContract() {
    const dispatch = useDispatch();

    const addFund = async() => {
        let {web3, account} = await web3Connection();
        let erc20 = await getContract(web3, ERC20Instance);
        let couponPayment = await getContract(web3, CouponPayment);

        let amount = web3.utils.toWei('1000000');

        await erc20.methods.transfer(couponPayment._address, amount)
            .send({ from: account })
            .on('transactionHash', hash => {
                dispatch(setLoading(true));
            })
            .on('receipt', receipt => {
                dispatch(setLoading(false));
            });

        let balance = await erc20.methods.balanceOf(account).call({ from: account });
        let paymentBalance = await erc20.methods.balanceOf(couponPayment._address).call({ from: account });

        dispatch(setUSDCBalance(balance));
        dispatch(setPaymentBalance(paymentBalance));
    }
    return (
        <div className="register-investor">
            <Card fluid>
                <CardContent textAlign="left">
                    <strong>Add Fund To Pay Coupons</strong>
                    <br></br>
                    <br></br>
                    <Button primary fluid onClick={addFund}>
                        Fund
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

export default FundPaymentContract;