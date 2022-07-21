/*
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Context,
  Contract,
  Info,
  Returns,
  Transaction,
} from "fabric-contract-api";
import { AssetReference } from "./asset-reference";

@Info({
  title: "AssetReferenceContract",
  description: "Smart contract for trading assets",
})
export class AssetReferenceContract extends Contract {
  // AssetExists returns true when asset with given ID exists in world state.
  @Transaction(false)
  @Returns("boolean")
  public async AssetReferenceExists(
    ctx: Context,
    id: string,
  ): Promise<boolean> {
    const assetJSON = await ctx.stub.getState(id);
    return !!assetJSON && assetJSON.length > 0;
  }

  // CreateAsset issues a new asset to the world state with given details.
  @Transaction()
  public async CreateAssetReference(
    ctx: Context,
    assetId: string,
    numberTokens: number,
  ): Promise<void> {
    console.log(
      "Creating new asset reference with id: " +
        assetId +
        " representing " +
        numberTokens +
        " tokens",
    );
    const exists: boolean = await this.AssetReferenceExists(ctx, assetId);
    if (exists) {
      console.log(`The asset reference with ID ${assetId} already exists`);
      throw new Error(`The asset reference with ID ${assetId} already exists`);
    }

    const asset: AssetReference = {
      id: assetId,
      isLocked: false,
      numberTokens: numberTokens,
    };

    const buffer: Buffer = Buffer.from(JSON.stringify(asset));
    await ctx.stub.putState(assetId, buffer);
  }

  @Transaction(false)
  @Returns("AssetReference")
  public async ReadAssetReference(
    ctx: Context,
    assetId: string,
  ): Promise<AssetReference> {
    const exists: boolean = await this.AssetReferenceExists(ctx, assetId);
    if (!exists) {
      throw new Error(`The asset reference ${assetId} does not exist`);
    }
    const data: Uint8Array = await ctx.stub.getState(assetId);
    const asset: AssetReference = JSON.parse(data.toString()) as AssetReference;
    return asset;
  }

  @Transaction()
  public async LockAssetReference(
    ctx: Context,
    assetId: string,
  ): Promise<void> {
    const exists: boolean = await this.AssetReferenceExists(ctx, assetId);
    if (!exists) {
      throw new Error(`The asset reference ${assetId} does not exist`);
    }

    const asset: AssetReference = await this.ReadAssetReference(ctx, assetId);
    asset.isLocked = true;
    const buffer: Buffer = Buffer.from(JSON.stringify(asset));
    await ctx.stub.putState(assetId, buffer);
  }

  @Transaction()
  public async UnlockAssetReference(
    ctx: Context,
    assetId: string,
  ): Promise<void> {
    const exists: boolean = await this.AssetReferenceExists(ctx, assetId);
    if (!exists) {
      throw new Error(`The asset reference ${assetId} does not exist`);
    }

    const asset: AssetReference = await this.ReadAssetReference(ctx, assetId);
    asset.isLocked = false;
    const buffer: Buffer = Buffer.from(JSON.stringify(asset));
    await ctx.stub.putState(assetId, buffer);
  }

  @Transaction()
  public async DeleteAssetReference(
    ctx: Context,
    assetId: string,
  ): Promise<void> {
    const exists: boolean = await this.AssetReferenceExists(ctx, assetId);
    if (!exists) {
      throw new Error(`The asset reference ${assetId} does not exist`);
    }
    await ctx.stub.deleteState(assetId);
  }
}
