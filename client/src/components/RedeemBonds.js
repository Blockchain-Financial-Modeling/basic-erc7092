import React from "react";
import { Button, Card, CardContent } from "semantic-ui-react";

function RedeemBonds() {
    return (
        <div className="register-investor">
            <Card fluid>
                <CardContent textAlign="left">
                    <strong>Redeem Bonds</strong>
                    <br></br>
                    <br></br>
                    <Button primary fluid>
                        Redeem
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

export default RedeemBonds;