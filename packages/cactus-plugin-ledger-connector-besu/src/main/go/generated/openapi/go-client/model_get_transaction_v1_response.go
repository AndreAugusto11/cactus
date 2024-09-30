/*
Hyperledger Cactus Plugin - Connector Besu

Can perform basic tasks on a Besu ledger

API version: 2.0.0-rc.5
*/

// Code generated by OpenAPI Generator (https://openapi-generator.tech); DO NOT EDIT.

package cactus-plugin-ledger-connector-besu

import (
	"encoding/json"
)

// checks if the GetTransactionV1Response type satisfies the MappedNullable interface at compile time
var _ MappedNullable = &GetTransactionV1Response{}

// GetTransactionV1Response struct for GetTransactionV1Response
type GetTransactionV1Response struct {
	Transaction EvmTransaction `json:"transaction"`
}

// NewGetTransactionV1Response instantiates a new GetTransactionV1Response object
// This constructor will assign default values to properties that have it defined,
// and makes sure properties required by API are set, but the set of arguments
// will change when the set of required properties is changed
func NewGetTransactionV1Response(transaction EvmTransaction) *GetTransactionV1Response {
	this := GetTransactionV1Response{}
	this.Transaction = transaction
	return &this
}

// NewGetTransactionV1ResponseWithDefaults instantiates a new GetTransactionV1Response object
// This constructor will only assign default values to properties that have it defined,
// but it doesn't guarantee that properties required by API are set
func NewGetTransactionV1ResponseWithDefaults() *GetTransactionV1Response {
	this := GetTransactionV1Response{}
	return &this
}

// GetTransaction returns the Transaction field value
func (o *GetTransactionV1Response) GetTransaction() EvmTransaction {
	if o == nil {
		var ret EvmTransaction
		return ret
	}

	return o.Transaction
}

// GetTransactionOk returns a tuple with the Transaction field value
// and a boolean to check if the value has been set.
func (o *GetTransactionV1Response) GetTransactionOk() (*EvmTransaction, bool) {
	if o == nil {
		return nil, false
	}
	return &o.Transaction, true
}

// SetTransaction sets field value
func (o *GetTransactionV1Response) SetTransaction(v EvmTransaction) {
	o.Transaction = v
}

func (o GetTransactionV1Response) MarshalJSON() ([]byte, error) {
	toSerialize,err := o.ToMap()
	if err != nil {
		return []byte{}, err
	}
	return json.Marshal(toSerialize)
}

func (o GetTransactionV1Response) ToMap() (map[string]interface{}, error) {
	toSerialize := map[string]interface{}{}
	toSerialize["transaction"] = o.Transaction
	return toSerialize, nil
}

type NullableGetTransactionV1Response struct {
	value *GetTransactionV1Response
	isSet bool
}

func (v NullableGetTransactionV1Response) Get() *GetTransactionV1Response {
	return v.value
}

func (v *NullableGetTransactionV1Response) Set(val *GetTransactionV1Response) {
	v.value = val
	v.isSet = true
}

func (v NullableGetTransactionV1Response) IsSet() bool {
	return v.isSet
}

func (v *NullableGetTransactionV1Response) Unset() {
	v.value = nil
	v.isSet = false
}

func NewNullableGetTransactionV1Response(val *GetTransactionV1Response) *NullableGetTransactionV1Response {
	return &NullableGetTransactionV1Response{value: val, isSet: true}
}

func (v NullableGetTransactionV1Response) MarshalJSON() ([]byte, error) {
	return json.Marshal(v.value)
}

func (v *NullableGetTransactionV1Response) UnmarshalJSON(src []byte) error {
	v.isSet = true
	return json.Unmarshal(src, &v.value)
}


