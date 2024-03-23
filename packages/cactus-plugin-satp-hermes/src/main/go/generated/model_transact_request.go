/*
SATP Gateway Client (Business Logic Orchestrator)

SATP is a protocol operating between two gateways that conducts the transfer of a digital asset from one gateway to another. The protocol establishes a secure channel between the endpoints and implements a 2-phase commit to ensure the properties of transfer atomicity, consistency, isolation and durability.  This API defines the gateway client facing API (business logic orchestrator, or BLO), which is named API-Type 1 in the SATP-Core specification.  **Additional Resources**: - [Proposed SATP Charter](https://datatracker.ietf.org/doc/charter-ietf-satp/) - [SATP Core draft](https://datatracker.ietf.org/doc/draft-ietf-satp-core) - [SATP Crash Recovery draft](https://datatracker.ietf.org/doc/draft-belchior-satp-gateway-recovery/) - [SATP Architecture draft](https://datatracker.ietf.org/doc/draft-ietf-satp-architecture/) - [SATP Use-Cases draft](https://datatracker.ietf.org/doc/draft-ramakrishna-sat-use-cases/) - [SATP Data sharing draft](https://datatracker.ietf.org/doc/draft-ramakrishna-satp-data-sharing) - [SATP View Addresses draft](https://datatracker.ietf.org/doc/draft-ramakrishna-satp-views-addresses)

API version: 0.0.2
*/

// Code generated by OpenAPI Generator (https://openapi-generator.tech); DO NOT EDIT.

package generated

import (
	"encoding/json"
)

// checks if the TransactRequest type satisfies the MappedNullable interface at compile time
var _ MappedNullable = &TransactRequest{}

// TransactRequest Request schema for initiating a transaction. Includes details such as the transaction context, mode (data or transfer), payload, and information about the source and destination DLT networks.
type TransactRequest struct {
	ContextID string `json:"contextID"`
	Mode string `json:"mode"`
	Payload *string `json:"payload,omitempty"`
	FromDLTNetworkID *string `json:"fromDLTNetworkID,omitempty"`
	ToDLTNetworkID *string `json:"toDLTNetworkID,omitempty"`
	FromAmount *string `json:"fromAmount,omitempty"`
	FromToken *string `json:"fromToken,omitempty"`
	ToAmount *string `json:"toAmount,omitempty"`
	ToToken *string `json:"toToken,omitempty"`
}

// NewTransactRequest instantiates a new TransactRequest object
// This constructor will assign default values to properties that have it defined,
// and makes sure properties required by API are set, but the set of arguments
// will change when the set of required properties is changed
func NewTransactRequest(contextID string, mode string) *TransactRequest {
	this := TransactRequest{}
	this.ContextID = contextID
	this.Mode = mode
	return &this
}

// NewTransactRequestWithDefaults instantiates a new TransactRequest object
// This constructor will only assign default values to properties that have it defined,
// but it doesn't guarantee that properties required by API are set
func NewTransactRequestWithDefaults() *TransactRequest {
	this := TransactRequest{}
	return &this
}

// GetContextID returns the ContextID field value
func (o *TransactRequest) GetContextID() string {
	if o == nil {
		var ret string
		return ret
	}

	return o.ContextID
}

// GetContextIDOk returns a tuple with the ContextID field value
// and a boolean to check if the value has been set.
func (o *TransactRequest) GetContextIDOk() (*string, bool) {
	if o == nil {
		return nil, false
	}
	return &o.ContextID, true
}

// SetContextID sets field value
func (o *TransactRequest) SetContextID(v string) {
	o.ContextID = v
}

// GetMode returns the Mode field value
func (o *TransactRequest) GetMode() string {
	if o == nil {
		var ret string
		return ret
	}

	return o.Mode
}

// GetModeOk returns a tuple with the Mode field value
// and a boolean to check if the value has been set.
func (o *TransactRequest) GetModeOk() (*string, bool) {
	if o == nil {
		return nil, false
	}
	return &o.Mode, true
}

// SetMode sets field value
func (o *TransactRequest) SetMode(v string) {
	o.Mode = v
}

// GetPayload returns the Payload field value if set, zero value otherwise.
func (o *TransactRequest) GetPayload() string {
	if o == nil || IsNil(o.Payload) {
		var ret string
		return ret
	}
	return *o.Payload
}

