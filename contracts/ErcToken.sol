//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

// Contract to mint tokens
contract ErcToken is ERC20 {
    /**
     * By default, ERC20 sets the number of decimals to 18, 
     * so in our _mint function we multiply 100,000 by 10^18 to 
     * mint a total of 100,000 tokens, each with 18 decimal places 
     * (similar to how 1 Eth is made up of 10 to the 18 wei.
     */
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        _mint(msg.sender, 100000 * (10 ** 18));
    }

    // No need for methods to enquire balance and make transfer here,
    // they are built into the original ERC20 token. Here's a list:
    // function name() public view returns (string)
    // function symbol() public view returns (string)
    // function decimals() public view returns (uint8)
    // function totalSupply() public view returns (uint256)
    // function balanceOf(address _owner) public view returns (uint256 balance)
    // function transfer(address _to, uint256 _value) public returns (bool success)
    // function transferFrom(address _from, address _to, uint256 _value) public returns (bool success)
    // function approve(address _spender, uint256 _value) public returns (bool success)
    // function allowance(address _owner, address _spender) public view r
}
