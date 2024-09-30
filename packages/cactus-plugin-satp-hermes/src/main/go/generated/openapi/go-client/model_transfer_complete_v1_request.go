/*
Hyperledger Cactus Plugin - Odap Hermes

Implementation for Odap and Hermes

API version: 2.0.0-rc.5
*/

// Code generated by OpenAPI Generator (https://openapi-generator.tech); DO NOT EDIT.

package cactus-plugin-satp-hermes

import (
	"encoding/json"
)

// checks if the TransferCompleteV1Request type satisfies the MappedNullable interface at compile time
var _ MappedNullable = &TransferCompleteV1Request{}

// TransferCompleteV1Request struct for TransferCompleteV1Request
type TransferCompleteV1Request struct {
	SessionID string `json:"sessionID"`
	MessageType string `json:"messageType"`
	ClientIdentityPubkey string `json:"clientIdentityPubkey"`
	ServerIdentityPubkey string `json:"serverIdentityPubkey"`
	HashCommitFinalAck string `json:"hashCommitFinalAck"`
	ClientTransferNumber NullableInt32 `json:"clientTransferNumber,omitempty"`
	Signature string `json:"signature"`
	HashTransferCommence string `json:"hashTransferCommence"`
	SequenceNumber float32 `json:"sequenceNumber"`
}

// NewTransferCompleteV1Request instantiates a new TransferCompleteV1Request object
// This constructor will assign default values to properties that have it defined,
// and makes sure properties required by API are set, but the set of arguments
// will change when the set of required properties is changed
func NewTransferCompleteV1Request(sessionID string, messageType string, clientIdentityPubkey string, serverIdentityPubkey string, hashCommitFinalAck string, signature string, hashTransferCommence string, sequenceNumber float32) *TransferCompleteV1Request {
	this := TransferCompleteV1Request{}
	this.SessionID = sessionID
	this.MessageType = messageType
	this.ClientIdentityPubkey = clientIdentityPubkey
	this.ServerIdentityPubkey = serverIdentityPubkey
	this.HashCommitFinalAck = hashCommitFinalAck
	this.Signature = signature
	this.HashTransferCommence = hashTransferCommence
	this.SequenceNumber = sequenceNumber
	return &this
}

// NewTransferCompleteV1RequestWithDefaults instantiates a new TransferCompleteV1Request object
// This constructor will only assign default values to properties that have it defined,
// but it doesn't guarantee that properties required by API are set
func NewTransferCompleteV1RequestWithDefaults() *TransferCompleteV1Request {
	this := TransferCompleteV1Request{}
	return &this
}

// GetSessionID returns the SessionID field value
func (o *TransferCompleteV1Request) GetSessionID() string {
	if o == nil {
		var ret string
		return ret
	}

	return o.SessionID
}

// GetSessionIDOk returns a tuple with the SessionID field value
// and a boolean to check if the value has been set.
func (o *TransferCompleteV1Request) GetSessionIDOk() (*string, bool) {
	if o == nil {
		return nil, false
	}
	return &o.SessionID, true
}

// SetSessionID sets field value
func (o *TransferCompleteV1Request) SetSessionID(v string) {
	o.SessionID = v
}

// GetMessageType returns the MessageType field value
func (o *TransferCompleteV1Request) GetMessageType() string {
	if o == nil {
		var ret string
		return ret
	}

	return o.MessageType
}

// GetMessageTypeOk returns a tuple with the MessageType field value
// and a boolean to check if the value has been set.
func (o *TransferCompleteV1Request) GetMessageTypeOk() (*string, bool) {
	if o == nil {
		return nil, false
	}
	return &o.MessageType, true
}

// SetMessageType sets field value
func (o *TransferCompleteV1Request) SetMessageType(v string) {
	o.MessageType = v
}

// GetClientIdentityPubkey returns the ClientIdentityPubkey field value
func (o *TransferCompleteV1Request) GetClientIdentityPubkey() string {
	if o == nil {
		var ret string
		return ret
	}

	return o.ClientIdentityPubkey
}

