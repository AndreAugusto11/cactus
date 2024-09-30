/*
Hyperledger Cactus - Keychain API

Contains/describes the Keychain API types/paths for Hyperledger Cactus.

API version: 2.0.0-rc.5
*/

// Code generated by OpenAPI Generator (https://openapi-generator.tech); DO NOT EDIT.

package cactus-plugin-keychain-google-sm

import (
	"encoding/json"
)

// checks if the SetKeychainEntryResponseV1 type satisfies the MappedNullable interface at compile time
var _ MappedNullable = &SetKeychainEntryResponseV1{}

// SetKeychainEntryResponseV1 struct for SetKeychainEntryResponseV1
type SetKeychainEntryResponseV1 struct {
	// The key that was used to set the value on the keychain.
	Key string `json:"key"`
}

// NewSetKeychainEntryResponseV1 instantiates a new SetKeychainEntryResponseV1 object
// This constructor will assign default values to properties that have it defined,
// and makes sure properties required by API are set, but the set of arguments
// will change when the set of required properties is changed
func NewSetKeychainEntryResponseV1(key string) *SetKeychainEntryResponseV1 {
	this := SetKeychainEntryResponseV1{}
	this.Key = key
	return &this
}

// NewSetKeychainEntryResponseV1WithDefaults instantiates a new SetKeychainEntryResponseV1 object
// This constructor will only assign default values to properties that have it defined,
// but it doesn't guarantee that properties required by API are set
func NewSetKeychainEntryResponseV1WithDefaults() *SetKeychainEntryResponseV1 {
	this := SetKeychainEntryResponseV1{}
	return &this
}

// GetKey returns the Key field value
func (o *SetKeychainEntryResponseV1) GetKey() string {
	if o == nil {
		var ret string
		return ret
	}

	return o.Key
}

// GetKeyOk returns a tuple with the Key field value
// and a boolean to check if the value has been set.
func (o *SetKeychainEntryResponseV1) GetKeyOk() (*string, bool) {
	if o == nil {
		return nil, false
	}
	return &o.Key, true
}

// SetKey sets field value
func (o *SetKeychainEntryResponseV1) SetKey(v string) {
	o.Key = v
}

func (o SetKeychainEntryResponseV1) MarshalJSON() ([]byte, error) {
	toSerialize,err := o.ToMap()
	if err != nil {
		return []byte{}, err
	}
	return json.Marshal(toSerialize)
}

func (o SetKeychainEntryResponseV1) ToMap() (map[string]interface{}, error) {
	toSerialize := map[string]interface{}{}
	toSerialize["key"] = o.Key
	return toSerialize, nil
}

type NullableSetKeychainEntryResponseV1 struct {
	value *SetKeychainEntryResponseV1
	isSet bool
}

func (v NullableSetKeychainEntryResponseV1) Get() *SetKeychainEntryResponseV1 {
	return v.value
}

func (v *NullableSetKeychainEntryResponseV1) Set(val *SetKeychainEntryResponseV1) {
	v.value = val
	v.isSet = true
}

func (v NullableSetKeychainEntryResponseV1) IsSet() bool {
	return v.isSet
}

func (v *NullableSetKeychainEntryResponseV1) Unset() {
	v.value = nil
	v.isSet = false
}

func NewNullableSetKeychainEntryResponseV1(val *SetKeychainEntryResponseV1) *NullableSetKeychainEntryResponseV1 {
	return &NullableSetKeychainEntryResponseV1{value: val, isSet: true}
}

func (v NullableSetKeychainEntryResponseV1) MarshalJSON() ([]byte, error) {
	return json.Marshal(v.value)
}

func (v *NullableSetKeychainEntryResponseV1) UnmarshalJSON(src []byte) error {
	v.isSet = true
	return json.Unmarshal(src, &v.value)
}


