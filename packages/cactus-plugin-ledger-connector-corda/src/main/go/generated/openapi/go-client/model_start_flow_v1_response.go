/*
Hyperledger Cacti Plugin - Connector Corda

Can perform basic tasks on a Corda ledger

API version: 2.0.0-rc.5
*/

// Code generated by OpenAPI Generator (https://openapi-generator.tech); DO NOT EDIT.

package cactus-plugin-ledger-connector-corda

import (
	"encoding/json"
	"time"
)

// checks if the StartFlowV1Response type satisfies the MappedNullable interface at compile time
var _ MappedNullable = &StartFlowV1Response{}

// StartFlowV1Response struct for StartFlowV1Response
type StartFlowV1Response struct {
	ClientRequestId NullableString `json:"clientRequestId,omitempty"`
	FlowError *FlowV1Error `json:"flowError,omitempty"`
	FlowId NullableString `json:"flowId,omitempty"`
	FlowResult NullableString `json:"flowResult,omitempty"`
	FlowStatus string `json:"flowStatus"`
	HoldingIDShortHash string `json:"holdingIDShortHash"`
	Timestamp time.Time `json:"timestamp"`
}

// NewStartFlowV1Response instantiates a new StartFlowV1Response object
// This constructor will assign default values to properties that have it defined,
// and makes sure properties required by API are set, but the set of arguments
// will change when the set of required properties is changed
func NewStartFlowV1Response(flowStatus string, holdingIDShortHash string, timestamp time.Time) *StartFlowV1Response {
	this := StartFlowV1Response{}
	this.FlowStatus = flowStatus
	this.HoldingIDShortHash = holdingIDShortHash
	this.Timestamp = timestamp
	return &this
}

// NewStartFlowV1ResponseWithDefaults instantiates a new StartFlowV1Response object
// This constructor will only assign default values to properties that have it defined,
// but it doesn't guarantee that properties required by API are set
func NewStartFlowV1ResponseWithDefaults() *StartFlowV1Response {
	this := StartFlowV1Response{}
	return &this
}

// GetClientRequestId returns the ClientRequestId field value if set, zero value otherwise (both if not set or set to explicit null).
func (o *StartFlowV1Response) GetClientRequestId() string {
	if o == nil || IsNil(o.ClientRequestId.Get()) {
		var ret string
		return ret
	}
	return *o.ClientRequestId.Get()
}

// GetClientRequestIdOk returns a tuple with the ClientRequestId field value if set, nil otherwise
// and a boolean to check if the value has been set.
// NOTE: If the value is an explicit nil, `nil, true` will be returned
func (o *StartFlowV1Response) GetClientRequestIdOk() (*string, bool) {
	if o == nil {
		return nil, false
	}
	return o.ClientRequestId.Get(), o.ClientRequestId.IsSet()
}

// HasClientRequestId returns a boolean if a field has been set.
func (o *StartFlowV1Response) HasClientRequestId() bool {
	if o != nil && o.ClientRequestId.IsSet() {
		return true
	}

	return false
}

// SetClientRequestId gets a reference to the given NullableString and assigns it to the ClientRequestId field.
func (o *StartFlowV1Response) SetClientRequestId(v string) {
	o.ClientRequestId.Set(&v)
}
// SetClientRequestIdNil sets the value for ClientRequestId to be an explicit nil
func (o *StartFlowV1Response) SetClientRequestIdNil() {
	o.ClientRequestId.Set(nil)
}

// UnsetClientRequestId ensures that no value is present for ClientRequestId, not even an explicit nil
func (o *StartFlowV1Response) UnsetClientRequestId() {
	o.ClientRequestId.Unset()
}

// GetFlowError returns the FlowError field value if set, zero value otherwise.
func (o *StartFlowV1Response) GetFlowError() FlowV1Error {
	if o == nil || IsNil(o.FlowError) {
		var ret FlowV1Error
		return ret
	}
	return *o.FlowError
}

