// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CBDCcontract is ERC20, Ownable {
     event MyEvent (
      string date,
      address account,
      uint256 amount
    );

    constructor() ERC20("CentralBankDigitalCurrency", "CBDC") {
    }

    function mint(address account, uint256 amount) external {
        emit MyEvent('hello', account, amount);
        _mint(account, amount);
    }
}
