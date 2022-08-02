// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
import "remix_tests.sol";
import "../contracts/CBDCcontract.sol";
import "../contracts/AssetReferenceContract.sol";

contract AssetReferenceContractTest {

    AssetReferenceContract s;
    CBDCcontract cbdc_contract;

    function beforeEach () public {
        cbdc_contract = new CBDCcontract();
        s = new AssetReferenceContract(address(cbdc_contract));

        cbdc_contract.transferOwnership(address(s));
    }

    function createAssetReferenceSuccessfully () public {
        s.createAssetReference("id1", 123, address(0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2));

        AssetReference memory asset = s.getAssetReference("id1");
        Assert.equal(asset.id, "id1", "asset reference id did not match");
        Assert.equal(asset.isLocked, false, "asset reference lock state did not match");
        Assert.equal(asset.amount, 123, "asset reference amount did not match");
        Assert.equal(asset.recipient, address(0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2), "asset reference recipient did not match");

        uint256 balance = cbdc_contract.balanceOf(address(0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2));
        Assert.equal(balance, 123, "tokens minted did not match");
    }

    function lockAndUnlockAssetReferenceSuccessfully () public {
        s.createAssetReference("id1", 123, address(0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2));

        s.lockAssetReference("id1");
        AssetReference memory asset1 = s.getAssetReference("id1");
        Assert.equal(asset1.id, "id1", "asset reference id did not match");
        Assert.equal(asset1.isLocked, true, "asset reference lock state did not match");

        s.unLockAssetReference("id1");
        asset1 = s.getAssetReference("id1");
        Assert.equal(asset1.id, "id1", "asset reference id did not match");
        Assert.equal(asset1.isLocked, false, "asset reference lock state did not match");
    }

    function deleteAssetReferenceSuccessfully () public {
        s.createAssetReference("id1", 123, address(0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2));

        uint256 balance = cbdc_contract.balanceOf(address(0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2));
        Assert.equal(balance, 123, "tokens minted did not match");

        s.deleteAssetReference("id1");

        bool exists = s.isPresent("id1");
        Assert.equal(exists, false, "asset reference did not match");

        balance = cbdc_contract.balanceOf(address(0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2));
        Assert.equal(balance, 0, "tokens minted did not match");
    }

    function splitAssetReference () public {
        s.createAssetReference("id1", 123, address(0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2));
        s.splitAssetReference("id1", 100, "id2");

        AssetReference memory asset1 = s.getAssetReference("id1");
        Assert.equal(asset1.id, "id1", "asset reference id did not match");
        Assert.equal(asset1.isLocked, false, "asset reference lock state did not match");
        Assert.equal(asset1.amount, 100, "asset reference amount did not match");
        Assert.equal(asset1.recipient, address(0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2), "asset reference recipient did not match");

        AssetReference memory asset2 = s.getAssetReference("id2");
        Assert.equal(asset2.id, "id2", "asset reference id did not match");
        Assert.equal(asset2.isLocked, false, "asset reference lock state did not match");
        Assert.equal(asset2.amount, 23, "asset reference amount did not match");
        Assert.equal(asset2.recipient, address(0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2), "asset reference recipient did not match");
    }

    function mergeAssetReferences () public {
        s.createAssetReference("id1", 123, address(0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2));
        s.createAssetReference("id2", 77, address(0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2));
        s.mergeAssetReferences("id1", "id2");

        AssetReference memory asset1 = s.getAssetReference("id1");
        Assert.equal(asset1.id, "id1", "asset reference id did not match");
        Assert.equal(asset1.isLocked, false, "asset reference lock state did not match");
        Assert.equal(asset1.amount, 200, "asset reference amount did not match");
        Assert.equal(asset1.recipient, address(0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2), "asset reference recipient did not match");
    }
}