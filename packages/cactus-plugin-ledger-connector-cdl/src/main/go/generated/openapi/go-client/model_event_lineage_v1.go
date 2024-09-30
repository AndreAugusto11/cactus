/*
Hyperledger Cacti Plugin - Connector CDL

Can perform basic tasks on Fujitsu CDL service.

API version: 2.0.0-rc.5
*/

// Code generated by OpenAPI Generator (https://openapi-generator.tech); DO NOT EDIT.

package cactus-plugin-ledger-connector-cdl

import (
	"encoding/json"
)

// checks if the EventLineageV1 type satisfies the MappedNullable interface at compile time
var _ MappedNullable = &EventLineageV1{}

// EventLineageV1 CDL event linage information (used to identify related events)
type EventLineageV1 struct {
	CdlEventId String `json:"cdl:EventId"`
	CdlLineageId String `json:"cdl:LineageId"`
	CdlDataModelMode String `json:"cdl:DataModelMode"`
	CdlDataModelVersion String `json:"cdl:DataModelVersion"`
	CdlDataRegistrationTimeStamp String `json:"cdl:DataRegistrationTimeStamp"`
	CdlNextEventIdList []String `json:"cdl:NextEventIdList"`
	CdlPreviousEventIdList []String `json:"cdl:PreviousEventIdList"`
}

// NewEventLineageV1 instantiates a new EventLineageV1 object
// This constructor will assign default values to properties that have it defined,
// and makes sure properties required by API are set, but the set of arguments
// will change when the set of required properties is changed
func NewEventLineageV1(cdlEventId String, cdlLineageId String, cdlDataModelMode String, cdlDataModelVersion String, cdlDataRegistrationTimeStamp String, cdlNextEventIdList []String, cdlPreviousEventIdList []String) *EventLineageV1 {
	this := EventLineageV1{}
	this.CdlEventId = cdlEventId
	this.CdlLineageId = cdlLineageId
	this.CdlDataModelMode = cdlDataModelMode
	this.CdlDataModelVersion = cdlDataModelVersion
	this.CdlDataRegistrationTimeStamp = cdlDataRegistrationTimeStamp
	this.CdlNextEventIdList = cdlNextEventIdList
	this.CdlPreviousEventIdList = cdlPreviousEventIdList
	return &this
}

// NewEventLineageV1WithDefaults instantiates a new EventLineageV1 object
// This constructor will only assign default values to properties that have it defined,
// but it doesn't guarantee that properties required by API are set
func NewEventLineageV1WithDefaults() *EventLineageV1 {
	this := EventLineageV1{}
	return &this
}

// GetCdlEventId returns the CdlEventId field value
func (o *EventLineageV1) GetCdlEventId() String {
	if o == nil {
		var ret String
		return ret
	}

	return o.CdlEventId
}

// GetCdlEventIdOk returns a tuple with the CdlEventId field value
// and a boolean to check if the value has been set.
func (o *EventLineageV1) GetCdlEventIdOk() (*String, bool) {
	if o == nil {
		return nil, false
	}
	return &o.CdlEventId, true
}

// SetCdlEventId sets field value
func (o *EventLineageV1) SetCdlEventId(v String) {
	o.CdlEventId = v
}

// GetCdlLineageId returns the CdlLineageId field value
func (o *EventLineageV1) GetCdlLineageId() String {
	if o == nil {
		var ret String
		return ret
	}

	return o.CdlLineageId
}

// GetCdlLineageIdOk returns a tuple with the CdlLineageId field value
// and a boolean to check if the value has been set.
func (o *EventLineageV1) GetCdlLineageIdOk() (*String, bool) {
	if o == nil {
		return nil, false
	}
	return &o.CdlLineageId, true
}

// SetCdlLineageId sets field value
func (o *EventLineageV1) SetCdlLineageId(v String) {
	o.CdlLineageId = v
}

// GetCdlDataModelMode returns the CdlDataModelMode field value
func (o *EventLineageV1) GetCdlDataModelMode() String {
	if o == nil {
		var ret String
		return ret
	}

	return o.CdlDataModelMode
}

// GetCdlDataModelModeOk returns a tuple with the CdlDataModelMode field value
// and a boolean to check if the value has been set.
func (o *EventLineageV1) GetCdlDataModelModeOk() (*String, bool) {
	if o == nil {
		return nil, false
	}
	return &o.CdlDataModelMode, true
}

// SetCdlDataModelMode sets field value
func (o *EventLineageV1) SetCdlDataModelMode(v String) {
	o.CdlDataModelMode = v
}

// GetCdlDataModelVersion returns the CdlDataModelVersion field value
func (o *EventLineageV1) GetCdlDataModelVersion() String {
	if o == nil {
		var ret String
		return ret
	}

	return o.CdlDataModelVersion
}

