/*
Hyperledger Cactus Plugin - Connector Polkadot

Can perform basic tasks on a Polkadot parachain

API version: 2.0.0-rc.5
*/

// Code generated by OpenAPI Generator (https://openapi-generator.tech); DO NOT EDIT.

package cactus-plugin-ledger-connector-polkadot

import (
	"encoding/json"
)

// checks if the TransactionInfoResponseData type satisfies the MappedNullable interface at compile time
var _ MappedNullable = &TransactionInfoResponseData{}

// TransactionInfoResponseData struct for TransactionInfoResponseData
type TransactionInfoResponseData struct {
	Nonce map[string]interface{} `json:"nonce"`
	BlockHash map[string]interface{} `json:"blockHash"`
	Era map[string]interface{} `json:"era"`
}

// NewTransactionInfoResponseData instantiates a new TransactionInfoResponseData object
// This constructor will assign default values to properties that have it defined,
// and makes sure properties required by API are set, but the set of arguments
// will change when the set of required properties is changed
func NewTransactionInfoResponseData(nonce map[string]interface{}, blockHash map[string]interface{}, era map[string]interface{}) *TransactionInfoResponseData {
	this := TransactionInfoResponseData{}
	this.Nonce = nonce
	this.BlockHash = blockHash
	this.Era = era
	return &this
}

// NewTransactionInfoResponseDataWithDefaults instantiates a new TransactionInfoResponseData object
// This constructor will only assign default values to properties that have it defined,
// but it doesn't guarantee that properties required by API are set
func NewTransactionInfoResponseDataWithDefaults() *TransactionInfoResponseData {
	this := TransactionInfoResponseData{}
	return &this
}

// GetNonce returns the Nonce field value
func (o *TransactionInfoResponseData) GetNonce() map[string]interface{} {
	if o == nil {
		var ret map[string]interface{}
		return ret
	}

	return o.Nonce
}

// GetNonceOk returns a tuple with the Nonce field value
// and a boolean to check if the value has been set.
func (o *TransactionInfoResponseData) GetNonceOk() (map[string]interface{}, bool) {
	if o == nil {
		return map[string]interface{}{}, false
	}
	return o.Nonce, true
}

// SetNonce sets field value
func (o *TransactionInfoResponseData) SetNonce(v map[string]interface{}) {
	o.Nonce = v
}

// GetBlockHash returns the BlockHash field value
func (o *TransactionInfoResponseData) GetBlockHash() map[string]interface{} {
	if o == nil {
		var ret map[string]interface{}
		return ret
	}

	return o.BlockHash
}

// GetBlockHashOk returns a tuple with the BlockHash field value
// and a boolean to check if the value has been set.
func (o *TransactionInfoResponseData) GetBlockHashOk() (map[string]interface{}, bool) {
	if o == nil {
		return map[string]interface{}{}, false
	}
	return o.BlockHash, true
}

// SetBlockHash sets field value
func (o *TransactionInfoResponseData) SetBlockHash(v map[string]interface{}) {
	o.BlockHash = v
}

// GetEra returns the Era field value
// If the value is explicit nil, the zero value for map[string]interface{} will be returned
func (o *TransactionInfoResponseData) GetEra() map[string]interface{} {
	if o == nil {
		var ret map[string]interface{}
		return ret
	}

	return o.Era
}

// GetEraOk returns a tuple with the Era field value
// and a boolean to check if the value has been set.
// NOTE: If the value is an explicit nil, `nil, true` will be returned
func (o *TransactionInfoResponseData) GetEraOk() (map[string]interface{}, bool) {
	if o == nil || IsNil(o.Era) {
		return map[string]interface{}{}, false
	}
	return o.Era, true
}

// SetEra sets field value
func (o *TransactionInfoResponseData) SetEra(v map[string]interface{}) {
	o.Era = v
}

func (o TransactionInfoResponseData) MarshalJSON() ([]byte, error) {
	toSerialize,err := o.ToMap()
	if err != nil {
		return []byte{}, err
	}
	return json.Marshal(toSerialize)
}

func (o TransactionInfoResponseData) ToMap() (map[string]interface{}, error) {
	toSerialize := map[string]interface{}{}
	toSerialize["nonce"] = o.Nonce
	toSerialize["blockHash"] = o.BlockHash
	if o.Era != nil {
		toSerialize["era"] = o.Era
	}
	return toSerialize, nil
}

type NullableTransactionInfoResponseData struct {
	value *TransactionInfoResponseData
	isSet bool
}

func (v NullableTransactionInfoResponseData) Get() *TransactionInfoResponseData {
	return v.value
}

func (v *NullableTransactionInfoResponseData) Set(val *TransactionInfoResponseData) {
	v.value = val
	v.isSet = true
}

func (v NullableTransactionInfoResponseData) IsSet() bool {
	return v.isSet
}

func (v *NullableTransactionInfoResponseData) Unset() {
	v.value = nil
	v.isSet = false
}

func NewNullableTransactionInfoResponseData(val *TransactionInfoResponseData) *NullableTransactionInfoResponseData {
	return &NullableTransactionInfoResponseData{value: val, isSet: true}
}

func (v NullableTransactionInfoResponseData) MarshalJSON() ([]byte, error) {
	return json.Marshal(v.value)
}

func (v *NullableTransactionInfoResponseData) UnmarshalJSON(src []byte) error {
	v.isSet = true
	return json.Unmarshal(src, &v.value)
}


