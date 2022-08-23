// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.15;

import "./MyOwnable.sol";

struct AssetReference {
    string id;
    bool isLocked;
    uint amount;
    address recipient;
}

contract AssetReferenceContract is MyOwnable {
  address cbdc_contract;
  mapping (string => AssetReference) assets;
  mapping (string => bool) assetExists;

  constructor(address account) {
    cbdc_contract = account;
  }

  function createAssetReference(string calldata id, uint amount, address recipient) public onlyOwner {
    assets[id].id= id;
    assets[id].amount = amount;
    assets[id].isLocked = false;
    assets[id].recipient = recipient;

    assetExists[id] = true;
  }

  function lockAssetReference(string calldata id) public onlyOwner {
    require(isPresent(id), "The asset reference does not exist");
    require(!isAssetLocked(id), "The asset reference is already locked");

    assets[id].isLocked = true;
  }

  function unLockAssetReference(string calldata id) public onlyOwner {
    require(isPresent(id), "The asset reference does not exist");

    assets[id].isLocked = false;
  }

  function deleteAssetReference(string calldata id) public onlyOwner {
    require(isPresent(id), "The asset reference does not exist");
    require(isAssetLocked(id), "The asset reference is locked");

    burn(assets[id].amount);

    delete assets[id];
    assetExists[id] = false;
  }

  function isPresent(string calldata id) public view returns (bool) {
    return assetExists[id];
  }

  function isAssetLocked(string calldata id) public view returns (bool) {
    return assets[id].isLocked;
  }

  function getAssetReference(string calldata id) public view returns (AssetReference memory) {
    return assets[id];
  }

  function mint(address account, uint256 amount) public onlyOwner {
    (bool success, ) = cbdc_contract.call(
      abi.encodeWithSignature("mint(address,uint256)", account, amount)
    );

    require(success, "mint call failed");
  }

  function burn(uint256 amount) public onlyOwner {
    (bool success, ) = cbdc_contract.call(
      abi.encodeWithSignature("burn(uint256)", amount)
    );

    require(success, "burn call failed");
  }

  function checkValidBridgeBack(string calldata id, uint256 amount) public view returns (bool) {
    require(isPresent(id), "The asset reference does not exist");
    
    return (assets[id].amount >= amount);
  }
}