// GetFlowErrorOk returns a tuple with the FlowError field value if set, nil otherwise
// and a boolean to check if the value has been set.
func (o *StartFlowV1Response) GetFlowErrorOk() (*FlowV1Error, bool) {
	if o == nil || IsNil(o.FlowError) {
		return nil, false
	}
	return o.FlowError, true
}

// HasFlowError returns a boolean if a field has been set.
func (o *StartFlowV1Response) HasFlowError() bool {
	if o != nil && !IsNil(o.FlowError) {
		return true
	}

	return false
}

// SetFlowError gets a reference to the given FlowV1Error and assigns it to the FlowError field.
func (o *StartFlowV1Response) SetFlowError(v FlowV1Error) {
	o.FlowError = &v
}

// GetFlowId returns the FlowId field value if set, zero value otherwise (both if not set or set to explicit null).
func (o *StartFlowV1Response) GetFlowId() string {
	if o == nil || IsNil(o.FlowId.Get()) {
		var ret string
		return ret
	}
	return *o.FlowId.Get()
}

// GetFlowIdOk returns a tuple with the FlowId field value if set, nil otherwise
// and a boolean to check if the value has been set.
// NOTE: If the value is an explicit nil, `nil, true` will be returned
func (o *StartFlowV1Response) GetFlowIdOk() (*string, bool) {
	if o == nil {
		return nil, false
	}
	return o.FlowId.Get(), o.FlowId.IsSet()
}

// HasFlowId returns a boolean if a field has been set.
func (o *StartFlowV1Response) HasFlowId() bool {
	if o != nil && o.FlowId.IsSet() {
		return true
	}

	return false
}

// SetFlowId gets a reference to the given NullableString and assigns it to the FlowId field.
func (o *StartFlowV1Response) SetFlowId(v string) {
	o.FlowId.Set(&v)
}
// SetFlowIdNil sets the value for FlowId to be an explicit nil
func (o *StartFlowV1Response) SetFlowIdNil() {
	o.FlowId.Set(nil)
}

// UnsetFlowId ensures that no value is present for FlowId, not even an explicit nil
func (o *StartFlowV1Response) UnsetFlowId() {
	o.FlowId.Unset()
}

// GetFlowResult returns the FlowResult field value if set, zero value otherwise (both if not set or set to explicit null).
func (o *StartFlowV1Response) GetFlowResult() string {
	if o == nil || IsNil(o.FlowResult.Get()) {
		var ret string
		return ret
	}
	return *o.FlowResult.Get()
}

// GetFlowResultOk returns a tuple with the FlowResult field value if set, nil otherwise
// and a boolean to check if the value has been set.
// NOTE: If the value is an explicit nil, `nil, true` will be returned
func (o *StartFlowV1Response) GetFlowResultOk() (*string, bool) {
	if o == nil {
		return nil, false
	}
	return o.FlowResult.Get(), o.FlowResult.IsSet()
}

// HasFlowResult returns a boolean if a field has been set.
func (o *StartFlowV1Response) HasFlowResult() bool {
	if o != nil && o.FlowResult.IsSet() {
		return true
	}

	return false
}

// SetFlowResult gets a reference to the given NullableString and assigns it to the FlowResult field.
func (o *StartFlowV1Response) SetFlowResult(v string) {
	o.FlowResult.Set(&v)
}
// SetFlowResultNil sets the value for FlowResult to be an explicit nil
func (o *StartFlowV1Response) SetFlowResultNil() {
	o.FlowResult.Set(nil)
}

// UnsetFlowResult ensures that no value is present for FlowResult, not even an explicit nil
func (o *StartFlowV1Response) UnsetFlowResult() {
	o.FlowResult.Unset()
}

// GetFlowStatus returns the FlowStatus field value
func (o *StartFlowV1Response) GetFlowStatus() string {
	if o == nil {
		var ret string
		return ret
	}

	return o.FlowStatus
}

