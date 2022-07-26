// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0;

import "@openzeppelin/contracts/access/Ownable.sol";

struct AssetReference{
    string id;
    bool isLocked;
    uint numberTokens;
}

//TODO: DETEMINE CALLDATA VS MEMORY
contract AssetReferenceContract is Ownable {
  address cbdc_contract;
  mapping (string => AssetReference) assets;
  mapping (string => bool) assetExists;

  constructor(address account) {
    cbdc_contract = account;
  }

  function createAssetReference(string calldata id, uint numberTokens, address recipient) public onlyOwner {
      assets[id].id= id;
      assets[id].numberTokens = numberTokens;
      assets[id].isLocked = false;

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
    require(isPresent(id));

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
