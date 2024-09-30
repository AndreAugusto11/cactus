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

// checks if the KeychainReference type satisfies the MappedNullable interface at compile time
var _ MappedNullable = &KeychainReference{}

// KeychainReference Reference to entry stored in Cactus keychain plugin.
type KeychainReference struct {
	// Keychain plugin ID.
	KeychainId string `json:"keychainId"`
	// Key reference name.
	KeychainRef string `json:"keychainRef"`
}

// NewKeychainReference instantiates a new KeychainReference object
// This constructor will assign default values to properties that have it defined,
// and makes sure properties required by API are set, but the set of arguments
// will change when the set of required properties is changed
func NewKeychainReference(keychainId string, keychainRef string) *KeychainReference {
	this := KeychainReference{}
	this.KeychainId = keychainId
	this.KeychainRef = keychainRef
	return &this
}

// NewKeychainReferenceWithDefaults instantiates a new KeychainReference object
// This constructor will only assign default values to properties that have it defined,
// but it doesn't guarantee that properties required by API are set
func NewKeychainReferenceWithDefaults() *KeychainReference {
	this := KeychainReference{}
	return &this
}

// GetKeychainId returns the KeychainId field value
func (o *KeychainReference) GetKeychainId() string {
	if o == nil {
		var ret string
		return ret
	}

	return o.KeychainId
}

// GetKeychainIdOk returns a tuple with the KeychainId field value
// and a boolean to check if the value has been set.
func (o *KeychainReference) GetKeychainIdOk() (*string, bool) {
	if o == nil {
		return nil, false
	}
	return &o.KeychainId, true
}

// SetKeychainId sets field value
func (o *KeychainReference) SetKeychainId(v string) {
	o.KeychainId = v
}

// GetKeychainRef returns the KeychainRef field value
func (o *KeychainReference) GetKeychainRef() string {
	if o == nil {
		var ret string
		return ret
	}

	return o.KeychainRef
}

// GetKeychainRefOk returns a tuple with the KeychainRef field value
// and a boolean to check if the value has been set.
func (o *KeychainReference) GetKeychainRefOk() (*string, bool) {
	if o == nil {
		return nil, false
	}
	return &o.KeychainRef, true
}

// SetKeychainRef sets field value
func (o *KeychainReference) SetKeychainRef(v string) {
	o.KeychainRef = v
}

func (o KeychainReference) MarshalJSON() ([]byte, error) {
	toSerialize,err := o.ToMap()
	if err != nil {
		return []byte{}, err
	}
	return json.Marshal(toSerialize)
}

func (o KeychainReference) ToMap() (map[string]interface{}, error) {
	toSerialize := map[string]interface{}{}
	toSerialize["keychainId"] = o.KeychainId
	toSerialize["keychainRef"] = o.KeychainRef
	return toSerialize, nil
}

type NullableKeychainReference struct {
	value *KeychainReference
	isSet bool
}

func (v NullableKeychainReference) Get() *KeychainReference {
	return v.value
}

func (v *NullableKeychainReference) Set(val *KeychainReference) {
	v.value = val
	v.isSet = true
}

func (v NullableKeychainReference) IsSet() bool {
	return v.isSet
}

func (v *NullableKeychainReference) Unset() {
	v.value = nil
	v.isSet = false
}

func NewNullableKeychainReference(val *KeychainReference) *NullableKeychainReference {
	return &NullableKeychainReference{value: val, isSet: true}
}

func (v NullableKeychainReference) MarshalJSON() ([]byte, error) {
	return json.Marshal(v.value)
}

func (v *NullableKeychainReference) UnmarshalJSON(src []byte) error {
	v.isSet = true
	return json.Unmarshal(src, &v.value)
}


