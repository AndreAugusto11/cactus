/*
Hyperledger Core API

Contains/describes the core API types for Cactus. Does not describe actual endpoints on its own as this is left to the implementing plugins who can import and re-use commonly needed type definitions from this specification. One example of said commonly used type definitions would be the types related to consortium management, cactus nodes, ledgers, etc..

API version: 2.0.0-rc.5
*/

// Code generated by OpenAPI Generator (https://openapi-generator.tech); DO NOT EDIT.

package cactus-core-api

import (
	"encoding/json"
)

// checks if the PluginInstance type satisfies the MappedNullable interface at compile time
var _ MappedNullable = &PluginInstance{}

// PluginInstance struct for PluginInstance
type PluginInstance struct {
	Id string `json:"id"`
	PackageName string `json:"packageName"`
}

// NewPluginInstance instantiates a new PluginInstance object
// This constructor will assign default values to properties that have it defined,
// and makes sure properties required by API are set, but the set of arguments
// will change when the set of required properties is changed
func NewPluginInstance(id string, packageName string) *PluginInstance {
	this := PluginInstance{}
	this.Id = id
	this.PackageName = packageName
	return &this
}

// NewPluginInstanceWithDefaults instantiates a new PluginInstance object
// This constructor will only assign default values to properties that have it defined,
// but it doesn't guarantee that properties required by API are set
func NewPluginInstanceWithDefaults() *PluginInstance {
	this := PluginInstance{}
	return &this
}

// GetId returns the Id field value
func (o *PluginInstance) GetId() string {
	if o == nil {
		var ret string
		return ret
	}

	return o.Id
}

// GetIdOk returns a tuple with the Id field value
// and a boolean to check if the value has been set.
func (o *PluginInstance) GetIdOk() (*string, bool) {
	if o == nil {
		return nil, false
	}
	return &o.Id, true
}

// SetId sets field value
func (o *PluginInstance) SetId(v string) {
	o.Id = v
}

// GetPackageName returns the PackageName field value
func (o *PluginInstance) GetPackageName() string {
	if o == nil {
		var ret string
		return ret
	}

	return o.PackageName
}

// GetPackageNameOk returns a tuple with the PackageName field value
// and a boolean to check if the value has been set.
func (o *PluginInstance) GetPackageNameOk() (*string, bool) {
	if o == nil {
		return nil, false
	}
	return &o.PackageName, true
}

// SetPackageName sets field value
func (o *PluginInstance) SetPackageName(v string) {
	o.PackageName = v
}

func (o PluginInstance) MarshalJSON() ([]byte, error) {
	toSerialize,err := o.ToMap()
	if err != nil {
		return []byte{}, err
	}
	return json.Marshal(toSerialize)
}

func (o PluginInstance) ToMap() (map[string]interface{}, error) {
	toSerialize := map[string]interface{}{}
	toSerialize["id"] = o.Id
	toSerialize["packageName"] = o.PackageName
	return toSerialize, nil
}

type NullablePluginInstance struct {
	value *PluginInstance
	isSet bool
}

func (v NullablePluginInstance) Get() *PluginInstance {
	return v.value
}

func (v *NullablePluginInstance) Set(val *PluginInstance) {
	v.value = val
	v.isSet = true
}

func (v NullablePluginInstance) IsSet() bool {
	return v.isSet
}

func (v *NullablePluginInstance) Unset() {
	v.value = nil
	v.isSet = false
}

func NewNullablePluginInstance(val *PluginInstance) *NullablePluginInstance {
	return &NullablePluginInstance{value: val, isSet: true}
}

func (v NullablePluginInstance) MarshalJSON() ([]byte, error) {
	return json.Marshal(v.value)
}

func (v *NullablePluginInstance) UnmarshalJSON(src []byte) error {
	v.isSet = true
	return json.Unmarshal(src, &v.value)
}


