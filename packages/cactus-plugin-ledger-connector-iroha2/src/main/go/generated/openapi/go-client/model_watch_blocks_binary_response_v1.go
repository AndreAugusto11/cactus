/*
Hyperledger Cactus Plugin - Connector Iroha V2

Can perform basic tasks on a Iroha V2 ledger

API version: 2.0.0-rc.5
*/

// Code generated by OpenAPI Generator (https://openapi-generator.tech); DO NOT EDIT.

package cactus-plugin-ledger-connector-iroha2

import (
	"encoding/json"
)

// checks if the WatchBlocksBinaryResponseV1 type satisfies the MappedNullable interface at compile time
var _ MappedNullable = &WatchBlocksBinaryResponseV1{}

// WatchBlocksBinaryResponseV1 Binary encoded response of block data.
type WatchBlocksBinaryResponseV1 struct {
	BinaryBlock string `json:"binaryBlock"`
}

// NewWatchBlocksBinaryResponseV1 instantiates a new WatchBlocksBinaryResponseV1 object
// This constructor will assign default values to properties that have it defined,
// and makes sure properties required by API are set, but the set of arguments
// will change when the set of required properties is changed
func NewWatchBlocksBinaryResponseV1(binaryBlock string) *WatchBlocksBinaryResponseV1 {
	this := WatchBlocksBinaryResponseV1{}
	this.BinaryBlock = binaryBlock
	return &this
}

// NewWatchBlocksBinaryResponseV1WithDefaults instantiates a new WatchBlocksBinaryResponseV1 object
// This constructor will only assign default values to properties that have it defined,
// but it doesn't guarantee that properties required by API are set
func NewWatchBlocksBinaryResponseV1WithDefaults() *WatchBlocksBinaryResponseV1 {
	this := WatchBlocksBinaryResponseV1{}
	return &this
}

// GetBinaryBlock returns the BinaryBlock field value
func (o *WatchBlocksBinaryResponseV1) GetBinaryBlock() string {
	if o == nil {
		var ret string
		return ret
	}

	return o.BinaryBlock
}

// GetBinaryBlockOk returns a tuple with the BinaryBlock field value
// and a boolean to check if the value has been set.
func (o *WatchBlocksBinaryResponseV1) GetBinaryBlockOk() (*string, bool) {
	if o == nil {
		return nil, false
	}
	return &o.BinaryBlock, true
}

// SetBinaryBlock sets field value
func (o *WatchBlocksBinaryResponseV1) SetBinaryBlock(v string) {
	o.BinaryBlock = v
}

func (o WatchBlocksBinaryResponseV1) MarshalJSON() ([]byte, error) {
	toSerialize,err := o.ToMap()
	if err != nil {
		return []byte{}, err
	}
	return json.Marshal(toSerialize)
}

func (o WatchBlocksBinaryResponseV1) ToMap() (map[string]interface{}, error) {
	toSerialize := map[string]interface{}{}
	toSerialize["binaryBlock"] = o.BinaryBlock
	return toSerialize, nil
}

type NullableWatchBlocksBinaryResponseV1 struct {
	value *WatchBlocksBinaryResponseV1
	isSet bool
}

func (v NullableWatchBlocksBinaryResponseV1) Get() *WatchBlocksBinaryResponseV1 {
	return v.value
}

func (v *NullableWatchBlocksBinaryResponseV1) Set(val *WatchBlocksBinaryResponseV1) {
	v.value = val
	v.isSet = true
}

func (v NullableWatchBlocksBinaryResponseV1) IsSet() bool {
	return v.isSet
}

func (v *NullableWatchBlocksBinaryResponseV1) Unset() {
	v.value = nil
	v.isSet = false
}

func NewNullableWatchBlocksBinaryResponseV1(val *WatchBlocksBinaryResponseV1) *NullableWatchBlocksBinaryResponseV1 {
	return &NullableWatchBlocksBinaryResponseV1{value: val, isSet: true}
}

func (v NullableWatchBlocksBinaryResponseV1) MarshalJSON() ([]byte, error) {
	return json.Marshal(v.value)
}

func (v *NullableWatchBlocksBinaryResponseV1) UnmarshalJSON(src []byte) error {
	v.isSet = true
	return json.Unmarshal(src, &v.value)
}


