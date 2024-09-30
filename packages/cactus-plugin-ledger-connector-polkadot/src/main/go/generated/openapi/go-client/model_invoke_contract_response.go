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

// checks if the InvokeContractResponse type satisfies the MappedNullable interface at compile time
var _ MappedNullable = &InvokeContractResponse{}

// InvokeContractResponse struct for InvokeContractResponse
type InvokeContractResponse struct {
	CallOutput interface{} `json:"callOutput,omitempty"`
	Success bool `json:"success"`
	TxHash *string `json:"txHash,omitempty"`
	BlockHash *string `json:"blockHash,omitempty"`
}

// NewInvokeContractResponse instantiates a new InvokeContractResponse object
// This constructor will assign default values to properties that have it defined,
// and makes sure properties required by API are set, but the set of arguments
// will change when the set of required properties is changed
func NewInvokeContractResponse(success bool) *InvokeContractResponse {
	this := InvokeContractResponse{}
	this.Success = success
	return &this
}

// NewInvokeContractResponseWithDefaults instantiates a new InvokeContractResponse object
// This constructor will only assign default values to properties that have it defined,
// but it doesn't guarantee that properties required by API are set
func NewInvokeContractResponseWithDefaults() *InvokeContractResponse {
	this := InvokeContractResponse{}
	return &this
}

// GetCallOutput returns the CallOutput field value if set, zero value otherwise (both if not set or set to explicit null).
func (o *InvokeContractResponse) GetCallOutput() interface{} {
	if o == nil {
		var ret interface{}
		return ret
	}
	return o.CallOutput
}

// GetCallOutputOk returns a tuple with the CallOutput field value if set, nil otherwise
// and a boolean to check if the value has been set.
// NOTE: If the value is an explicit nil, `nil, true` will be returned
func (o *InvokeContractResponse) GetCallOutputOk() (*interface{}, bool) {
	if o == nil || IsNil(o.CallOutput) {
		return nil, false
	}
	return &o.CallOutput, true
}

// HasCallOutput returns a boolean if a field has been set.
func (o *InvokeContractResponse) HasCallOutput() bool {
	if o != nil && IsNil(o.CallOutput) {
		return true
	}

	return false
}

// SetCallOutput gets a reference to the given interface{} and assigns it to the CallOutput field.
func (o *InvokeContractResponse) SetCallOutput(v interface{}) {
	o.CallOutput = v
}

// GetSuccess returns the Success field value
func (o *InvokeContractResponse) GetSuccess() bool {
	if o == nil {
		var ret bool
		return ret
	}

	return o.Success
}

// GetSuccessOk returns a tuple with the Success field value
// and a boolean to check if the value has been set.
func (o *InvokeContractResponse) GetSuccessOk() (*bool, bool) {
	if o == nil {
		return nil, false
	}
	return &o.Success, true
}

// SetSuccess sets field value
func (o *InvokeContractResponse) SetSuccess(v bool) {
	o.Success = v
}

// GetTxHash returns the TxHash field value if set, zero value otherwise.
func (o *InvokeContractResponse) GetTxHash() string {
	if o == nil || IsNil(o.TxHash) {
		var ret string
		return ret
	}
	return *o.TxHash
}

// GetTxHashOk returns a tuple with the TxHash field value if set, nil otherwise
// and a boolean to check if the value has been set.
func (o *InvokeContractResponse) GetTxHashOk() (*string, bool) {
	if o == nil || IsNil(o.TxHash) {
		return nil, false
	}
	return o.TxHash, true
}

// HasTxHash returns a boolean if a field has been set.
func (o *InvokeContractResponse) HasTxHash() bool {
	if o != nil && !IsNil(o.TxHash) {
		return true
	}

	return false
}

// SetTxHash gets a reference to the given string and assigns it to the TxHash field.
func (o *InvokeContractResponse) SetTxHash(v string) {
	o.TxHash = &v
}

// GetBlockHash returns the BlockHash field value if set, zero value otherwise.
func (o *InvokeContractResponse) GetBlockHash() string {
	if o == nil || IsNil(o.BlockHash) {
		var ret string
		return ret
	}
	return *o.BlockHash
}

// GetBlockHashOk returns a tuple with the BlockHash field value if set, nil otherwise
// and a boolean to check if the value has been set.
func (o *InvokeContractResponse) GetBlockHashOk() (*string, bool) {
	if o == nil || IsNil(o.BlockHash) {
		return nil, false
	}
	return o.BlockHash, true
}

// HasBlockHash returns a boolean if a field has been set.
func (o *InvokeContractResponse) HasBlockHash() bool {
	if o != nil && !IsNil(o.BlockHash) {
		return true
	}

	return false
}

// SetBlockHash gets a reference to the given string and assigns it to the BlockHash field.
func (o *InvokeContractResponse) SetBlockHash(v string) {
	o.BlockHash = &v
}

func (o InvokeContractResponse) MarshalJSON() ([]byte, error) {
	toSerialize,err := o.ToMap()
	if err != nil {
		return []byte{}, err
	}
	return json.Marshal(toSerialize)
}

func (o InvokeContractResponse) ToMap() (map[string]interface{}, error) {
	toSerialize := map[string]interface{}{}
	if o.CallOutput != nil {
		toSerialize["callOutput"] = o.CallOutput
	}
	toSerialize["success"] = o.Success
	if !IsNil(o.TxHash) {
		toSerialize["txHash"] = o.TxHash
	}
	if !IsNil(o.BlockHash) {
		toSerialize["blockHash"] = o.BlockHash
	}
	return toSerialize, nil
}

type NullableInvokeContractResponse struct {
	value *InvokeContractResponse
	isSet bool
}

func (v NullableInvokeContractResponse) Get() *InvokeContractResponse {
	return v.value
}

func (v *NullableInvokeContractResponse) Set(val *InvokeContractResponse) {
	v.value = val
	v.isSet = true
}

func (v NullableInvokeContractResponse) IsSet() bool {
	return v.isSet
}

func (v *NullableInvokeContractResponse) Unset() {
	v.value = nil
	v.isSet = false
}

func NewNullableInvokeContractResponse(val *InvokeContractResponse) *NullableInvokeContractResponse {
	return &NullableInvokeContractResponse{value: val, isSet: true}
}

func (v NullableInvokeContractResponse) MarshalJSON() ([]byte, error) {
	return json.Marshal(v.value)
}

func (v *NullableInvokeContractResponse) UnmarshalJSON(src []byte) error {
	v.isSet = true
	return json.Unmarshal(src, &v.value)
}


