/*
Hyperledger Cactus Plugin - Connector Fabric

Can perform basic tasks on a fabric ledger

API version: 2.0.0-rc.5
*/

// Code generated by OpenAPI Generator (https://openapi-generator.tech); DO NOT EDIT.

package cactus-plugin-ledger-connector-fabric

import (
	"encoding/json"
	"fmt"
)

// RunTransactionResponseType Response format from transaction / query execution
type RunTransactionResponseType string

// List of RunTransactionResponseType
const (
	JSON RunTransactionResponseType = "org.hyperledger.cacti.api.hlfabric.RunTransactionResponseType.JSON"
	UTF8 RunTransactionResponseType = "org.hyperledger.cacti.api.hlfabric.RunTransactionResponseType.UTF8"
)

// All allowed values of RunTransactionResponseType enum
var AllowedRunTransactionResponseTypeEnumValues = []RunTransactionResponseType{
	"org.hyperledger.cacti.api.hlfabric.RunTransactionResponseType.JSON",
	"org.hyperledger.cacti.api.hlfabric.RunTransactionResponseType.UTF8",
}

func (v *RunTransactionResponseType) UnmarshalJSON(src []byte) error {
	var value string
	err := json.Unmarshal(src, &value)
	if err != nil {
		return err
	}
	enumTypeValue := RunTransactionResponseType(value)
	for _, existing := range AllowedRunTransactionResponseTypeEnumValues {
		if existing == enumTypeValue {
			*v = enumTypeValue
			return nil
		}
	}

	return fmt.Errorf("%+v is not a valid RunTransactionResponseType", value)
}

// NewRunTransactionResponseTypeFromValue returns a pointer to a valid RunTransactionResponseType
// for the value passed as argument, or an error if the value passed is not allowed by the enum
func NewRunTransactionResponseTypeFromValue(v string) (*RunTransactionResponseType, error) {
	ev := RunTransactionResponseType(v)
	if ev.IsValid() {
		return &ev, nil
	} else {
		return nil, fmt.Errorf("invalid value '%v' for RunTransactionResponseType: valid values are %v", v, AllowedRunTransactionResponseTypeEnumValues)
	}
}

// IsValid return true if the value is valid for the enum, false otherwise
func (v RunTransactionResponseType) IsValid() bool {
	for _, existing := range AllowedRunTransactionResponseTypeEnumValues {
		if existing == v {
			return true
		}
	}
	return false
}

// Ptr returns reference to RunTransactionResponseType value
func (v RunTransactionResponseType) Ptr() *RunTransactionResponseType {
	return &v
}

type NullableRunTransactionResponseType struct {
	value *RunTransactionResponseType
	isSet bool
}

func (v NullableRunTransactionResponseType) Get() *RunTransactionResponseType {
	return v.value
}

func (v *NullableRunTransactionResponseType) Set(val *RunTransactionResponseType) {
	v.value = val
	v.isSet = true
}

func (v NullableRunTransactionResponseType) IsSet() bool {
	return v.isSet
}

func (v *NullableRunTransactionResponseType) Unset() {
	v.value = nil
	v.isSet = false
}

func NewNullableRunTransactionResponseType(val *RunTransactionResponseType) *NullableRunTransactionResponseType {
	return &NullableRunTransactionResponseType{value: val, isSet: true}
}

func (v NullableRunTransactionResponseType) MarshalJSON() ([]byte, error) {
	return json.Marshal(v.value)
}

func (v *NullableRunTransactionResponseType) UnmarshalJSON(src []byte) error {
	v.isSet = true
	return json.Unmarshal(src, &v.value)
}

