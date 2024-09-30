/*
Hyperledger Core API

Contains/describes the core API types for Cactus. Does not describe actual endpoints on its own as this is left to the implementing plugins who can import and re-use commonly needed type definitions from this specification. One example of said commonly used type definitions would be the types related to consortium management, cactus nodes, ledgers, etc..

API version: 2.0.0-rc.5
*/

// Code generated by OpenAPI Generator (https://openapi-generator.tech); DO NOT EDIT.

package cactus-core-api

import (
	"encoding/json"
	"fmt"
)

// ConsensusAlgorithmFamily Enumerates a list of consensus algorithm families in existence. Does not intend to be an exhaustive list, just a practical one, meaning that we only include items here that are relevant to Hyperledger Cactus in fulfilling its own duties. This can be extended later as more sophisticated features of Cactus get implemented. This enum is meant to be first and foremost a useful abstraction for achieving practical tasks, not an encyclopedia and therefore we ask of everyone that this to be extended only in ways that serve a practical purpose for the runtime behavior of Cactus or Cactus plugins in general. The bottom line is that we can accept this enum being not 100% accurate as long as it 100% satisfies what it was designed to do.
type ConsensusAlgorithmFamily string

// List of ConsensusAlgorithmFamily
const (
	AUTHORITY ConsensusAlgorithmFamily = "org.hyperledger.cactus.consensusalgorithm.PROOF_OF_AUTHORITY"
	STAKE ConsensusAlgorithmFamily = "org.hyperledger.cactus.consensusalgorithm.PROOF_OF_STAKE"
	WORK ConsensusAlgorithmFamily = "org.hyperledger.cactus.consensusalgorithm.PROOF_OF_WORK"
)

// All allowed values of ConsensusAlgorithmFamily enum
var AllowedConsensusAlgorithmFamilyEnumValues = []ConsensusAlgorithmFamily{
	"org.hyperledger.cactus.consensusalgorithm.PROOF_OF_AUTHORITY",
	"org.hyperledger.cactus.consensusalgorithm.PROOF_OF_STAKE",
	"org.hyperledger.cactus.consensusalgorithm.PROOF_OF_WORK",
}

func (v *ConsensusAlgorithmFamily) UnmarshalJSON(src []byte) error {
	var value string
	err := json.Unmarshal(src, &value)
	if err != nil {
		return err
	}
	enumTypeValue := ConsensusAlgorithmFamily(value)
	for _, existing := range AllowedConsensusAlgorithmFamilyEnumValues {
		if existing == enumTypeValue {
			*v = enumTypeValue
			return nil
		}
	}

	return fmt.Errorf("%+v is not a valid ConsensusAlgorithmFamily", value)
}

// NewConsensusAlgorithmFamilyFromValue returns a pointer to a valid ConsensusAlgorithmFamily
// for the value passed as argument, or an error if the value passed is not allowed by the enum
func NewConsensusAlgorithmFamilyFromValue(v string) (*ConsensusAlgorithmFamily, error) {
	ev := ConsensusAlgorithmFamily(v)
	if ev.IsValid() {
		return &ev, nil
	} else {
		return nil, fmt.Errorf("invalid value '%v' for ConsensusAlgorithmFamily: valid values are %v", v, AllowedConsensusAlgorithmFamilyEnumValues)
	}
}

// IsValid return true if the value is valid for the enum, false otherwise
func (v ConsensusAlgorithmFamily) IsValid() bool {
	for _, existing := range AllowedConsensusAlgorithmFamilyEnumValues {
		if existing == v {
			return true
		}
	}
	return false
}

// Ptr returns reference to ConsensusAlgorithmFamily value
func (v ConsensusAlgorithmFamily) Ptr() *ConsensusAlgorithmFamily {
	return &v
}

type NullableConsensusAlgorithmFamily struct {
	value *ConsensusAlgorithmFamily
	isSet bool
}

func (v NullableConsensusAlgorithmFamily) Get() *ConsensusAlgorithmFamily {
	return v.value
}

func (v *NullableConsensusAlgorithmFamily) Set(val *ConsensusAlgorithmFamily) {
	v.value = val
	v.isSet = true
}

func (v NullableConsensusAlgorithmFamily) IsSet() bool {
	return v.isSet
}

func (v *NullableConsensusAlgorithmFamily) Unset() {
	v.value = nil
	v.isSet = false
}

func NewNullableConsensusAlgorithmFamily(val *ConsensusAlgorithmFamily) *NullableConsensusAlgorithmFamily {
	return &NullableConsensusAlgorithmFamily{value: val, isSet: true}
}

func (v NullableConsensusAlgorithmFamily) MarshalJSON() ([]byte, error) {
	return json.Marshal(v.value)
}

func (v *NullableConsensusAlgorithmFamily) UnmarshalJSON(src []byte) error {
	v.isSet = true
	return json.Unmarshal(src, &v.value)
}