// GetFlowStatusOk returns a tuple with the FlowStatus field value
// and a boolean to check if the value has been set.
func (o *StartFlowV1Response) GetFlowStatusOk() (*string, bool) {
	if o == nil {
		return nil, false
	}
	return &o.FlowStatus, true
}

// SetFlowStatus sets field value
func (o *StartFlowV1Response) SetFlowStatus(v string) {
	o.FlowStatus = v
}

// GetHoldingIDShortHash returns the HoldingIDShortHash field value
func (o *StartFlowV1Response) GetHoldingIDShortHash() string {
	if o == nil {
		var ret string
		return ret
	}

	return o.HoldingIDShortHash
}

// GetHoldingIDShortHashOk returns a tuple with the HoldingIDShortHash field value
// and a boolean to check if the value has been set.
func (o *StartFlowV1Response) GetHoldingIDShortHashOk() (*string, bool) {
	if o == nil {
		return nil, false
	}
	return &o.HoldingIDShortHash, true
}

// SetHoldingIDShortHash sets field value
func (o *StartFlowV1Response) SetHoldingIDShortHash(v string) {
	o.HoldingIDShortHash = v
}

// GetTimestamp returns the Timestamp field value
func (o *StartFlowV1Response) GetTimestamp() time.Time {
	if o == nil {
		var ret time.Time
		return ret
	}

	return o.Timestamp
}

// GetTimestampOk returns a tuple with the Timestamp field value
// and a boolean to check if the value has been set.
func (o *StartFlowV1Response) GetTimestampOk() (*time.Time, bool) {
	if o == nil {
		return nil, false
	}
	return &o.Timestamp, true
}

// SetTimestamp sets field value
func (o *StartFlowV1Response) SetTimestamp(v time.Time) {
	o.Timestamp = v
}

func (o StartFlowV1Response) MarshalJSON() ([]byte, error) {
	toSerialize,err := o.ToMap()
	if err != nil {
		return []byte{}, err
	}
	return json.Marshal(toSerialize)
}

func (o StartFlowV1Response) ToMap() (map[string]interface{}, error) {
	toSerialize := map[string]interface{}{}
	if o.ClientRequestId.IsSet() {
		toSerialize["clientRequestId"] = o.ClientRequestId.Get()
	}
	if !IsNil(o.FlowError) {
		toSerialize["flowError"] = o.FlowError
	}
	if o.FlowId.IsSet() {
		toSerialize["flowId"] = o.FlowId.Get()
	}
	if o.FlowResult.IsSet() {
		toSerialize["flowResult"] = o.FlowResult.Get()
	}
	toSerialize["flowStatus"] = o.FlowStatus
	toSerialize["holdingIDShortHash"] = o.HoldingIDShortHash
	toSerialize["timestamp"] = o.Timestamp
	return toSerialize, nil
}

type NullableStartFlowV1Response struct {
	value *StartFlowV1Response
	isSet bool
}

func (v NullableStartFlowV1Response) Get() *StartFlowV1Response {
	return v.value
}

func (v *NullableStartFlowV1Response) Set(val *StartFlowV1Response) {
	v.value = val
	v.isSet = true
}

func (v NullableStartFlowV1Response) IsSet() bool {
	return v.isSet
}

func (v *NullableStartFlowV1Response) Unset() {
	v.value = nil
	v.isSet = false
}

func NewNullableStartFlowV1Response(val *StartFlowV1Response) *NullableStartFlowV1Response {
	return &NullableStartFlowV1Response{value: val, isSet: true}
}

func (v NullableStartFlowV1Response) MarshalJSON() ([]byte, error) {
	return json.Marshal(v.value)
}

func (v *NullableStartFlowV1Response) UnmarshalJSON(src []byte) error {
	v.isSet = true
	return json.Unmarshal(src, &v.value)
}


