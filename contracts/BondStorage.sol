// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./utils/IData.sol";

contract BondStorage is IData {
    mapping(string => Bond) internal _bonds;
    mapping(string => Issuer) internal issuer;
    mapping(address => uint256) internal _principals;
    mapping(address => mapping(address => uint256)) internal _approvals;
    mapping(address => bool) public isRegistered;

    event BondIssued(Bond _bond, Offer[] _offers);
    event Redeemed();

    string public bondISIN;
    address public bondManager;
    uint256 public lock;
    uint256 public issued;
    uint256 public redeemed;

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