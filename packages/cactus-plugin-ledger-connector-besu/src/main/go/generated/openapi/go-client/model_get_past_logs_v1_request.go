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

// checks if the GetPastLogsV1Request type satisfies the MappedNullable interface at compile time
var _ MappedNullable = &GetPastLogsV1Request{}

// GetPastLogsV1Request struct for GetPastLogsV1Request
type GetPastLogsV1Request struct {
	ToBlock interface{} `json:"toBlock,omitempty"`
	FromBlock interface{} `json:"fromBlock,omitempty"`
	Address interface{} `json:"address,omitempty"`
	Topics []interface{} `json:"topics,omitempty"`
}

// NewGetPastLogsV1Request instantiates a new GetPastLogsV1Request object
// This constructor will assign default values to properties that have it defined,
// and makes sure properties required by API are set, but the set of arguments
// will change when the set of required properties is changed
func NewGetPastLogsV1Request() *GetPastLogsV1Request {
	this := GetPastLogsV1Request{}
	return &this
}

// NewGetPastLogsV1RequestWithDefaults instantiates a new GetPastLogsV1Request object
// This constructor will only assign default values to properties that have it defined,
// but it doesn't guarantee that properties required by API are set
func NewGetPastLogsV1RequestWithDefaults() *GetPastLogsV1Request {
	this := GetPastLogsV1Request{}
	return &this
}

// GetToBlock returns the ToBlock field value if set, zero value otherwise (both if not set or set to explicit null).
func (o *GetPastLogsV1Request) GetToBlock() interface{} {
	if o == nil {
		var ret interface{}
		return ret
	}
	return o.ToBlock
}

// GetToBlockOk returns a tuple with the ToBlock field value if set, nil otherwise
// and a boolean to check if the value has been set.
// NOTE: If the value is an explicit nil, `nil, true` will be returned
func (o *GetPastLogsV1Request) GetToBlockOk() (*interface{}, bool) {
	if o == nil || IsNil(o.ToBlock) {
		return nil, false
	}
	return &o.ToBlock, true
}

// HasToBlock returns a boolean if a field has been set.
func (o *GetPastLogsV1Request) HasToBlock() bool {
	if o != nil && IsNil(o.ToBlock) {
		return true
	}

	return false
}

// SetToBlock gets a reference to the given interface{} and assigns it to the ToBlock field.
func (o *GetPastLogsV1Request) SetToBlock(v interface{}) {
	o.ToBlock = v
}

// GetFromBlock returns the FromBlock field value if set, zero value otherwise (both if not set or set to explicit null).
func (o *GetPastLogsV1Request) GetFromBlock() interface{} {
	if o == nil {
		var ret interface{}
		return ret
	}
	return o.FromBlock
}

// GetFromBlockOk returns a tuple with the FromBlock field value if set, nil otherwise
// and a boolean to check if the value has been set.
// NOTE: If the value is an explicit nil, `nil, true` will be returned
func (o *GetPastLogsV1Request) GetFromBlockOk() (*interface{}, bool) {
	if o == nil || IsNil(o.FromBlock) {
		return nil, false
	}
	return &o.FromBlock, true
}

// HasFromBlock returns a boolean if a field has been set.
func (o *GetPastLogsV1Request) HasFromBlock() bool {
	if o != nil && IsNil(o.FromBlock) {
		return true
	}

	return false
}

// SetFromBlock gets a reference to the given interface{} and assigns it to the FromBlock field.
func (o *GetPastLogsV1Request) SetFromBlock(v interface{}) {
	o.FromBlock = v
}

// GetAddress returns the Address field value if set, zero value otherwise (both if not set or set to explicit null).
func (o *GetPastLogsV1Request) GetAddress() interface{} {
	if o == nil {
		var ret interface{}
		return ret
	}
	return o.Address
}

// GetAddressOk returns a tuple with the Address field value if set, nil otherwise
// and a boolean to check if the value has been set.
// NOTE: If the value is an explicit nil, `nil, true` will be returned
func (o *GetPastLogsV1Request) GetAddressOk() (*interface{}, bool) {
	if o == nil || IsNil(o.Address) {
		return nil, false
	}
	return &o.Address, true
}

// HasAddress returns a boolean if a field has been set.
func (o *GetPastLogsV1Request) HasAddress() bool {
	if o != nil && IsNil(o.Address) {
		return true
	}

	return false
}

// SetAddress gets a reference to the given interface{} and assigns it to the Address field.
func (o *GetPastLogsV1Request) SetAddress(v interface{}) {
	o.Address = v
}

// GetTopics returns the Topics field value if set, zero value otherwise.
func (o *GetPastLogsV1Request) GetTopics() []interface{} {
	if o == nil || IsNil(o.Topics) {
		var ret []interface{}
		return ret
	}
	return o.Topics
}

// GetTopicsOk returns a tuple with the Topics field value if set, nil otherwise
// and a boolean to check if the value has been set.
func (o *GetPastLogsV1Request) GetTopicsOk() ([]interface{}, bool) {
	if o == nil || IsNil(o.Topics) {
		return nil, false
	}
	return o.Topics, true
}

// HasTopics returns a boolean if a field has been set.
func (o *GetPastLogsV1Request) HasTopics() bool {
	if o != nil && !IsNil(o.Topics) {
		return true
	}

	return false
}

// SetTopics gets a reference to the given []interface{} and assigns it to the Topics field.
func (o *GetPastLogsV1Request) SetTopics(v []interface{}) {
	o.Topics = v
}

func (o GetPastLogsV1Request) MarshalJSON() ([]byte, error) {
	toSerialize,err := o.ToMap()
	if err != nil {
		return []byte{}, err
	}
	return json.Marshal(toSerialize)
}

func (o GetPastLogsV1Request) ToMap() (map[string]interface{}, error) {
	toSerialize := map[string]interface{}{}
	if o.ToBlock != nil {
		toSerialize["toBlock"] = o.ToBlock
	}
	if o.FromBlock != nil {
		toSerialize["fromBlock"] = o.FromBlock
	}
	if o.Address != nil {
		toSerialize["address"] = o.Address
	}
	if !IsNil(o.Topics) {
		toSerialize["topics"] = o.Topics
	}
	return toSerialize, nil
}

type NullableGetPastLogsV1Request struct {
	value *GetPastLogsV1Request
	isSet bool
}

func (v NullableGetPastLogsV1Request) Get() *GetPastLogsV1Request {
	return v.value
}

func (v *NullableGetPastLogsV1Request) Set(val *GetPastLogsV1Request) {
	v.value = val
	v.isSet = true
}

func (v NullableGetPastLogsV1Request) IsSet() bool {
	return v.isSet
}

func (v *NullableGetPastLogsV1Request) Unset() {
	v.value = nil
	v.isSet = false
}

func NewNullableGetPastLogsV1Request(val *GetPastLogsV1Request) *NullableGetPastLogsV1Request {
	return &NullableGetPastLogsV1Request{value: val, isSet: true}
}

func (v NullableGetPastLogsV1Request) MarshalJSON() ([]byte, error) {
	return json.Marshal(v.value)
}

func (v *NullableGetPastLogsV1Request) UnmarshalJSON(src []byte) error {
	v.isSet = true
	return json.Unmarshal(src, &v.value)
}


