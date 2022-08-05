/*
 * SPDX-License-Identifier: Apache 2.0
 */

import { Context } from "fabric-contract-api";
import { ChaincodeStub, ClientIdentity } from "fabric-shim";
import { AssetReferenceContract } from ".";

import * as winston from "winston";
import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

class TestContext extends Context {
  public stub: sinon.SinonStubbedInstance<
    ChaincodeStub
  > = sinon.createStubInstance(ChaincodeStub);
  public clientIdentity: sinon.SinonStubbedInstance<
    ClientIdentity
  > = sinon.createStubInstance(ClientIdentity);
  public logging = {
    getLogger: sinon
      .stub()
      .returns(sinon.createStubInstance(winston.createLogger().constructor)),
    setLevel: sinon.stub(),
  };
}

describe("AssetReference", () => {
  let contract: AssetReferenceContract;
  let ctx: TestContext;

  beforeEach(() => {
    contract = new AssetReferenceContract();
    ctx = new TestContext();
    ctx.stub.getState
      .withArgs("1001")
      .resolves(
        Buffer.from('{"id":"1001", "isLocked": false,"numberTokens": 10}'),
      );
    ctx.stub.getState
      .withArgs("1002")
      .resolves(
        Buffer.from('{"id":"1002", "isLocked": true,"numberTokens": 30}'),
      );
  });

  describe("#assetReferenceExists", () => {
    it("should return true for an asset reference", async () => {
      await contract.AssetReferenceExists(ctx, "1001").should.eventually.be
        .true;
    });

    it("should return false for an asset reference that does not exist", async () => {
      await contract.AssetReferenceExists(ctx, "1003").should.eventually.be
        .false;
    });
  });

  describe("#createAssetReference", () => {
    it("should create an asset reference", async () => {
      await contract.CreateAssetReference(ctx, "1003", 100, false);
      ctx.stub.putState.should.have.been.calledOnceWithExactly(
        "1003",
        Buffer.from('{"id":"1003","isLocked":false,"numberTokens":100}'),
      );
    });

    it("should throw an error for an asset reference that already exists", async () => {
      await contract
        .CreateAssetReference(ctx, "1001", 100, false)
        .should.be.rejectedWith(
          /The asset reference with ID 1001 already exists/,
        );
    });
  });

  describe("#readAssetReference", () => {
    it("should return an asset reference", async () => {
      await contract
        .ReadAssetReference(ctx, "1001")
        .should.eventually.deep.equal({
          id: "1001",
          isLocked: false,
          numberTokens: 10,
        });
    });

    it("should throw an error for an asset reference that does not exist", async () => {
      await contract
        .ReadAssetReference(ctx, "1003")
        .should.be.rejectedWith(/The asset reference 1003 does not exist/);
    });
  });

  describe("#lockAssetReference", () => {
    it("should lock an asset reference", async () => {
      await contract.LockAssetReference(ctx, "1001");
      ctx.stub.putState.should.have.been.calledOnceWithExactly(
        "1001",
        Buffer.from('{"id":"1001","isLocked":true,"numberTokens":10}'),
      );
    });

    it("should throw an error for an asset reference that does not exist", async () => {
      await contract
        .LockAssetReference(ctx, "1003")
        .should.be.rejectedWith(/The asset reference 1003 does not exist/);
    });
  });

  describe("#unlockAssetReference", () => {
    it("should unlock an asset reference", async () => {
      await contract.UnlockAssetReference(ctx, "1002");
      ctx.stub.putState.should.have.been.calledOnceWithExactly(
        "1002",
        Buffer.from('{"id":"1002","isLocked":false,"numberTokens":30}'),
      );
    });

    it("should throw an error for an asset reference that does not exist", async () => {
      await contract
        .UnlockAssetReference(ctx, "1003")
        .should.be.rejectedWith(/The asset reference 1003 does not exist/);
    });
  });

  describe("#deleteAssetReference", () => {
    it("should delete an asset reference", async () => {
      await contract.DeleteAssetReference(ctx, "1001");
      ctx.stub.deleteState.should.have.been.calledOnceWithExactly("1001");
    });

    it("should throw an error for an asset reference that does not exist", async () => {
      await contract
        .DeleteAssetReference(ctx, "1003")
        .should.be.rejectedWith(/The asset reference 1003 does not exist/);
    });
  });
});
