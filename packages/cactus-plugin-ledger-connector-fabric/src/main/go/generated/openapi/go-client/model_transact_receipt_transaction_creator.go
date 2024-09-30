/*
Hyperledger Cactus Plugin - Connector Fabric

Can perform basic tasks on a fabric ledger

API version: 2.0.0-rc.5
*/

// Code generated by OpenAPI Generator (https://openapi-generator.tech); DO NOT EDIT.

package cactus-plugin-ledger-connector-fabric

import (
	"encoding/json"
)

// checks if the TransactReceiptTransactionCreator type satisfies the MappedNullable interface at compile time
var _ MappedNullable = &TransactReceiptTransactionCreator{}

// TransactReceiptTransactionCreator struct for TransactReceiptTransactionCreator
type TransactReceiptTransactionCreator struct {
	Mspid *string `json:"mspid,omitempty"`
	CreatorID *string `json:"creatorID,omitempty"`
}

// NewTransactReceiptTransactionCreator instantiates a new TransactReceiptTransactionCreator object
// This constructor will assign default values to properties that have it defined,
// and makes sure properties required by API are set, but the set of arguments
// will change when the set of required properties is changed
func NewTransactReceiptTransactionCreator() *TransactReceiptTransactionCreator {
	this := TransactReceiptTransactionCreator{}
	return &this
}

// NewTransactReceiptTransactionCreatorWithDefaults instantiates a new TransactReceiptTransactionCreator object
// This constructor will only assign default values to properties that have it defined,
// but it doesn't guarantee that properties required by API are set
func NewTransactReceiptTransactionCreatorWithDefaults() *TransactReceiptTransactionCreator {
	this := TransactReceiptTransactionCreator{}
	return &this
}

// GetMspid returns the Mspid field value if set, zero value otherwise.
func (o *TransactReceiptTransactionCreator) GetMspid() string {
	if o == nil || IsNil(o.Mspid) {
		var ret string
		return ret
	}
	return *o.Mspid
}

// GetMspidOk returns a tuple with the Mspid field value if set, nil otherwise
// and a boolean to check if the value has been set.
func (o *TransactReceiptTransactionCreator) GetMspidOk() (*string, bool) {
	if o == nil || IsNil(o.Mspid) {
		return nil, false
	}
	return o.Mspid, true
}

// HasMspid returns a boolean if a field has been set.
func (o *TransactReceiptTransactionCreator) HasMspid() bool {
	if o != nil && !IsNil(o.Mspid) {
		return true
	}

	return false
}

// SetMspid gets a reference to the given string and assigns it to the Mspid field.
func (o *TransactReceiptTransactionCreator) SetMspid(v string) {
	o.Mspid = &v
}

// GetCreatorID returns the CreatorID field value if set, zero value otherwise.
func (o *TransactReceiptTransactionCreator) GetCreatorID() string {
	if o == nil || IsNil(o.CreatorID) {
		var ret string
		return ret
	}
	return *o.CreatorID
}

// GetCreatorIDOk returns a tuple with the CreatorID field value if set, nil otherwise
// and a boolean to check if the value has been set.
func (o *TransactReceiptTransactionCreator) GetCreatorIDOk() (*string, bool) {
	if o == nil || IsNil(o.CreatorID) {
		return nil, false
	}
	return o.CreatorID, true
}

// HasCreatorID returns a boolean if a field has been set.
func (o *TransactReceiptTransactionCreator) HasCreatorID() bool {
	if o != nil && !IsNil(o.CreatorID) {
		return true
	}

	return false
}

// SetCreatorID gets a reference to the given string and assigns it to the CreatorID field.
func (o *TransactReceiptTransactionCreator) SetCreatorID(v string) {
	o.CreatorID = &v
}

func (o TransactReceiptTransactionCreator) MarshalJSON() ([]byte, error) {
	toSerialize,err := o.ToMap()
	if err != nil {
		return []byte{}, err
	}
	return json.Marshal(toSerialize)
}

func (o TransactReceiptTransactionCreator) ToMap() (map[string]interface{}, error) {
	toSerialize := map[string]interface{}{}
	if !IsNil(o.Mspid) {
		toSerialize["mspid"] = o.Mspid
	}
	if !IsNil(o.CreatorID) {
		toSerialize["creatorID"] = o.CreatorID
	}
	return toSerialize, nil
}

type NullableTransactReceiptTransactionCreator struct {
	value *TransactReceiptTransactionCreator
	isSet bool
}

func (v NullableTransactReceiptTransactionCreator) Get() *TransactReceiptTransactionCreator {
	return v.value
}

func (v *NullableTransactReceiptTransactionCreator) Set(val *TransactReceiptTransactionCreator) {
	v.value = val
	v.isSet = true
}

func (v NullableTransactReceiptTransactionCreator) IsSet() bool {
	return v.isSet
}

func (v *NullableTransactReceiptTransactionCreator) Unset() {
	v.value = nil
	v.isSet = false
}

func NewNullableTransactReceiptTransactionCreator(val *TransactReceiptTransactionCreator) *NullableTransactReceiptTransactionCreator {
	return &NullableTransactReceiptTransactionCreator{value: val, isSet: true}
}

func (v NullableTransactReceiptTransactionCreator) MarshalJSON() ([]byte, error) {
	return json.Marshal(v.value)
}

func (v *NullableTransactReceiptTransactionCreator) UnmarshalJSON(src []byte) error {
	v.isSet = true
	return json.Unmarshal(src, &v.value)
}


