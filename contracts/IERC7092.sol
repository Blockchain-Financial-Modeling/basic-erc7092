// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

/**
* @title ERC-7092 Financial Bonds tandard
*/
interface IERC7092 {
    function isin() external view returns(string memory);
    function name() external view returns(string memory);
    function currency() external view returns(address);
    function denomination() external view returns(uint256);
    function issueVolume() external view returns(uint256);
    function couponRate() external view returns(uint256);
    function issueDate() external view returns(uint256);
    function maturityDate() external view returns(uint256);
    function principalOf(address _account) external view returns(uint256);
    function approval(address _owner, address _spender) external view returns(uint256);

    function approve(address _spender, uint256 _amount) external returns(bool);
    function decreaseAllowance(address _spender, uint256 _amount) external returns(bool);
    function transfer(address _to, uint256 _amount, bytes calldata _data) external returns(bool);
    function transferFrom(address _from, address _to, uint256 _amount, bytes calldata _data) external returns(bool);

    event Transferred(address _from, address _to, uint256 _amount, bytes _data);
    event Approved(address _owner, address _spender, uint256 _amount);
    event AllowanceDecreased(address _owner, address _spender, uint256 _amount);
}