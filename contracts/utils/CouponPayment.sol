// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IERC20.sol";
import "./IData.sol";

contract CouponPayment {
    uint256 constant private NUMBER_OF_SECONDS_IN_YEAR = 31536000;
    string issuerName;
    uint public lastTimeStamp;
    uint256 public issueVolume;
    uint256 denomination;
    uint256 couponRate;
    address manager;
    address currency;

    IData.Offer[] internal offers;
    IData.CouponPaymentReceipt[] internal interestsPaid;

    modifier onlyManager {
        require(msg.sender == manager, "CouponPayment: ONLY_MANAGER");
        _;
    }

    constructor(
        string memory _issuerName,
        uint256 _issueVolume,
        uint256 _denomination,
        uint256 _couponRate,
        address _currency
    ) {
        issuerName = _issuerName;
        issueVolume = _issueVolume;
        denomination = _denomination;
        couponRate = _couponRate;
        currency = _currency;

        manager = msg.sender;
    }

    function payInterest() public {
        uint256 totalInterest;
        for (uint256 i = 0; i < offers.length; i++) {
            uint256 principal = offers[i].principal;
            address investor = offers[i].investor;

            uint256 interest = (principal * 1 ether) * couponRate * (120) / (10000 * NUMBER_OF_SECONDS_IN_YEAR);

            IERC20(currency).transfer(investor, interest);
            
            totalInterest += interest;
        }

        IData.CouponPaymentReceipt memory receipt = IData.CouponPaymentReceipt({
            issuerName: issuerName,
            issueVolume: issueVolume,
            couponRate: couponRate,
            interestPaid: totalInterest
        });

        interestsPaid.push(receipt);
    }

    function setInvestersOffers(IData.Offer[] memory _offers) external onlyManager {
        for(uint256 i = 0; i < _offers.length; i++) {
            offers.push(_offers[i]);
        }
    }

    function getListOfIntesrestsPaid() external view returns(IData.CouponPaymentReceipt[] memory) {
        return interestsPaid;
    }
}