// GetClientIdentityPubkeyOk returns a tuple with the ClientIdentityPubkey field value
// and a boolean to check if the value has been set.
func (o *TransferCompleteV1Request) GetClientIdentityPubkeyOk() (*string, bool) {
	if o == nil {
		return nil, false
	}
	return &o.ClientIdentityPubkey, true
}

// SetClientIdentityPubkey sets field value
func (o *TransferCompleteV1Request) SetClientIdentityPubkey(v string) {
	o.ClientIdentityPubkey = v
}

// GetServerIdentityPubkey returns the ServerIdentityPubkey field value
func (o *TransferCompleteV1Request) GetServerIdentityPubkey() string {
	if o == nil {
		var ret string
		return ret
	}

	return o.ServerIdentityPubkey
}

// GetServerIdentityPubkeyOk returns a tuple with the ServerIdentityPubkey field value
// and a boolean to check if the value has been set.
func (o *TransferCompleteV1Request) GetServerIdentityPubkeyOk() (*string, bool) {
	if o == nil {
		return nil, false
	}
	return &o.ServerIdentityPubkey, true
}

// SetServerIdentityPubkey sets field value
func (o *TransferCompleteV1Request) SetServerIdentityPubkey(v string) {
	o.ServerIdentityPubkey = v
}

// GetHashCommitFinalAck returns the HashCommitFinalAck field value
func (o *TransferCompleteV1Request) GetHashCommitFinalAck() string {
	if o == nil {
		var ret string
		return ret
	}

	return o.HashCommitFinalAck
}

// GetHashCommitFinalAckOk returns a tuple with the HashCommitFinalAck field value
// and a boolean to check if the value has been set.
func (o *TransferCompleteV1Request) GetHashCommitFinalAckOk() (*string, bool) {
	if o == nil {
		return nil, false
	}
	return &o.HashCommitFinalAck, true
}

// SetHashCommitFinalAck sets field value
func (o *TransferCompleteV1Request) SetHashCommitFinalAck(v string) {
	o.HashCommitFinalAck = v
}

// GetClientTransferNumber returns the ClientTransferNumber field value if set, zero value otherwise (both if not set or set to explicit null).
func (o *TransferCompleteV1Request) GetClientTransferNumber() int32 {
	if o == nil || IsNil(o.ClientTransferNumber.Get()) {
		var ret int32
		return ret
	}
	return *o.ClientTransferNumber.Get()
}

// GetClientTransferNumberOk returns a tuple with the ClientTransferNumber field value if set, nil otherwise
// and a boolean to check if the value has been set.
// NOTE: If the value is an explicit nil, `nil, true` will be returned
func (o *TransferCompleteV1Request) GetClientTransferNumberOk() (*int32, bool) {
	if o == nil {
		return nil, false
	}
	return o.ClientTransferNumber.Get(), o.ClientTransferNumber.IsSet()
}

// HasClientTransferNumber returns a boolean if a field has been set.
func (o *TransferCompleteV1Request) HasClientTransferNumber() bool {
	if o != nil && o.ClientTransferNumber.IsSet() {
		return true
	}

	return false
}

// SetClientTransferNumber gets a reference to the given NullableInt32 and assigns it to the ClientTransferNumber field.
func (o *TransferCompleteV1Request) SetClientTransferNumber(v int32) {
	o.ClientTransferNumber.Set(&v)
}
// SetClientTransferNumberNil sets the value for ClientTransferNumber to be an explicit nil
func (o *TransferCompleteV1Request) SetClientTransferNumberNil() {
	o.ClientTransferNumber.Set(nil)
}

// UnsetClientTransferNumber ensures that no value is present for ClientTransferNumber, not even an explicit nil
func (o *TransferCompleteV1Request) UnsetClientTransferNumber() {
	o.ClientTransferNumber.Unset()
}

// GetSignature returns the Signature field value
func (o *TransferCompleteV1Request) GetSignature() string {
	if o == nil {
		var ret string
		return ret
	}

	return o.Signature
}

