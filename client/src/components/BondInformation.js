import React from "react";
import { useSelector } from "react-redux";
import { Button,
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

function BondInformation() {
    const bonds = useSelector(state => {
        return state.data.bonds;
    });

    const tokenSymbol = useSelector(state => {
        return state.data.tokenSymbol;
    });

    return (
        <div className="register-investor">
            <Card fluid>
                <CardContent textAlign="left">
                    <strong>Bond Information</strong>
                    <br></br>
                    <br></br>
                    {
                        bonds.length > 0 &&
                        <Table celled>
                            <TableHeader>
                                <TableRow>
                                    <TableHeaderCell>ISIN</TableHeaderCell>
                                    <TableHeaderCell>Name</TableHeaderCell>
                                    <TableHeaderCell textAlign="right">Denomination</TableHeaderCell>
                                    <TableHeaderCell textAlign="right">Volume</TableHeaderCell>
                                    <TableHeaderCell textAlign="right">Coupon Rate</TableHeaderCell>
                                    <TableHeaderCell textAlign="right">Maturity Date</TableHeaderCell>
                                </TableRow>
                                
                            </TableHeader>
                            <TableBody>
                                <TableRow key={0}>
                                    <TableCell>{bonds.isin}</TableCell>
                                    <TableCell positive>{bonds.name}</TableCell>
                                    <TableCell textAlign="right">{Formate(bonds.denomination)} {tokenSymbol}</TableCell>
                                    <TableCell textAlign="right">{Formate(bonds.issueVolume)} {tokenSymbol}</TableCell>
                                    <TableCell warning textAlign="right">{bonds.couponRate / 100}%</TableCell>
                                    <TableCell positive textAlign="right">{(new Date(bonds.maturityDate * 1000)).toLocaleDateString()}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    }
                </CardContent>
            </Card>
        </div>
    );
}

export default BondInformation;