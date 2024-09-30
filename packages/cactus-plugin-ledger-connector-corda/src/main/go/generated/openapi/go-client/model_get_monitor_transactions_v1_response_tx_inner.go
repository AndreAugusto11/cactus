/*
Hyperledger Cacti Plugin - Connector Corda

Can perform basic tasks on a Corda ledger

API version: 2.0.0-rc.5
*/

// Code generated by OpenAPI Generator (https://openapi-generator.tech); DO NOT EDIT.

package cactus-plugin-ledger-connector-corda

import (
	"encoding/json"
)

// checks if the GetMonitorTransactionsV1ResponseTxInner type satisfies the MappedNullable interface at compile time
var _ MappedNullable = &GetMonitorTransactionsV1ResponseTxInner{}

// GetMonitorTransactionsV1ResponseTxInner struct for GetMonitorTransactionsV1ResponseTxInner
type GetMonitorTransactionsV1ResponseTxInner struct {
	Index *string `json:"index,omitempty"`
	Data *string `json:"data,omitempty"`
}

// NewGetMonitorTransactionsV1ResponseTxInner instantiates a new GetMonitorTransactionsV1ResponseTxInner object
// This constructor will assign default values to properties that have it defined,
// and makes sure properties required by API are set, but the set of arguments
// will change when the set of required properties is changed
func NewGetMonitorTransactionsV1ResponseTxInner() *GetMonitorTransactionsV1ResponseTxInner {
	this := GetMonitorTransactionsV1ResponseTxInner{}
	return &this
}

// NewGetMonitorTransactionsV1ResponseTxInnerWithDefaults instantiates a new GetMonitorTransactionsV1ResponseTxInner object
// This constructor will only assign default values to properties that have it defined,
// but it doesn't guarantee that properties required by API are set
func NewGetMonitorTransactionsV1ResponseTxInnerWithDefaults() *GetMonitorTransactionsV1ResponseTxInner {
	this := GetMonitorTransactionsV1ResponseTxInner{}
	return &this
}

// GetIndex returns the Index field value if set, zero value otherwise.
func (o *GetMonitorTransactionsV1ResponseTxInner) GetIndex() string {
	if o == nil || IsNil(o.Index) {
		var ret string
		return ret
	}
	return *o.Index
}

// GetIndexOk returns a tuple with the Index field value if set, nil otherwise
// and a boolean to check if the value has been set.
func (o *GetMonitorTransactionsV1ResponseTxInner) GetIndexOk() (*string, bool) {
	if o == nil || IsNil(o.Index) {
		return nil, false
	}
	return o.Index, true
}

// HasIndex returns a boolean if a field has been set.
func (o *GetMonitorTransactionsV1ResponseTxInner) HasIndex() bool {
	if o != nil && !IsNil(o.Index) {
		return true
	}

	return false
}

// SetIndex gets a reference to the given string and assigns it to the Index field.
func (o *GetMonitorTransactionsV1ResponseTxInner) SetIndex(v string) {
	o.Index = &v
}

// GetData returns the Data field value if set, zero value otherwise.
func (o *GetMonitorTransactionsV1ResponseTxInner) GetData() string {
	if o == nil || IsNil(o.Data) {
		var ret string
		return ret
	}
	return *o.Data
}

// GetDataOk returns a tuple with the Data field value if set, nil otherwise
// and a boolean to check if the value has been set.
func (o *GetMonitorTransactionsV1ResponseTxInner) GetDataOk() (*string, bool) {
	if o == nil || IsNil(o.Data) {
		return nil, false
	}
	return o.Data, true
}

// HasData returns a boolean if a field has been set.
func (o *GetMonitorTransactionsV1ResponseTxInner) HasData() bool {
	if o != nil && !IsNil(o.Data) {
		return true
	}

	return false
}

// SetData gets a reference to the given string and assigns it to the Data field.
func (o *GetMonitorTransactionsV1ResponseTxInner) SetData(v string) {
	o.Data = &v
}

func (o GetMonitorTransactionsV1ResponseTxInner) MarshalJSON() ([]byte, error) {
	toSerialize,err := o.ToMap()
	if err != nil {
		return []byte{}, err
	}
	return json.Marshal(toSerialize)
}

func (o GetMonitorTransactionsV1ResponseTxInner) ToMap() (map[string]interface{}, error) {
	toSerialize := map[string]interface{}{}
	if !IsNil(o.Index) {
		toSerialize["index"] = o.Index
	}
	if !IsNil(o.Data) {
		toSerialize["data"] = o.Data
	}
	return toSerialize, nil
}

type NullableGetMonitorTransactionsV1ResponseTxInner struct {
	value *GetMonitorTransactionsV1ResponseTxInner
	isSet bool
}

func (v NullableGetMonitorTransactionsV1ResponseTxInner) Get() *GetMonitorTransactionsV1ResponseTxInner {
	return v.value
}

func (v *NullableGetMonitorTransactionsV1ResponseTxInner) Set(val *GetMonitorTransactionsV1ResponseTxInner) {
	v.value = val
	v.isSet = true
}

func (v NullableGetMonitorTransactionsV1ResponseTxInner) IsSet() bool {
	return v.isSet
}

func (v *NullableGetMonitorTransactionsV1ResponseTxInner) Unset() {
	v.value = nil
	v.isSet = false
}

func NewNullableGetMonitorTransactionsV1ResponseTxInner(val *GetMonitorTransactionsV1ResponseTxInner) *NullableGetMonitorTransactionsV1ResponseTxInner {
	return &NullableGetMonitorTransactionsV1ResponseTxInner{value: val, isSet: true}
}

func (v NullableGetMonitorTransactionsV1ResponseTxInner) MarshalJSON() ([]byte, error) {
	return json.Marshal(v.value)
}

func (v *NullableGetMonitorTransactionsV1ResponseTxInner) UnmarshalJSON(src []byte) error {
	v.isSet = true
	return json.Unmarshal(src, &v.value)
}


