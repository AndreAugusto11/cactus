/*
Hyperledger Cactus Plugin - Odap Hermes

Implementation for Odap and Hermes

API version: 2.0.0-rc.5
*/

// Code generated by OpenAPI Generator (https://openapi-generator.tech); DO NOT EDIT.

package cactus-plugin-satp-hermes

import (
	"encoding/json"
)

// checks if the RecoverSuccessV1Message type satisfies the MappedNullable interface at compile time
var _ MappedNullable = &RecoverSuccessV1Message{}

// RecoverSuccessV1Message struct for RecoverSuccessV1Message
type RecoverSuccessV1Message struct {
	SessionID string `json:"sessionID"`
	Success bool `json:"success"`
	Signature string `json:"signature"`
}

// NewRecoverSuccessV1Message instantiates a new RecoverSuccessV1Message object
// This constructor will assign default values to properties that have it defined,
// and makes sure properties required by API are set, but the set of arguments
// will change when the set of required properties is changed
func NewRecoverSuccessV1Message(sessionID string, success bool, signature string) *RecoverSuccessV1Message {
	this := RecoverSuccessV1Message{}
	this.SessionID = sessionID
	this.Success = success
	this.Signature = signature
	return &this
}

// NewRecoverSuccessV1MessageWithDefaults instantiates a new RecoverSuccessV1Message object
// This constructor will only assign default values to properties that have it defined,
// but it doesn't guarantee that properties required by API are set
func NewRecoverSuccessV1MessageWithDefaults() *RecoverSuccessV1Message {
	this := RecoverSuccessV1Message{}
	return &this
}

// GetSessionID returns the SessionID field value
func (o *RecoverSuccessV1Message) GetSessionID() string {
	if o == nil {
		var ret string
		return ret
	}

	return o.SessionID
}

// GetSessionIDOk returns a tuple with the SessionID field value
// and a boolean to check if the value has been set.
func (o *RecoverSuccessV1Message) GetSessionIDOk() (*string, bool) {
	if o == nil {
		return nil, false
	}
	return &o.SessionID, true
}

// SetSessionID sets field value
func (o *RecoverSuccessV1Message) SetSessionID(v string) {
	o.SessionID = v
}

// GetSuccess returns the Success field value
func (o *RecoverSuccessV1Message) GetSuccess() bool {
	if o == nil {
		var ret bool
		return ret
	}

	return o.Success
}

// GetSuccessOk returns a tuple with the Success field value
// and a boolean to check if the value has been set.
func (o *RecoverSuccessV1Message) GetSuccessOk() (*bool, bool) {
	if o == nil {
		return nil, false
	}
	return &o.Success, true
}

// SetSuccess sets field value
func (o *RecoverSuccessV1Message) SetSuccess(v bool) {
	o.Success = v
}

// GetSignature returns the Signature field value
func (o *RecoverSuccessV1Message) GetSignature() string {
	if o == nil {
		var ret string
		return ret
	}

	return o.Signature
}

// GetSignatureOk returns a tuple with the Signature field value
// and a boolean to check if the value has been set.
func (o *RecoverSuccessV1Message) GetSignatureOk() (*string, bool) {
	if o == nil {
		return nil, false
	}
	return &o.Signature, true
}

// SetSignature sets field value
func (o *RecoverSuccessV1Message) SetSignature(v string) {
	o.Signature = v
}

func (o RecoverSuccessV1Message) MarshalJSON() ([]byte, error) {
	toSerialize,err := o.ToMap()
	if err != nil {
		return []byte{}, err
	}
	return json.Marshal(toSerialize)
}

func (o RecoverSuccessV1Message) ToMap() (map[string]interface{}, error) {
	toSerialize := map[string]interface{}{}
	toSerialize["sessionID"] = o.SessionID
	toSerialize["success"] = o.Success
	toSerialize["signature"] = o.Signature
	return toSerialize, nil
}

type NullableRecoverSuccessV1Message struct {
	value *RecoverSuccessV1Message
	isSet bool
}

func (v NullableRecoverSuccessV1Message) Get() *RecoverSuccessV1Message {
	return v.value
}

func (v *NullableRecoverSuccessV1Message) Set(val *RecoverSuccessV1Message) {
	v.value = val
	v.isSet = true
}

func (v NullableRecoverSuccessV1Message) IsSet() bool {
	return v.isSet
}

func (v *NullableRecoverSuccessV1Message) Unset() {
	v.value = nil
	v.isSet = false
}

func NewNullableRecoverSuccessV1Message(val *RecoverSuccessV1Message) *NullableRecoverSuccessV1Message {
	return &NullableRecoverSuccessV1Message{value: val, isSet: true}
}

func (v NullableRecoverSuccessV1Message) MarshalJSON() ([]byte, error) {
	return json.Marshal(v.value)
}

func (v *NullableRecoverSuccessV1Message) UnmarshalJSON(src []byte) error {
	v.isSet = true
	return json.Unmarshal(src, &v.value)
}


