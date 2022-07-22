// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/access/Ownable.sol";
import "../cbdc-erc-20/cbdc-erc-20.sol";

struct AssetReference {
    string id;
    bool isLocked;
    uint numberTokens;
}

contract AssetReferenceContract is Ownable {
  address cbdc_contract;
  mapping (string => AssetReference) assets;
  mapping (string => bool) assetExists;

  constructor(address _cbdc_contract) {
    cbdc_contract = _cbdc_contract;
  }

  function createAssetReference(string calldata id, uint numberTokens, address recipient) public onlyOwner {
    assets[id].id= id;
    assets[id].isLocked = false;
    assets[id].numberTokens = numberTokens;
    assetExists[id] = true;

    mint(recipient, numberTokens);
  }

  function getAssetReference(string calldata id) public onlyOwner view returns (AssetReference memory) {
    return assets[id];
  }

  function lockAssetReference(string calldata id) public onlyOwner {
    require(isPresent(id));
    require(!isAssetLocked(id));

    assets[id].isLocked = true;
  }

  //Don't care if it is already unlocked
  function unLockAssetReference(string calldata id) public onlyOwner {
    bool exists = assetExists[id];
    require(exists);

    assets[id].isLocked = false;
  }

  function deleteAssetReference(string calldata id) public onlyOwner {
    require(isPresent(id));
    require(!isAssetLocked(id));

    delete assets[id];
    assetExists[id] = false;
  }

  function isPresent(string calldata id) public onlyOwner view returns (bool) {
    return assetExists[id];
  }

   function isAssetLocked(string calldata id) public onlyOwner view returns (bool) {
    return assets[id].isLocked;
  }

  // #### 

  function mint(address account, uint256 amount) public onlyOwner {
    (bool success, ) = cbdc_contract.call(
      abi.encodeWithSignature("mint(address,uint256)", account, amount)
    );

    require(success, "call failed");
  }
}
