import "jest-extended";
import { v4 as uuidv4 } from "uuid";
import { LogLevelDesc } from "@hyperledger/cactus-common";
import { PluginKeychainMemory } from "@hyperledger/cactus-plugin-keychain-memory";
import { PluginRegistry } from "@hyperledger/cactus-core";
import { PluginImportType } from "@hyperledger/cactus-core-api";
import {
  Web3SigningCredentialType,
  PluginLedgerConnectorBesu,
  PluginFactoryLedgerConnector,
  ReceiptType,
  Web3SigningCredential,
} from "@hyperledger/cactus-plugin-ledger-connector-besu";
import Web3 from "web3";
import CBDCContractJson from "../solidity/CBDCcontract.json";
import {
  Containers,
  pruneDockerAllIfGithubAction,
  BesuTestLedger,
} from "@hyperledger/cactus-test-tooling";

const logLevel: LogLevelDesc = "TRACE";

let besuTestLedger: BesuTestLedger;
let besuWeb3SigningCredential: Web3SigningCredential;
let besuConnector: PluginLedgerConnectorBesu;

test("transfer asset correctly from fabric to besu, and the other way around", async () => {
  {
    // Besu ledger connection
    besuTestLedger = new BesuTestLedger();
    await besuTestLedger.start();

    const rpcApiHttpHost = await besuTestLedger.getRpcApiHttpHost();
    const rpcApiWsHost = await besuTestLedger.getRpcApiWsHost();

    /**
     * Constant defining the standard 'dev' Besu genesis.json contents.
     *
     * @see https://github.com/hyperledger/besu/blob/1.5.1/config/src/main/resources/dev.json
     */
    const firstHighNetWorthAccount = besuTestLedger.getGenesisAccountPubKey();
    const besuKeyPair = {
      privateKey: besuTestLedger.getGenesisAccountPrivKey(),
    };

    const web3 = new Web3(rpcApiHttpHost);
    const testEthAccount = web3.eth.accounts.create(uuidv4());

    const keychainEntryKey = uuidv4();
    const keychainEntryValue = testEthAccount.privateKey;
    const keychainPlugin = new PluginKeychainMemory({
      instanceId: uuidv4(),
      keychainId: uuidv4(),
      // pre-provision keychain with mock backend holding the private key of the
      // test account that we'll reference while sending requests with the
      // signing credential pointing to this keychain entry.
      backend: new Map([[keychainEntryKey, keychainEntryValue]]),
      logLevel,
    });
    keychainPlugin.set(
      CBDCContractJson.contractName,
      JSON.stringify(CBDCContractJson),
    );

    const factory = new PluginFactoryLedgerConnector({
      pluginImportType: PluginImportType.Local,
    });

    besuConnector = await factory.create({
      rpcApiHttpHost,
      rpcApiWsHost,
      instanceId: uuidv4(),
      pluginRegistry: new PluginRegistry({ plugins: [keychainPlugin] }),
    });

    await besuConnector.transact({
      web3SigningCredential: {
        ethAccount: firstHighNetWorthAccount,
        secret: besuKeyPair.privateKey,
        type: Web3SigningCredentialType.PrivateKeyHex,
      },
      consistencyStrategy: {
        blockConfirmations: 0,
        receiptType: ReceiptType.NodeTxPoolAck,
      },
      transactionConfig: {
        from: firstHighNetWorthAccount,
        to: testEthAccount.address,
        value: 10e9,
        gas: 1000000,
      },
    });

    const balance = await web3.eth.getBalance(testEthAccount.address);
    expect(balance).not.toBeUndefined();
    expect(parseInt(balance, 10)).toBe(10e9);

    besuWeb3SigningCredential = {
      ethAccount: firstHighNetWorthAccount,
      secret: besuKeyPair.privateKey,
      type: Web3SigningCredentialType.PrivateKeyHex,
    };

    const deployContractResponse = await besuConnector.deployContract({
      keychainId: keychainPlugin.getKeychainId(),
      contractName: CBDCContractJson.contractName,
      contractAbi: CBDCContractJson.abi,
      constructorArgs: [],
      web3SigningCredential: besuWeb3SigningCredential,
      bytecode: CBDCContractJson.bytecode,
      gas: 1000000,
    });

    expect(deployContractResponse).not.toBeUndefined();
    expect(deployContractResponse.transactionReceipt).not.toBeUndefined();
    expect(
      deployContractResponse.transactionReceipt.contractAddress,
    ).not.toBeUndefined();
  }
});

afterAll(async () => {
  await besuTestLedger.stop();
  await besuTestLedger.destroy();

  await pruneDockerAllIfGithubAction({ logLevel }).catch(async () => {
    await Containers.logDiagnostics({ logLevel });
    fail("Pruning didn't throw OK");
  });
});