// GetPayloadOk returns a tuple with the Payload field value if set, nil otherwise
// and a boolean to check if the value has been set.
func (o *TransactRequest) GetPayloadOk() (*string, bool) {
	if o == nil || IsNil(o.Payload) {
		return nil, false
	}
	return o.Payload, true
}

// HasPayload returns a boolean if a field has been set.
func (o *TransactRequest) HasPayload() bool {
	if o != nil && !IsNil(o.Payload) {
		return true
	}

	return false
}

// SetPayload gets a reference to the given string and assigns it to the Payload field.
func (o *TransactRequest) SetPayload(v string) {
	o.Payload = &v
}

// GetFromDLTNetworkID returns the FromDLTNetworkID field value if set, zero value otherwise.
func (o *TransactRequest) GetFromDLTNetworkID() string {
	if o == nil || IsNil(o.FromDLTNetworkID) {
		var ret string
		return ret
	}
	return *o.FromDLTNetworkID
}

// GetFromDLTNetworkIDOk returns a tuple with the FromDLTNetworkID field value if set, nil otherwise
// and a boolean to check if the value has been set.
func (o *TransactRequest) GetFromDLTNetworkIDOk() (*string, bool) {
	if o == nil || IsNil(o.FromDLTNetworkID) {
		return nil, false
	}
	return o.FromDLTNetworkID, true
}

// HasFromDLTNetworkID returns a boolean if a field has been set.
func (o *TransactRequest) HasFromDLTNetworkID() bool {
	if o != nil && !IsNil(o.FromDLTNetworkID) {
		return true
	}

	return false
}

// SetFromDLTNetworkID gets a reference to the given string and assigns it to the FromDLTNetworkID field.
func (o *TransactRequest) SetFromDLTNetworkID(v string) {
	o.FromDLTNetworkID = &v
}

// GetToDLTNetworkID returns the ToDLTNetworkID field value if set, zero value otherwise.
func (o *TransactRequest) GetToDLTNetworkID() string {
	if o == nil || IsNil(o.ToDLTNetworkID) {
		var ret string
		return ret
	}
	return *o.ToDLTNetworkID
}

// GetToDLTNetworkIDOk returns a tuple with the ToDLTNetworkID field value if set, nil otherwise
// and a boolean to check if the value has been set.
func (o *TransactRequest) GetToDLTNetworkIDOk() (*string, bool) {
	if o == nil || IsNil(o.ToDLTNetworkID) {
		return nil, false
	}
	return o.ToDLTNetworkID, true
}

// HasToDLTNetworkID returns a boolean if a field has been set.
func (o *TransactRequest) HasToDLTNetworkID() bool {
	if o != nil && !IsNil(o.ToDLTNetworkID) {
		return true
	}

	return false
}

// SetToDLTNetworkID gets a reference to the given string and assigns it to the ToDLTNetworkID field.
func (o *TransactRequest) SetToDLTNetworkID(v string) {
	o.ToDLTNetworkID = &v
}

// GetFromAmount returns the FromAmount field value if set, zero value otherwise.
func (o *TransactRequest) GetFromAmount() string {
	if o == nil || IsNil(o.FromAmount) {
		var ret string
		return ret
	}
	return *o.FromAmount
}

// GetFromAmountOk returns a tuple with the FromAmount field value if set, nil otherwise
// and a boolean to check if the value has been set.
func (o *TransactRequest) GetFromAmountOk() (*string, bool) {
	if o == nil || IsNil(o.FromAmount) {
		return nil, false
	}
	return o.FromAmount, true
}

// HasFromAmount returns a boolean if a field has been set.
func (o *TransactRequest) HasFromAmount() bool {
	if o != nil && !IsNil(o.FromAmount) {
		return true
	}

	return false
}

// SetFromAmount gets a reference to the given string and assigns it to the FromAmount field.
func (o *TransactRequest) SetFromAmount(v string) {
	o.FromAmount = &v
}

// GetFromToken returns the FromToken field value if set, zero value otherwise.
func (o *TransactRequest) GetFromToken() string {
	if o == nil || IsNil(o.FromToken) {
		var ret string
		return ret
	}
	return *o.FromToken
}

// GetFromTokenOk returns a tuple with the FromToken field value if set, nil otherwise
// and a boolean to check if the value has been set.
func (o *TransactRequest) GetFromTokenOk() (*string, bool) {
	if o == nil || IsNil(o.FromToken) {
		return nil, false
	}
	return o.FromToken, true
}

