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

      mint(recipient, amount);
  }

  function lockAssetReference(string calldata id) public onlyOwner {
    require(isPresent(id), "The asset reference does not exist");
    require(!isAssetLocked(id), "The asset reference is already locked");

    assets[id].isLocked = true;
  }

  //Don't care if it is already unlocked
  function unLockAssetReference(string calldata id) public onlyOwner {
    require(isPresent(id), "The asset reference does not exist");

    assets[id].isLocked = false;
  }

  function deleteAssetReference(string calldata id) public onlyOwner {
    require(isPresent(id), "The asset reference does not exist");
    require(isAssetLocked(id), "The asset reference is locked");

    burn(assets[id].recipient, assets[id].amount);

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

  function splitAssetReference(string calldata oldID, uint256 amount, string calldata newID) public onlyOwner {
    require(isPresent(oldID), "The asset reference does not exist");
    require(!isAssetLocked(oldID), "The asset reference is not locked");

    assets[newID].id= newID;
    assets[newID].amount = assets[oldID].amount - amount;
    assets[newID].isLocked = false;
    assets[newID].recipient = assets[oldID].recipient;

    assetExists[newID] = true;

    assets[oldID].amount = amount;
  }

  function mergeAssetReferences(string calldata ID1, string calldata ID2) public onlyOwner {
    // We take ID1 as the representation of all these tokens and discard ID2
    require(isPresent(ID1), "The asset reference does not exist");
    require(!isAssetLocked(ID1), "The asset reference is not locked");

    require(isPresent(ID2), "The asset reference does not exist");
    require(!isAssetLocked(ID2), "The asset reference is not locked");

    assets[ID1].amount = assets[ID1].amount + assets[ID2].amount;

    delete assets[ID2];
    assetExists[ID2] = false;
  }

  function mint(address account, uint256 amount) public onlyOwner {
    (bool success, ) = cbdc_contract.call(
      abi.encodeWithSignature("mint(address,uint256)", account, amount)
    );

    require(success, "mint call failed");
  }

  function burn(address account, uint256 amount) public onlyOwner {
    (bool success, ) = cbdc_contract.call(
      abi.encodeWithSignature("burn(address,uint256)", account, amount)
    );

    require(success, "burn call failed");
  }
}
