// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IERC7092.sol";
import "./BondStorage.sol";
import "./utils/IERC20.sol";

contract ERC7092 is IERC7092, BondStorage {
    constructor(Bond memory _bond, Issuer memory _issuer) {
        bondISIN = _bond.isin;
        _bonds[bondISIN] = _bond;
        issuer[bondISIN] = _issuer;
        bondManager = msg.sender;

        _bonds[bondISIN].issueDate = block.timestamp;

        uint256 _issueDate = _bonds[bondISIN].issueDate;
        uint256 _maturityDate = _bonds[bondISIN].maturityDate;

        require(_maturityDate > _issueDate, "Constructor: INVALID_MATURITY_DATE");
    }

    function issue() external onlyBondManager {
        _issue();
    }

    function redeem() external notLocked {
        _redeem();
    }

    function register(address _investor, uint256 _amount) onlyBondManager external {
        address _issuer = issuer[bondISIN].accountAddress;

        _investorsOffer.push(Offer({ investor: _investor, principal: _amount }));

        IERC20(_bonds[bondISIN].currency).transferFrom(_investor, _issuer, _amount);
    }

    function unlock() external onlyBondManager {
        require(lock == 0, "ALREADY_UNLOCKED");

        lock = 1;
    }

    function isin() external view returns(string memory) {
        return _bonds[bondISIN].isin;
    }

    function name() external view returns(string memory) {
        return _bonds[bondISIN].name;
    }

    function symbol() external view returns(string memory) {
        return _bonds[bondISIN].symbol;
    }

    function currency() external view returns(address) {
        return _bonds[bondISIN].currency;
    }

    function denomination() external view returns(uint256) {
        return _bonds[bondISIN].denomination;
    }

    function issueVolume() external view returns(uint256) {
        return _bonds[bondISIN].issueVolume;
    }

    function couponRate() external view returns(uint256) {
        return _bonds[bondISIN].couponRate;
    }

    function issueDate() external view returns(uint256) {
        return _bonds[bondISIN].issueDate;
    }

    function maturityDate() external view returns(uint256) {
        return _bonds[bondISIN].maturityDate;
    }

    function principalOf(address _account) external view returns(uint256) {
        return _principals[_account];
    }

    function approval(address _owner, address _spender) external view returns(uint256) {
        return _approvals[_owner][_spender];
    }

    function approve(address _spender, uint256 _amount) external returns(bool) {
        address _owner = msg.sender;
        _approve(_owner, _spender, _amount);

        return true;
    }

    function decreaseAllowance(address _spender, uint256 _amount) external returns(bool) {
        address _owner = msg.sender;

        _decreaseAllowance(_owner, _spender, _amount);

        return true;
    }

    function transfer(address _to, uint256 _amount, bytes calldata _data) external returns(bool) {
        address _from = msg.sender;

        _transfer(_from, _to, _amount, _data);

        return true;
    }

    function transferFrom(address _from, address _to, uint256 _amount, bytes calldata _data) external returns(bool) {
        address _spender = msg.sender;

        _spendApproval(_from, _spender, _amount);

        _transfer(_from, _to, _amount, _data);

        return true;
    }

    function getBondInfo() external view returns(Bond memory) {
        return _bonds[bondISIN];
    }

    function getIssuerInfo() external view returns(Issuer memory) {
        return issuer[bondISIN];
    }

    function getListOfInvestorsOffer() public view returns(Offer[] memory) {
        return _investorsOffer;
    }

    function _issue() internal virtual  {
        uint256 volume;
        uint256 _issueVolume = _bonds[bondISIN].issueVolume;

        for(uint256 i; i < _investorsOffer.length; i++) {
            address investor = _investorsOffer[i].investor;
            uint256 principal = _investorsOffer[i].principal;
            uint256 _denomination = _bonds[bondISIN].denomination;

            require(investor != address(0), "ERC7092: ZERO_ADDRESS_INVESTOR");
            require(
                principal != 0 && (principal * _denomination) % _denomination == 0,
                "ERC: INVALID_PRINCIPAL_AMOUNT"
            );

            volume += principal;
            _principals[investor] = principal;
        }

        require(volume == _issueVolume, "ERC7092: INVALID_ISSUE_VOLUME");

        emit BondIssued(_bonds[bondISIN], _investorsOffer);
    }

    function _redeem() internal {
        uint256 _maturityDate;
        require(block.timestamp > _maturityDate, "ERC2721: WAIT_MATURITY");

        for(uint256 i; i < _investorsOffer.length; i++) {
            if(_principals[_investorsOffer[i].investor] != 0) {

                uint256 principal = _principals[_investorsOffer[i].investor];

                _principals[_investorsOffer[i].investor] = 0;

                // divide by 1e4 because the interest rate is expressed in basis point
                uint256 interest = (principal * _bonds[bondISIN].couponRate * 1 ether) / (10000);

                uint256 amount = (principal * 1 ether) + interest;

                IERC20(_bonds[bondISIN].currency).transfer(_investorsOffer[i].investor, amount);
            }
        }

        emit Redeemed();

        lock = 0;
    }

    function _approve(address _owner, address _spender, uint256 _amount) internal virtual {
        require(_owner != address(0), "ERC7092: OWNER_ZERO_ADDRESS");
        require(_spender != address(0), "ERC7092: SPENDER_ZERO_ADDRESS");
        require(_amount > 0, "ERC7092: INVALID_AMOUNT");

        uint256 principal = _principals[_owner];
        uint256 _approval = _approvals[_owner][_spender];
        uint256 _denomination = _bonds[bondISIN].denomination;
        uint256 _maturityDate = _bonds[bondISIN].maturityDate;

        require(block.timestamp < _maturityDate, "ERC7092: BONDS_MATURED");
        require(_amount <= principal, "ERC7092: INSUFFICIENT_BALANCE");
        require((_amount * _denomination) % _denomination == 0, "ERC7092: INVALID_AMOUNT");

        _approvals[_owner][_spender]  = _approval + _amount;

        emit Approved(_owner, _spender, _amount);
    }

    function _decreaseAllowance(address _owner, address _spender, uint256 _amount) internal virtual {
        require(_owner != address(0), "ERC7092: OWNER_ZERO_ADDRESS");
        require(_spender != address(0), "ERC7092: SPENDER_ZERO_ADDRESS");
        require(_amount > 0, "ERC7092: INVALID_AMOUNT");

        uint256 _approval = _approvals[_owner][_spender];
        uint256 _denomination = _bonds[bondISIN].denomination;
        uint256 _maturityDate = _bonds[bondISIN].maturityDate;

        require(block.timestamp < _maturityDate, "ERC7092: BONDS_MATURED");
        require(_amount <= _approval, "ERC7092: NOT_ENOUGH_APPROVAL");
        require((_amount * _denomination) % _denomination == 0, "ERC7092: INVALID_AMOUNT");

        _approvals[_owner][_spender]  = _approval - _amount;

        emit AllowanceDecreased(_owner, _spender, _amount);
    }

    function _transfer(address _from, address _to, uint256 _amount, bytes calldata _data) internal virtual {
        require(_from != address(0), "ERC7092: OWNER_ZERO_ADDRESS");
        require(_to != address(0), "ERC7092: SPENDER_ZERO_ADDRESS");
        require(_amount > 0, "ERC7092: INVALID_AMOUNT");

        uint256 principal = _principals[_from];
        uint256 _denomination = _bonds[bondISIN].denomination;
        uint256 _maturityDate = _bonds[bondISIN].maturityDate;

        require(block.timestamp < _maturityDate, "ERC7092: BONDS_MATURED");
        require(_amount <= principal, "ERC7092: INSUFFICIENT_BALANCE");
        require((_amount * _denomination) % _denomination == 0, "ERC7092: INVALID_AMOUNT");

        _beforeBondTransfer(_from, _to, _amount, _data);

        uint256 principalTo = _principals[_to];

        unchecked {
            _principals[_from] = principal - _amount;
            _principals[_to] = principalTo + _amount;
        }

        emit Transferred(_from, _to, _amount, _data);

        _afterBondTransfer(_from, _to, _amount, _data);
    }

    function _spendApproval(address _from, address _spender, uint256 _amount) internal virtual {
        uint256 currentApproval = _approvals[_from][_spender];
        require(_amount <= currentApproval, "ERC7092: INSUFFICIENT_ALLOWANCE");

        unchecked {
            _approvals[_from][_spender] = currentApproval - _amount;
        }
   }

    function _beforeBondTransfer(address _from, address _to, uint256 _amount, bytes calldata _data) internal virtual {}

    function _afterBondTransfer(address _from, address _to, uint256 _amount, bytes calldata _data) internal virtual {}
}