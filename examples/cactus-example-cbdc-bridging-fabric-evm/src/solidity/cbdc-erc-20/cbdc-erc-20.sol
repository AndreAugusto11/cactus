// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.15;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title SampleERC20
 * @dev Create a sample ERC20 standard token
 */

contract CBDCcontract is Ownable, ERC20 {

    address bridge_address = address(0x17F6AD8Ef982297579C203069C1DbfFE4348c372);
    address asset_ref_contract = address(0);

    constructor() ERC20("CentralBankDigitalCurrency", "CBDC") {
    }

    function setAssetReferenceContract(address contract_address) external onlyOwner {
        asset_ref_contract = contract_address;
    }

    function mint(address account, uint256 amount) external onlyOwner {
        _mint(account, amount);
    }

    function burn(address account, uint256 amount) external onlyOwner {
        _burn(account, amount);
    }

    function escrow(uint256 amount, string calldata asset_ref_id) external checkARContract {
        transfer(bridge_address, amount);

        (bool success, ) = asset_ref_contract.call(
            abi.encodeWithSignature("createAssetReference(string,uint256,address,bool)", asset_ref_id, amount, msg.sender, true)
        );

        require(success, "createAssetReference call failed");
    }

    function _checkAssetRefContract() internal view virtual {
        require(asset_ref_contract != address(0), "CBDCcontract: asset reference contract not defined");
    }

    modifier checkARContract() {
        _checkAssetRefContract();
        _;
    }
}
