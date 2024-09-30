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

// checks if the Web3SigningCredentialPrivateKeyHex type satisfies the MappedNullable interface at compile time
var _ MappedNullable = &Web3SigningCredentialPrivateKeyHex{}

// Web3SigningCredentialPrivateKeyHex struct for Web3SigningCredentialPrivateKeyHex
type Web3SigningCredentialPrivateKeyHex struct {
	Type Web3SigningCredentialType `json:"type"`
	// The ethereum account (public key) that the credential belongs to. Basically the username in the traditional terminology of authentication.
	EthAccount string `json:"ethAccount"`
	// The HEX encoded private key of an eth account.
	Secret string `json:"secret"`
}

// NewWeb3SigningCredentialPrivateKeyHex instantiates a new Web3SigningCredentialPrivateKeyHex object
// This constructor will assign default values to properties that have it defined,
// and makes sure properties required by API are set, but the set of arguments
// will change when the set of required properties is changed
func NewWeb3SigningCredentialPrivateKeyHex(type_ Web3SigningCredentialType, ethAccount string, secret string) *Web3SigningCredentialPrivateKeyHex {
	this := Web3SigningCredentialPrivateKeyHex{}
	this.Type = type_
	this.EthAccount = ethAccount
	this.Secret = secret
	return &this
}

// NewWeb3SigningCredentialPrivateKeyHexWithDefaults instantiates a new Web3SigningCredentialPrivateKeyHex object
// This constructor will only assign default values to properties that have it defined,
// but it doesn't guarantee that properties required by API are set
func NewWeb3SigningCredentialPrivateKeyHexWithDefaults() *Web3SigningCredentialPrivateKeyHex {
	this := Web3SigningCredentialPrivateKeyHex{}
	return &this
}

// GetType returns the Type field value
func (o *Web3SigningCredentialPrivateKeyHex) GetType() Web3SigningCredentialType {
	if o == nil {
		var ret Web3SigningCredentialType
		return ret
	}

	return o.Type
}

// GetTypeOk returns a tuple with the Type field value
// and a boolean to check if the value has been set.
func (o *Web3SigningCredentialPrivateKeyHex) GetTypeOk() (*Web3SigningCredentialType, bool) {
	if o == nil {
		return nil, false
	}
	return &o.Type, true
}

// SetType sets field value
func (o *Web3SigningCredentialPrivateKeyHex) SetType(v Web3SigningCredentialType) {
	o.Type = v
}

// GetEthAccount returns the EthAccount field value
func (o *Web3SigningCredentialPrivateKeyHex) GetEthAccount() string {
	if o == nil {
		var ret string
		return ret
	}

	return o.EthAccount
}

// GetEthAccountOk returns a tuple with the EthAccount field value
// and a boolean to check if the value has been set.
func (o *Web3SigningCredentialPrivateKeyHex) GetEthAccountOk() (*string, bool) {
	if o == nil {
		return nil, false
	}
	return &o.EthAccount, true
}

// SetEthAccount sets field value
func (o *Web3SigningCredentialPrivateKeyHex) SetEthAccount(v string) {
	o.EthAccount = v
}

// GetSecret returns the Secret field value
func (o *Web3SigningCredentialPrivateKeyHex) GetSecret() string {
	if o == nil {
		var ret string
		return ret
	}

	return o.Secret
}

// GetSecretOk returns a tuple with the Secret field value
// and a boolean to check if the value has been set.
func (o *Web3SigningCredentialPrivateKeyHex) GetSecretOk() (*string, bool) {
	if o == nil {
		return nil, false
	}
	return &o.Secret, true
}

// SetSecret sets field value
func (o *Web3SigningCredentialPrivateKeyHex) SetSecret(v string) {
	o.Secret = v
}

func (o Web3SigningCredentialPrivateKeyHex) MarshalJSON() ([]byte, error) {
	toSerialize,err := o.ToMap()
	if err != nil {
		return []byte{}, err
	}
	return json.Marshal(toSerialize)
}

func (o Web3SigningCredentialPrivateKeyHex) ToMap() (map[string]interface{}, error) {
	toSerialize := map[string]interface{}{}
	toSerialize["type"] = o.Type
	toSerialize["ethAccount"] = o.EthAccount
	toSerialize["secret"] = o.Secret
	return toSerialize, nil
}

type NullableWeb3SigningCredentialPrivateKeyHex struct {
	value *Web3SigningCredentialPrivateKeyHex
	isSet bool
}

func (v NullableWeb3SigningCredentialPrivateKeyHex) Get() *Web3SigningCredentialPrivateKeyHex {
	return v.value
}

func (v *NullableWeb3SigningCredentialPrivateKeyHex) Set(val *Web3SigningCredentialPrivateKeyHex) {
	v.value = val
	v.isSet = true
}

func (v NullableWeb3SigningCredentialPrivateKeyHex) IsSet() bool {
	return v.isSet
}

func (v *NullableWeb3SigningCredentialPrivateKeyHex) Unset() {
	v.value = nil
	v.isSet = false
}

func NewNullableWeb3SigningCredentialPrivateKeyHex(val *Web3SigningCredentialPrivateKeyHex) *NullableWeb3SigningCredentialPrivateKeyHex {
	return &NullableWeb3SigningCredentialPrivateKeyHex{value: val, isSet: true}
}

func (v NullableWeb3SigningCredentialPrivateKeyHex) MarshalJSON() ([]byte, error) {
	return json.Marshal(v.value)
}

func (v *NullableWeb3SigningCredentialPrivateKeyHex) UnmarshalJSON(src []byte) error {
	v.isSet = true
	return json.Unmarshal(src, &v.value)
}


