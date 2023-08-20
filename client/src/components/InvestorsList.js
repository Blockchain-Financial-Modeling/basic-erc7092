import React from "react";
import { useSelector } from "react-redux";
import {
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
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

    const renderedInvestors = listOfInvestors.map((investor, index) => {
        return (
            <TableRow key={index}>
                <TableCell>{investor.investor}</TableCell>
                <TableCell textAlign="right" warning>{Formate(investor.principal / 1e18)} {tokenSymbol}</TableCell>
                <TableCell textAlign="right" positive>{Formate(bondBalances[index] / 1e18)} {bondSymbol}</TableCell>
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
                                </TableRow>
                                
                            </TableHeader>
                            <TableBody>
                                {renderedInvestors}
                            </TableBody>
                        </Table>
                    }
                </CardContent>
            </Card>
        </div>
    );
}

export default InvestorsList;