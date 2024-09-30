/*
Hyperledger Cactus Plugin - Connector Fabric

Can perform basic tasks on a fabric ledger

API version: 2.0.0-rc.5
*/

// Code generated by OpenAPI Generator (https://openapi-generator.tech); DO NOT EDIT.

package cactus-plugin-ledger-connector-fabric

import (
	"encoding/json"
)

// checks if the DeployContractV1Response type satisfies the MappedNullable interface at compile time
var _ MappedNullable = &DeployContractV1Response{}

// DeployContractV1Response struct for DeployContractV1Response
type DeployContractV1Response struct {
	Success bool `json:"success"`
	PackageIds []string `json:"packageIds"`
	Lifecycle ChainCodeLifeCycleCommandResponses `json:"lifecycle"`
}

// NewDeployContractV1Response instantiates a new DeployContractV1Response object
// This constructor will assign default values to properties that have it defined,
// and makes sure properties required by API are set, but the set of arguments
// will change when the set of required properties is changed
func NewDeployContractV1Response(success bool, packageIds []string, lifecycle ChainCodeLifeCycleCommandResponses) *DeployContractV1Response {
	this := DeployContractV1Response{}
	this.Success = success
	this.PackageIds = packageIds
	this.Lifecycle = lifecycle
	return &this
}

// NewDeployContractV1ResponseWithDefaults instantiates a new DeployContractV1Response object
// This constructor will only assign default values to properties that have it defined,
// but it doesn't guarantee that properties required by API are set
func NewDeployContractV1ResponseWithDefaults() *DeployContractV1Response {
	this := DeployContractV1Response{}
	return &this
}

// GetSuccess returns the Success field value
func (o *DeployContractV1Response) GetSuccess() bool {
	if o == nil {
		var ret bool
		return ret
	}

	return o.Success
}

// GetSuccessOk returns a tuple with the Success field value
// and a boolean to check if the value has been set.
func (o *DeployContractV1Response) GetSuccessOk() (*bool, bool) {
	if o == nil {
		return nil, false
	}
	return &o.Success, true
}

// SetSuccess sets field value
func (o *DeployContractV1Response) SetSuccess(v bool) {
	o.Success = v
}

// GetPackageIds returns the PackageIds field value
func (o *DeployContractV1Response) GetPackageIds() []string {
	if o == nil {
		var ret []string
		return ret
	}

	return o.PackageIds
}

// GetPackageIdsOk returns a tuple with the PackageIds field value
// and a boolean to check if the value has been set.
func (o *DeployContractV1Response) GetPackageIdsOk() ([]string, bool) {
	if o == nil {
		return nil, false
	}
	return o.PackageIds, true
}

// SetPackageIds sets field value
func (o *DeployContractV1Response) SetPackageIds(v []string) {
	o.PackageIds = v
}

// GetLifecycle returns the Lifecycle field value
func (o *DeployContractV1Response) GetLifecycle() ChainCodeLifeCycleCommandResponses {
	if o == nil {
		var ret ChainCodeLifeCycleCommandResponses
		return ret
	}

	return o.Lifecycle
}

// GetLifecycleOk returns a tuple with the Lifecycle field value
// and a boolean to check if the value has been set.
func (o *DeployContractV1Response) GetLifecycleOk() (*ChainCodeLifeCycleCommandResponses, bool) {
	if o == nil {
		return nil, false
	}
	return &o.Lifecycle, true
}

// SetLifecycle sets field value
func (o *DeployContractV1Response) SetLifecycle(v ChainCodeLifeCycleCommandResponses) {
	o.Lifecycle = v
}

func (o DeployContractV1Response) MarshalJSON() ([]byte, error) {
	toSerialize,err := o.ToMap()
	if err != nil {
		return []byte{}, err
	}
	return json.Marshal(toSerialize)
}

func (o DeployContractV1Response) ToMap() (map[string]interface{}, error) {
	toSerialize := map[string]interface{}{}
	toSerialize["success"] = o.Success
	toSerialize["packageIds"] = o.PackageIds
	toSerialize["lifecycle"] = o.Lifecycle
	return toSerialize, nil
}

type NullableDeployContractV1Response struct {
	value *DeployContractV1Response
	isSet bool
}

func (v NullableDeployContractV1Response) Get() *DeployContractV1Response {
	return v.value
}

func (v *NullableDeployContractV1Response) Set(val *DeployContractV1Response) {
	v.value = val
	v.isSet = true
}

func (v NullableDeployContractV1Response) IsSet() bool {
	return v.isSet
}

func (v *NullableDeployContractV1Response) Unset() {
	v.value = nil
	v.isSet = false
}

func NewNullableDeployContractV1Response(val *DeployContractV1Response) *NullableDeployContractV1Response {
	return &NullableDeployContractV1Response{value: val, isSet: true}
}

func (v NullableDeployContractV1Response) MarshalJSON() ([]byte, error) {
	return json.Marshal(v.value)
}

func (v *NullableDeployContractV1Response) UnmarshalJSON(src []byte) error {
	v.isSet = true
	return json.Unmarshal(src, &v.value)
}


