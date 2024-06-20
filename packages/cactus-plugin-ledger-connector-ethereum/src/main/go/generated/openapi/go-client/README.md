# Go API client for cactus-plugin-ledger-connector-ethereum

Can perform basic tasks on a Ethereum ledger

## Overview
This API client was generated by the [OpenAPI Generator](https://openapi-generator.tech) project.  By using the [OpenAPI-spec](https://www.openapis.org/) from a remote server, you can easily generate an API client.

- API version: 2.0.0-rc.3
- Package version: 1.0.0
- Build package: org.openapitools.codegen.languages.GoClientCodegen

## Installation

Install the following dependencies:

```shell
go get github.com/stretchr/testify/assert
go get golang.org/x/net/context
```

Put the package under your project folder and add the following in import:

```golang
import cactus-plugin-ledger-connector-ethereum "github.com/hyperledger/cactus-plugin-ledger-connector-ethereum/src/main/go/generated/openapi/go-client"
```

To use a proxy, set the environment variable `HTTP_PROXY`:

```golang
os.Setenv("HTTP_PROXY", "http://proxy_name:proxy_port")
```

## Configuration of Server URL

Default configuration comes with `Servers` field that contains server objects as defined in the OpenAPI specification.

### Select Server Configuration

For using other server than the one defined on index 0 set context value `sw.ContextServerIndex` of type `int`.

```golang
ctx := context.WithValue(context.Background(), cactus-plugin-ledger-connector-ethereum.ContextServerIndex, 1)
```

### Templated Server URL

Templated server URL is formatted using default variables from configuration or from context value `sw.ContextServerVariables` of type `map[string]string`.

```golang
ctx := context.WithValue(context.Background(), cactus-plugin-ledger-connector-ethereum.ContextServerVariables, map[string]string{
	"basePath": "v2",
})
```

Note, enum values are always validated and all unused variables are silently ignored.

### URLs Configuration per Operation

Each operation can use different server URL defined using `OperationServers` map in the `Configuration`.
An operation is uniquely identified by `"{classname}Service.{nickname}"` string.
Similar rules for overriding default operation server index and variables applies by using `sw.ContextOperationServerIndices` and `sw.ContextOperationServerVariables` context maps.

```golang
ctx := context.WithValue(context.Background(), cactus-plugin-ledger-connector-ethereum.ContextOperationServerIndices, map[string]int{
	"{classname}Service.{nickname}": 2,
})
ctx = context.WithValue(context.Background(), cactus-plugin-ledger-connector-ethereum.ContextOperationServerVariables, map[string]map[string]string{
	"{classname}Service.{nickname}": {
		"port": "8443",
	},
})
```

## Documentation for API Endpoints

All URIs are relative to *http://localhost*

Class | Method | HTTP request | Description
------------ | ------------- | ------------- | -------------
*DefaultApi* | [**DeployContract**](docs/DefaultApi.md#deploycontract) | **Post** /api/v1/plugins/@hyperledger/cactus-plugin-ledger-connector-ethereum/deploy-contract | Deploys the contract to ethereum ledger.
*DefaultApi* | [**GetPrometheusMetricsV1**](docs/DefaultApi.md#getprometheusmetricsv1) | **Get** /api/v1/plugins/@hyperledger/cactus-plugin-ledger-connector-ethereum/get-prometheus-exporter-metrics | Get the Prometheus Metrics
*DefaultApi* | [**InvokeContractV1**](docs/DefaultApi.md#invokecontractv1) | **Post** /api/v1/plugins/@hyperledger/cactus-plugin-ledger-connector-ethereum/invoke-contract | Invokes a contract on an ethereum ledger
*DefaultApi* | [**InvokeRawWeb3EthContractV1**](docs/DefaultApi.md#invokerawweb3ethcontractv1) | **Post** /api/v1/plugins/@hyperledger/cactus-plugin-ledger-connector-ethereum/invoke-raw-web3eth-contract | Low-level endpoint to invoke a method on deployed contract.
*DefaultApi* | [**InvokeWeb3EthMethodV1**](docs/DefaultApi.md#invokeweb3ethmethodv1) | **Post** /api/v1/plugins/@hyperledger/cactus-plugin-ledger-connector-ethereum/invoke-raw-web3eth-method | Invoke any method from web3.eth (low-level)
*DefaultApi* | [**RunTransactionV1**](docs/DefaultApi.md#runtransactionv1) | **Post** /api/v1/plugins/@hyperledger/cactus-plugin-ledger-connector-ethereum/run-transaction | Executes a transaction on a ethereum ledger


## Documentation For Models

 - [ContractJSON](docs/ContractJSON.md)
 - [ContractJsonDefinition](docs/ContractJsonDefinition.md)
 - [ContractKeychainDefinition](docs/ContractKeychainDefinition.md)
 - [DeployContractV1Request](docs/DeployContractV1Request.md)
 - [DeployContractV1RequestContract](docs/DeployContractV1RequestContract.md)
 - [DeployedContractJsonDefinition](docs/DeployedContractJsonDefinition.md)
 - [ErrorExceptionResponseV1](docs/ErrorExceptionResponseV1.md)
 - [EthContractInvocationType](docs/EthContractInvocationType.md)
 - [EthContractInvocationWeb3Method](docs/EthContractInvocationWeb3Method.md)
 - [EthereumTransactionConfig](docs/EthereumTransactionConfig.md)
 - [GasTransactionConfig](docs/GasTransactionConfig.md)
 - [GasTransactionConfigEIP1559](docs/GasTransactionConfigEIP1559.md)
 - [GasTransactionConfigLegacy](docs/GasTransactionConfigLegacy.md)
 - [InvokeContractV1Request](docs/InvokeContractV1Request.md)
 - [InvokeContractV1RequestContract](docs/InvokeContractV1RequestContract.md)
 - [InvokeContractV1Response](docs/InvokeContractV1Response.md)
 - [InvokeRawWeb3EthContractV1Request](docs/InvokeRawWeb3EthContractV1Request.md)
 - [InvokeRawWeb3EthContractV1Response](docs/InvokeRawWeb3EthContractV1Response.md)
 - [InvokeRawWeb3EthMethodV1Request](docs/InvokeRawWeb3EthMethodV1Request.md)
 - [InvokeRawWeb3EthMethodV1Response](docs/InvokeRawWeb3EthMethodV1Response.md)
 - [RunTransactionRequest](docs/RunTransactionRequest.md)
 - [RunTransactionResponse](docs/RunTransactionResponse.md)
 - [WatchBlocksV1](docs/WatchBlocksV1.md)
 - [WatchBlocksV1BlockData](docs/WatchBlocksV1BlockData.md)
 - [WatchBlocksV1BlockDataTimestamp](docs/WatchBlocksV1BlockDataTimestamp.md)
 - [WatchBlocksV1Options](docs/WatchBlocksV1Options.md)
 - [WatchBlocksV1Progress](docs/WatchBlocksV1Progress.md)
 - [Web3BlockHeader](docs/Web3BlockHeader.md)
 - [Web3SigningCredential](docs/Web3SigningCredential.md)
 - [Web3SigningCredentialCactiKeychainRef](docs/Web3SigningCredentialCactiKeychainRef.md)
 - [Web3SigningCredentialGethKeychainPassword](docs/Web3SigningCredentialGethKeychainPassword.md)
 - [Web3SigningCredentialNone](docs/Web3SigningCredentialNone.md)
 - [Web3SigningCredentialPrivateKeyHex](docs/Web3SigningCredentialPrivateKeyHex.md)
 - [Web3SigningCredentialType](docs/Web3SigningCredentialType.md)
 - [Web3Transaction](docs/Web3Transaction.md)
 - [Web3TransactionReceipt](docs/Web3TransactionReceipt.md)


## Documentation For Authorization

Endpoints do not require authorization.


## Documentation for Utility Methods

Due to the fact that model structure members are all pointers, this package contains
a number of utility functions to easily obtain pointers to values of basic types.
Each of these functions takes a value of the given basic type and returns a pointer to it:

* `PtrBool`
* `PtrInt`
* `PtrInt32`
* `PtrInt64`
* `PtrFloat`
* `PtrFloat32`
* `PtrFloat64`
* `PtrString`
* `PtrTime`

## Author


