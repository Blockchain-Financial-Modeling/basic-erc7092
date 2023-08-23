import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Button,
    Card,
    CardContent,
    Grid,
    GridColumn,
    GridRow,
    Icon,
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHeader,
    TableHeaderCell,
    TableRow
} from "semantic-ui-react";
import { web3Connection } from "../utils/web3Connection";
import { getContract } from "../utils/getContract";
import CouponPaymentInstance from "../contracts/CouponPayment.json";
import Formate from "../utils/Formate";
import { setCoupons } from "../store";

function CouponsList() {
    const dispatch = useDispatch();

    const tokenSymbol = useSelector(state => {
        return state.data.tokenSymbol;
    });

    const coupons = useSelector(state => {
        return state.data.coupons;
    });

    const renderedReceipt = coupons.map((receipt, index) => {
        return (
            <TableRow key={index}>
                <TableCell>{receipt.issuerName}</TableCell>
                <TableCell textAlign="right">{Formate(receipt.issueVolume)} {tokenSymbol}</TableCell>
                <TableCell warning textAlign="center">{receipt.couponRate / 100}%</TableCell>
                <TableCell positive textAlign="right">{Formate(receipt.interestPaid / 1e18)} {tokenSymbol}</TableCell>
            </TableRow>
        );
    });

    const loadCoupons = async () => {
        let {web3, account} = await web3Connection();
        let couponPayment = await getContract(web3, CouponPaymentInstance);

        let coupons = await couponPayment.methods.getListOfIntesrestsPaid().call({ from: account });

        dispatch(setCoupons(coupons));
    }

    return (
        <div className="register-investor">
            <Card fluid>
                <CardContent textAlign="left">
                    <Grid columns={2}>
                        <GridRow>
                            <GridColumn textAlign="left"><strong>Coupons Payment</strong></GridColumn>
                            <GridColumn textAlign="right">
                                <Button icon onClick={loadCoupons}>
                                    <Icon name='refresh' color="purple" />
                                </Button>
                            </GridColumn>
                        </GridRow>
                    </Grid>
                    <br></br>
                    <br></br>
                    {
                        coupons.length > 0 &&
                        <Table celled>
                            <TableHeader>
                                <TableRow>
                                    <TableHeaderCell>Issuer</TableHeaderCell>
                                    <TableHeaderCell textAlign="right">Issue Volume</TableHeaderCell>
                                    <TableHeaderCell textAlign="center">Coupon rate</TableHeaderCell>
                                    <TableHeaderCell textAlign="right">Total Interest Paid</TableHeaderCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {renderedReceipt}
                            </TableBody>
                        </Table>
                    }
                </CardContent>
            </Card>
        </div>
    );
}

export default CouponsList;