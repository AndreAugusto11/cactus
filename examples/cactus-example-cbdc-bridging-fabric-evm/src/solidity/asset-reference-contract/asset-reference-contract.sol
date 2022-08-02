// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.15;

import "@openzeppelin/contracts/access/Ownable.sol";

struct AssetReference{
    string id;
    bool isLocked;
    uint amount;
    address recipient;
}

contract AssetReferenceContract is Ownable {
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
    require(isPresent(id));
    require(!isAssetLocked(id));

    assets[id].isLocked = true;
  }

  //Don't care if it is already unlocked
  function unLockAssetReference(string calldata id) public onlyOwner {
    require(isPresent(id));

    assets[id].isLocked = false;
  }

  function deleteAssetReference(string calldata id) public onlyOwner {
    require(isPresent(id));
    require(isAssetLocked(id));

    burn(assets[id].recipient, assets[id].amount);

    delete assets[id];
    assetExists[id] = false;
  }

  function splitAssetReference(string calldata oldID, uint256 amount, string calldata newID) public {
    require(isPresent(oldID), "The asset reference does not exist");
    require(!isAssetLocked(oldID), "The asset reference is not locked");

    require(msg.sender == assets[oldID].recipient, "Only the owner of the asset reference can split it");

    assets[newID].id= newID;
    assets[newID].amount = assets[oldID].amount - amount;
    assets[newID].isLocked = false;
    assets[newID].recipient = assets[oldID].recipient;

    assetExists[newID] = true;

    assets[oldID].amount = amount;
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

  function burn(address account, uint256 amount) public onlyOwner {
    (bool success, ) = cbdc_contract.call(
      abi.encodeWithSignature("burn(address,uint256)", account, amount)
    );

    require(success, "burn call failed");
  }

  // split an asset reference in two?
  // AR1 (C tokens) -> AR2 (A tokens) & AR3 (B tokens), where A + B = C
}
