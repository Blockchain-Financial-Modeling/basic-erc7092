import React from "react";
import { useSelector } from "react-redux";
import {
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHeader,
    TableHeaderCell,
    TableRow
} from "semantic-ui-react";
import Formate from "../utils/Formate";

function InvestorsList() {
    const listOfInvestors = useSelector(state => {
        return state.data.investors;
    });

    const tokenSymbol = useSelector(state => {
        return state.data.tokenSymbol;
    });

    const bondSymbol = useSelector(state => {
        return state.data.bondsSymbol;
    });

    const bondBalances = useSelector(state => {
        return state.data.investorsBalances;
    });

    const interests = useSelector(state => {
        return state.data.interests;
    });

    let totalInterest = 0;
    for (let i = 0; i < interests.length; i++) {
        totalInterest += interests[i];
    }

    const renderedInvestors = listOfInvestors.map((investor, index) => {
        return (
            <TableRow key={index}>
                <TableCell>{investor.investor}</TableCell>
                <TableCell textAlign="right" warning>{Formate(investor.principal)} {tokenSymbol}</TableCell>
                <TableCell textAlign="right" positive>{Formate(bondBalances[index])} {bondSymbol}</TableCell>
                <TableCell textAlign="right" warning>{Formate(interests[index])} {tokenSymbol}</TableCell>
            </TableRow>
        );
    });

    return (
        <div className="register-investor">
            <Card fluid>
                <CardContent textAlign="left">
                    <strong>List of Investors</strong>
                    <br></br>
                    <br></br>
                    {
                        renderedInvestors.length > 0 &&
                        <Table celled>
                            <TableHeader>
                                <TableRow>
                                    <TableHeaderCell>address</TableHeaderCell>
                                    <TableHeaderCell textAlign="right">Principal</TableHeaderCell>
                                    <TableHeaderCell textAlign="right">Balance</TableHeaderCell>
                                    <TableHeaderCell textAlign="right">Interest (1A)</TableHeaderCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {renderedInvestors}
                            </TableBody>
                            <TableFooter fullWidth>
                                <TableRow>
                                    <TableHeaderCell colSpan='3' />
                                    <TableHeaderCell textAlign="right"><strong style={{ color: 'darkred' }}>{Formate(totalInterest)} {tokenSymbol}</strong></TableHeaderCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    }
                </CardContent>
            </Card>
        </div>
    );
}

export default InvestorsList;