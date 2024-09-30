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

// PluginImportAction the model 'PluginImportAction'
type PluginImportAction string

// List of PluginImportAction
const (
	INSTANTIATE PluginImportAction = "org.hyperledger.cactus.plugin_import_action.INSTANTIATE"
	INSTALL PluginImportAction = "org.hyperledger.cactus.plugin_import_action.INSTALL"
)

// All allowed values of PluginImportAction enum
var AllowedPluginImportActionEnumValues = []PluginImportAction{
	"org.hyperledger.cactus.plugin_import_action.INSTANTIATE",
	"org.hyperledger.cactus.plugin_import_action.INSTALL",
}

func (v *PluginImportAction) UnmarshalJSON(src []byte) error {
	var value string
	err := json.Unmarshal(src, &value)
	if err != nil {
		return err
	}
	enumTypeValue := PluginImportAction(value)
	for _, existing := range AllowedPluginImportActionEnumValues {
		if existing == enumTypeValue {
			*v = enumTypeValue
			return nil
		}
	}

	return fmt.Errorf("%+v is not a valid PluginImportAction", value)
}

// NewPluginImportActionFromValue returns a pointer to a valid PluginImportAction
// for the value passed as argument, or an error if the value passed is not allowed by the enum
func NewPluginImportActionFromValue(v string) (*PluginImportAction, error) {
	ev := PluginImportAction(v)
	if ev.IsValid() {
		return &ev, nil
	} else {
		return nil, fmt.Errorf("invalid value '%v' for PluginImportAction: valid values are %v", v, AllowedPluginImportActionEnumValues)
	}
}

// IsValid return true if the value is valid for the enum, false otherwise
func (v PluginImportAction) IsValid() bool {
	for _, existing := range AllowedPluginImportActionEnumValues {
		if existing == v {
			return true
		}
	}
	return false
}

// Ptr returns reference to PluginImportAction value
func (v PluginImportAction) Ptr() *PluginImportAction {
	return &v
}

type NullablePluginImportAction struct {
	value *PluginImportAction
	isSet bool
}

func (v NullablePluginImportAction) Get() *PluginImportAction {
	return v.value
}

func (v *NullablePluginImportAction) Set(val *PluginImportAction) {
	v.value = val
	v.isSet = true
}

func (v NullablePluginImportAction) IsSet() bool {
	return v.isSet
}

func (v *NullablePluginImportAction) Unset() {
	v.value = nil
	v.isSet = false
}

func NewNullablePluginImportAction(val *PluginImportAction) *NullablePluginImportAction {
	return &NullablePluginImportAction{value: val, isSet: true}
}

func (v NullablePluginImportAction) MarshalJSON() ([]byte, error) {
	return json.Marshal(v.value)
}

func (v *NullablePluginImportAction) UnmarshalJSON(src []byte) error {
	v.isSet = true
	return json.Unmarshal(src, &v.value)
}