// GetCdlDataModelVersionOk returns a tuple with the CdlDataModelVersion field value
// and a boolean to check if the value has been set.
func (o *EventLineageV1) GetCdlDataModelVersionOk() (*String, bool) {
	if o == nil {
		return nil, false
	}
	return &o.CdlDataModelVersion, true
}

// SetCdlDataModelVersion sets field value
func (o *EventLineageV1) SetCdlDataModelVersion(v String) {
	o.CdlDataModelVersion = v
}

// GetCdlDataRegistrationTimeStamp returns the CdlDataRegistrationTimeStamp field value
func (o *EventLineageV1) GetCdlDataRegistrationTimeStamp() String {
	if o == nil {
		var ret String
		return ret
	}

	return o.CdlDataRegistrationTimeStamp
}

// GetCdlDataRegistrationTimeStampOk returns a tuple with the CdlDataRegistrationTimeStamp field value
// and a boolean to check if the value has been set.
func (o *EventLineageV1) GetCdlDataRegistrationTimeStampOk() (*String, bool) {
	if o == nil {
		return nil, false
	}
	return &o.CdlDataRegistrationTimeStamp, true
}

// SetCdlDataRegistrationTimeStamp sets field value
func (o *EventLineageV1) SetCdlDataRegistrationTimeStamp(v String) {
	o.CdlDataRegistrationTimeStamp = v
}

// GetCdlNextEventIdList returns the CdlNextEventIdList field value
func (o *EventLineageV1) GetCdlNextEventIdList() []String {
	if o == nil {
		var ret []String
		return ret
	}

	return o.CdlNextEventIdList
}

// GetCdlNextEventIdListOk returns a tuple with the CdlNextEventIdList field value
// and a boolean to check if the value has been set.
func (o *EventLineageV1) GetCdlNextEventIdListOk() ([]String, bool) {
	if o == nil {
		return nil, false
	}
	return o.CdlNextEventIdList, true
}

// SetCdlNextEventIdList sets field value
func (o *EventLineageV1) SetCdlNextEventIdList(v []String) {
	o.CdlNextEventIdList = v
}

// GetCdlPreviousEventIdList returns the CdlPreviousEventIdList field value
func (o *EventLineageV1) GetCdlPreviousEventIdList() []String {
	if o == nil {
		var ret []String
		return ret
	}

	return o.CdlPreviousEventIdList
}

// GetCdlPreviousEventIdListOk returns a tuple with the CdlPreviousEventIdList field value
// and a boolean to check if the value has been set.
func (o *EventLineageV1) GetCdlPreviousEventIdListOk() ([]String, bool) {
	if o == nil {
		return nil, false
	}
	return o.CdlPreviousEventIdList, true
}

// SetCdlPreviousEventIdList sets field value
func (o *EventLineageV1) SetCdlPreviousEventIdList(v []String) {
	o.CdlPreviousEventIdList = v
}

func (o EventLineageV1) MarshalJSON() ([]byte, error) {
	toSerialize,err := o.ToMap()
	if err != nil {
		return []byte{}, err
	}
	return json.Marshal(toSerialize)
}

func (o EventLineageV1) ToMap() (map[string]interface{}, error) {
	toSerialize := map[string]interface{}{}
	toSerialize["cdl:EventId"] = o.CdlEventId
	toSerialize["cdl:LineageId"] = o.CdlLineageId
	toSerialize["cdl:DataModelMode"] = o.CdlDataModelMode
	toSerialize["cdl:DataModelVersion"] = o.CdlDataModelVersion
	toSerialize["cdl:DataRegistrationTimeStamp"] = o.CdlDataRegistrationTimeStamp
	toSerialize["cdl:NextEventIdList"] = o.CdlNextEventIdList
	toSerialize["cdl:PreviousEventIdList"] = o.CdlPreviousEventIdList
	return toSerialize, nil
}

type NullableEventLineageV1 struct {
	value *EventLineageV1
	isSet bool
}

func (v NullableEventLineageV1) Get() *EventLineageV1 {
	return v.value
}

func (v *NullableEventLineageV1) Set(val *EventLineageV1) {
	v.value = val
	v.isSet = true
}

func (v NullableEventLineageV1) IsSet() bool {
	return v.isSet
}

func (v *NullableEventLineageV1) Unset() {
	v.value = nil
	v.isSet = false
}

func NewNullableEventLineageV1(val *EventLineageV1) *NullableEventLineageV1 {
	return &NullableEventLineageV1{value: val, isSet: true}
}

func (v NullableEventLineageV1) MarshalJSON() ([]byte, error) {
	return json.Marshal(v.value)
}

func (v *NullableEventLineageV1) UnmarshalJSON(src []byte) error {
	v.isSet = true
	return json.Unmarshal(src, &v.value)
}