// HasFromToken returns a boolean if a field has been set.
func (o *TransactRequest) HasFromToken() bool {
	if o != nil && !IsNil(o.FromToken) {
		return true
	}

	return false
}

// SetFromToken gets a reference to the given string and assigns it to the FromToken field.
func (o *TransactRequest) SetFromToken(v string) {
	o.FromToken = &v
}

// GetToAmount returns the ToAmount field value if set, zero value otherwise.
func (o *TransactRequest) GetToAmount() string {
	if o == nil || IsNil(o.ToAmount) {
		var ret string
		return ret
	}
	return *o.ToAmount
}

// GetToAmountOk returns a tuple with the ToAmount field value if set, nil otherwise
// and a boolean to check if the value has been set.
func (o *TransactRequest) GetToAmountOk() (*string, bool) {
	if o == nil || IsNil(o.ToAmount) {
		return nil, false
	}
	return o.ToAmount, true
}

// HasToAmount returns a boolean if a field has been set.
func (o *TransactRequest) HasToAmount() bool {
	if o != nil && !IsNil(o.ToAmount) {
		return true
	}

	return false
}

// SetToAmount gets a reference to the given string and assigns it to the ToAmount field.
func (o *TransactRequest) SetToAmount(v string) {
	o.ToAmount = &v
}

// GetToToken returns the ToToken field value if set, zero value otherwise.
func (o *TransactRequest) GetToToken() string {
	if o == nil || IsNil(o.ToToken) {
		var ret string
		return ret
	}
	return *o.ToToken
}

// GetToTokenOk returns a tuple with the ToToken field value if set, nil otherwise
// and a boolean to check if the value has been set.
func (o *TransactRequest) GetToTokenOk() (*string, bool) {
	if o == nil || IsNil(o.ToToken) {
		return nil, false
	}
	return o.ToToken, true
}

// HasToToken returns a boolean if a field has been set.
func (o *TransactRequest) HasToToken() bool {
	if o != nil && !IsNil(o.ToToken) {
		return true
	}

	return false
}

// SetToToken gets a reference to the given string and assigns it to the ToToken field.
func (o *TransactRequest) SetToToken(v string) {
	o.ToToken = &v
}

func (o TransactRequest) MarshalJSON() ([]byte, error) {
	toSerialize,err := o.ToMap()
	if err != nil {
		return []byte{}, err
	}
	return json.Marshal(toSerialize)
}

func (o TransactRequest) ToMap() (map[string]interface{}, error) {
	toSerialize := map[string]interface{}{}
	toSerialize["contextID"] = o.ContextID
	toSerialize["mode"] = o.Mode
	if !IsNil(o.Payload) {
		toSerialize["payload"] = o.Payload
	}
	if !IsNil(o.FromDLTNetworkID) {
		toSerialize["fromDLTNetworkID"] = o.FromDLTNetworkID
	}
	if !IsNil(o.ToDLTNetworkID) {
		toSerialize["toDLTNetworkID"] = o.ToDLTNetworkID
	}
	if !IsNil(o.FromAmount) {
		toSerialize["fromAmount"] = o.FromAmount
	}
	if !IsNil(o.FromToken) {
		toSerialize["fromToken"] = o.FromToken
	}
	if !IsNil(o.ToAmount) {
		toSerialize["toAmount"] = o.ToAmount
	}
	if !IsNil(o.ToToken) {
		toSerialize["toToken"] = o.ToToken
	}
	return toSerialize, nil
}

type NullableTransactRequest struct {
	value *TransactRequest
	isSet bool
}

func (v NullableTransactRequest) Get() *TransactRequest {
	return v.value
}

func (v *NullableTransactRequest) Set(val *TransactRequest) {
	v.value = val
	v.isSet = true
}

func (v NullableTransactRequest) IsSet() bool {
	return v.isSet
}

func (v *NullableTransactRequest) Unset() {
	v.value = nil
	v.isSet = false
}

func NewNullableTransactRequest(val *TransactRequest) *NullableTransactRequest {
	return &NullableTransactRequest{value: val, isSet: true}
}

func (v NullableTransactRequest) MarshalJSON() ([]byte, error) {
	return json.Marshal(v.value)
}

func (v *NullableTransactRequest) UnmarshalJSON(src []byte) error {
	v.isSet = true
	return json.Unmarshal(src, &v.value)
}


