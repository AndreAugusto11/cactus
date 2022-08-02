// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
import "remix_tests.sol";
import "../contracts/CBDCcontract.sol";

contract CBDCcontractTest {

    CBDCcontract s;
    function beforeAll () public {
        s = new CBDCcontract();
    }

    function testTokenNameAndSymbol () public {
        Assert.equal(s.name(), "CentralBankDigitalCurrency", "token name did not match");
        Assert.equal(s.symbol(), "CBDC", "token symbol did not match");
    }

    function mintAndBurnTokens () public {
        s.mint(address(0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2), 222);
        uint256 balance = s.balanceOf(address(0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2));
        Assert.equal(balance, 222, "tokens minted did not match");

        s.burn(address(0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2), 121);
        balance = s.balanceOf(address(0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2));
        Assert.equal(balance, 101, "tokens minted did not match");
    }
}