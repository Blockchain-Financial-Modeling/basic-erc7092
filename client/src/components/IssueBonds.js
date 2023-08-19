import React from "react";
import { Button, Card, CardContent } from "semantic-ui-react";

function IssueBonds() {
    return (
        <div className="register-investor">
            <Card fluid>
                <CardContent textAlign="left">
                    <strong>Issue Bonds</strong>
                    <br></br>
                    <br></br>
                    <Button primary fluid>
                        Issue
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

export default IssueBonds;