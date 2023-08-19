// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BondStorage {
    struct Bond {
        string isin;
        string name;
        string symbol;
        address currency;
        uint256 denomination;
        uint256 issueVolume;
        uint256 couponRate;
        uint256 issueDate;
        uint256 maturityDate;
    }

    struct Issuer {
        address accountAddress;
        string name;
        string country;
        string email;
        string category;
        string creditRating;
        uint256 carbonCredit;
    }

    struct Offer {
        address investor;
        uint256 principal;
    }

    mapping(string => Bond) internal _bonds;
    mapping(string => Issuer) internal issuer;
    mapping(address => uint256) internal _principals;
    mapping(address => mapping(address => uint256)) internal _approvals;

    event BondIssued(Bond _bond, Offer[] _offers);
    event Redeemed();

    string public bondISIN;
    address public bondManager;
    uint256 public lock;

    Offer[] internal _investorsOffer;

    modifier onlyBondManager {
        require(msg.sender == bondManager, "ERC7092: NOT_ALLOWED");
        _;
    }

    modifier notLocked {
        require(lock == 1, "REDEEM_IS_LOCKED");
        _;
    }
}