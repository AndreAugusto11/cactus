/*
Hyperledger Cacti Plugin - Connector Aries

Can communicate with other Aries agents and Cacti Aries connectors

API version: 2.0.0-rc.5
*/

// Code generated by OpenAPI Generator (https://openapi-generator.tech); DO NOT EDIT.

package cactus-plugin-ledger-connector-aries

import (
	"encoding/json"
	"fmt"
)

// CactiAcceptPolicyV1 Credential / Proof requests acceptance policies for Aries agent
type CactiAcceptPolicyV1 string

// List of CactiAcceptPolicyV1
const (
	Always CactiAcceptPolicyV1 = "always"
	ContentApproved CactiAcceptPolicyV1 = "contentApproved"
	Never CactiAcceptPolicyV1 = "never"
)

// All allowed values of CactiAcceptPolicyV1 enum
var AllowedCactiAcceptPolicyV1EnumValues = []CactiAcceptPolicyV1{
	"always",
	"contentApproved",
	"never",
}

func (v *CactiAcceptPolicyV1) UnmarshalJSON(src []byte) error {
	var value string
	err := json.Unmarshal(src, &value)
	if err != nil {
		return err
	}
	enumTypeValue := CactiAcceptPolicyV1(value)
	for _, existing := range AllowedCactiAcceptPolicyV1EnumValues {
		if existing == enumTypeValue {
			*v = enumTypeValue
			return nil
		}
	}

	return fmt.Errorf("%+v is not a valid CactiAcceptPolicyV1", value)
}

// NewCactiAcceptPolicyV1FromValue returns a pointer to a valid CactiAcceptPolicyV1
// for the value passed as argument, or an error if the value passed is not allowed by the enum
func NewCactiAcceptPolicyV1FromValue(v string) (*CactiAcceptPolicyV1, error) {
	ev := CactiAcceptPolicyV1(v)
	if ev.IsValid() {
		return &ev, nil
	} else {
		return nil, fmt.Errorf("invalid value '%v' for CactiAcceptPolicyV1: valid values are %v", v, AllowedCactiAcceptPolicyV1EnumValues)
	}
}

// IsValid return true if the value is valid for the enum, false otherwise
func (v CactiAcceptPolicyV1) IsValid() bool {
	for _, existing := range AllowedCactiAcceptPolicyV1EnumValues {
		if existing == v {
			return true
		}
	}
	return false
}

// Ptr returns reference to CactiAcceptPolicyV1 value
func (v CactiAcceptPolicyV1) Ptr() *CactiAcceptPolicyV1 {
	return &v
}

type NullableCactiAcceptPolicyV1 struct {
	value *CactiAcceptPolicyV1
	isSet bool
}

func (v NullableCactiAcceptPolicyV1) Get() *CactiAcceptPolicyV1 {
	return v.value
}

func (v *NullableCactiAcceptPolicyV1) Set(val *CactiAcceptPolicyV1) {
	v.value = val
	v.isSet = true
}

func (v NullableCactiAcceptPolicyV1) IsSet() bool {
	return v.isSet
}

func (v *NullableCactiAcceptPolicyV1) Unset() {
	v.value = nil
	v.isSet = false
}

func NewNullableCactiAcceptPolicyV1(val *CactiAcceptPolicyV1) *NullableCactiAcceptPolicyV1 {
	return &NullableCactiAcceptPolicyV1{value: val, isSet: true}
}

func (v NullableCactiAcceptPolicyV1) MarshalJSON() ([]byte, error) {
	return json.Marshal(v.value)
}

func (v *NullableCactiAcceptPolicyV1) UnmarshalJSON(src []byte) error {
	v.isSet = true
	return json.Unmarshal(src, &v.value)
}