// GetSignatureOk returns a tuple with the Signature field value
// and a boolean to check if the value has been set.
func (o *TransferCompleteV1Request) GetSignatureOk() (*string, bool) {
	if o == nil {
		return nil, false
	}
	return &o.Signature, true
}

// SetSignature sets field value
func (o *TransferCompleteV1Request) SetSignature(v string) {
	o.Signature = v
}

// GetHashTransferCommence returns the HashTransferCommence field value
func (o *TransferCompleteV1Request) GetHashTransferCommence() string {
	if o == nil {
		var ret string
		return ret
	}

	return o.HashTransferCommence
}

// GetHashTransferCommenceOk returns a tuple with the HashTransferCommence field value
// and a boolean to check if the value has been set.
func (o *TransferCompleteV1Request) GetHashTransferCommenceOk() (*string, bool) {
	if o == nil {
		return nil, false
	}
	return &o.HashTransferCommence, true
}

// SetHashTransferCommence sets field value
func (o *TransferCompleteV1Request) SetHashTransferCommence(v string) {
	o.HashTransferCommence = v
}

// GetSequenceNumber returns the SequenceNumber field value
func (o *TransferCompleteV1Request) GetSequenceNumber() float32 {
	if o == nil {
		var ret float32
		return ret
	}

	return o.SequenceNumber
}

// GetSequenceNumberOk returns a tuple with the SequenceNumber field value
// and a boolean to check if the value has been set.
func (o *TransferCompleteV1Request) GetSequenceNumberOk() (*float32, bool) {
	if o == nil {
		return nil, false
	}
	return &o.SequenceNumber, true
}

// SetSequenceNumber sets field value
func (o *TransferCompleteV1Request) SetSequenceNumber(v float32) {
	o.SequenceNumber = v
}

func (o TransferCompleteV1Request) MarshalJSON() ([]byte, error) {
	toSerialize,err := o.ToMap()
	if err != nil {
		return []byte{}, err
	}
	return json.Marshal(toSerialize)
}

func (o TransferCompleteV1Request) ToMap() (map[string]interface{}, error) {
	toSerialize := map[string]interface{}{}
	toSerialize["sessionID"] = o.SessionID
	toSerialize["messageType"] = o.MessageType
	toSerialize["clientIdentityPubkey"] = o.ClientIdentityPubkey
	toSerialize["serverIdentityPubkey"] = o.ServerIdentityPubkey
	toSerialize["hashCommitFinalAck"] = o.HashCommitFinalAck
	if o.ClientTransferNumber.IsSet() {
		toSerialize["clientTransferNumber"] = o.ClientTransferNumber.Get()
	}
	toSerialize["signature"] = o.Signature
	toSerialize["hashTransferCommence"] = o.HashTransferCommence
	toSerialize["sequenceNumber"] = o.SequenceNumber
	return toSerialize, nil
}

type NullableTransferCompleteV1Request struct {
	value *TransferCompleteV1Request
	isSet bool
}

func (v NullableTransferCompleteV1Request) Get() *TransferCompleteV1Request {
	return v.value
}

func (v *NullableTransferCompleteV1Request) Set(val *TransferCompleteV1Request) {
	v.value = val
	v.isSet = true
}

func (v NullableTransferCompleteV1Request) IsSet() bool {
	return v.isSet
}

func (v *NullableTransferCompleteV1Request) Unset() {
	v.value = nil
	v.isSet = false
}

func NewNullableTransferCompleteV1Request(val *TransferCompleteV1Request) *NullableTransferCompleteV1Request {
	return &NullableTransferCompleteV1Request{value: val, isSet: true}
}

func (v NullableTransferCompleteV1Request) MarshalJSON() ([]byte, error) {
	return json.Marshal(v.value)
}

func (v *NullableTransferCompleteV1Request) UnmarshalJSON(src []byte) error {
	v.isSet = true
	return json.Unmarshal(src, &v.value)
}


