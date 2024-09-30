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

// checks if the CommitPreparationV1Request type satisfies the MappedNullable interface at compile time
var _ MappedNullable = &CommitPreparationV1Request{}

// CommitPreparationV1Request struct for CommitPreparationV1Request
type CommitPreparationV1Request struct {
	SessionID string `json:"sessionID"`
	MessageType string `json:"messageType"`
	ClientIdentityPubkey string `json:"clientIdentityPubkey"`
	ServerIdentityPubkey string `json:"serverIdentityPubkey"`
	HashLockEvidenceAck string `json:"hashLockEvidenceAck"`
	ClientTransferNumber *int32 `json:"clientTransferNumber,omitempty"`
	Signature string `json:"signature"`
	SequenceNumber float32 `json:"sequenceNumber"`
}

// NewCommitPreparationV1Request instantiates a new CommitPreparationV1Request object
// This constructor will assign default values to properties that have it defined,
// and makes sure properties required by API are set, but the set of arguments
// will change when the set of required properties is changed
func NewCommitPreparationV1Request(sessionID string, messageType string, clientIdentityPubkey string, serverIdentityPubkey string, hashLockEvidenceAck string, signature string, sequenceNumber float32) *CommitPreparationV1Request {
	this := CommitPreparationV1Request{}
	this.SessionID = sessionID
	this.MessageType = messageType
	this.ClientIdentityPubkey = clientIdentityPubkey
	this.ServerIdentityPubkey = serverIdentityPubkey
	this.HashLockEvidenceAck = hashLockEvidenceAck
	this.Signature = signature
	this.SequenceNumber = sequenceNumber
	return &this
}

// NewCommitPreparationV1RequestWithDefaults instantiates a new CommitPreparationV1Request object
// This constructor will only assign default values to properties that have it defined,
// but it doesn't guarantee that properties required by API are set
func NewCommitPreparationV1RequestWithDefaults() *CommitPreparationV1Request {
	this := CommitPreparationV1Request{}
	return &this
}

// GetSessionID returns the SessionID field value
func (o *CommitPreparationV1Request) GetSessionID() string {
	if o == nil {
		var ret string
		return ret
	}

	return o.SessionID
}

// GetSessionIDOk returns a tuple with the SessionID field value
// and a boolean to check if the value has been set.
func (o *CommitPreparationV1Request) GetSessionIDOk() (*string, bool) {
	if o == nil {
		return nil, false
	}
	return &o.SessionID, true
}

// SetSessionID sets field value
func (o *CommitPreparationV1Request) SetSessionID(v string) {
	o.SessionID = v
}

// GetMessageType returns the MessageType field value
func (o *CommitPreparationV1Request) GetMessageType() string {
	if o == nil {
		var ret string
		return ret
	}

	return o.MessageType
}

// GetMessageTypeOk returns a tuple with the MessageType field value
// and a boolean to check if the value has been set.
func (o *CommitPreparationV1Request) GetMessageTypeOk() (*string, bool) {
	if o == nil {
		return nil, false
	}
	return &o.MessageType, true
}

// SetMessageType sets field value
func (o *CommitPreparationV1Request) SetMessageType(v string) {
	o.MessageType = v
}

// GetClientIdentityPubkey returns the ClientIdentityPubkey field value
func (o *CommitPreparationV1Request) GetClientIdentityPubkey() string {
	if o == nil {
		var ret string
		return ret
	}

	return o.ClientIdentityPubkey
}

// GetClientIdentityPubkeyOk returns a tuple with the ClientIdentityPubkey field value
// and a boolean to check if the value has been set.
func (o *CommitPreparationV1Request) GetClientIdentityPubkeyOk() (*string, bool) {
	if o == nil {
		return nil, false
	}
	return &o.ClientIdentityPubkey, true
}

// SetClientIdentityPubkey sets field value
func (o *CommitPreparationV1Request) SetClientIdentityPubkey(v string) {
	o.ClientIdentityPubkey = v
}

// GetServerIdentityPubkey returns the ServerIdentityPubkey field value
func (o *CommitPreparationV1Request) GetServerIdentityPubkey() string {
	if o == nil {
		var ret string
		return ret
	}

	return o.ServerIdentityPubkey
}

// GetServerIdentityPubkeyOk returns a tuple with the ServerIdentityPubkey field value
// and a boolean to check if the value has been set.
func (o *CommitPreparationV1Request) GetServerIdentityPubkeyOk() (*string, bool) {
	if o == nil {
		return nil, false
	}
	return &o.ServerIdentityPubkey, true
}

// SetServerIdentityPubkey sets field value
func (o *CommitPreparationV1Request) SetServerIdentityPubkey(v string) {
	o.ServerIdentityPubkey = v
}

// GetHashLockEvidenceAck returns the HashLockEvidenceAck field value
func (o *CommitPreparationV1Request) GetHashLockEvidenceAck() string {
	if o == nil {
		var ret string
		return ret
	}

	return o.HashLockEvidenceAck
}

// GetHashLockEvidenceAckOk returns a tuple with the HashLockEvidenceAck field value
// and a boolean to check if the value has been set.
func (o *CommitPreparationV1Request) GetHashLockEvidenceAckOk() (*string, bool) {
	if o == nil {
		return nil, false
	}
	return &o.HashLockEvidenceAck, true
}

// SetHashLockEvidenceAck sets field value
func (o *CommitPreparationV1Request) SetHashLockEvidenceAck(v string) {
	o.HashLockEvidenceAck = v
}

// GetClientTransferNumber returns the ClientTransferNumber field value if set, zero value otherwise.
func (o *CommitPreparationV1Request) GetClientTransferNumber() int32 {
	if o == nil || IsNil(o.ClientTransferNumber) {
		var ret int32
		return ret
	}
	return *o.ClientTransferNumber
}

// GetClientTransferNumberOk returns a tuple with the ClientTransferNumber field value if set, nil otherwise
// and a boolean to check if the value has been set.
func (o *CommitPreparationV1Request) GetClientTransferNumberOk() (*int32, bool) {
	if o == nil || IsNil(o.ClientTransferNumber) {
		return nil, false
	}
	return o.ClientTransferNumber, true
}

// HasClientTransferNumber returns a boolean if a field has been set.
func (o *CommitPreparationV1Request) HasClientTransferNumber() bool {
	if o != nil && !IsNil(o.ClientTransferNumber) {
		return true
	}

	return false
}

// SetClientTransferNumber gets a reference to the given int32 and assigns it to the ClientTransferNumber field.
func (o *CommitPreparationV1Request) SetClientTransferNumber(v int32) {
	o.ClientTransferNumber = &v
}

// GetSignature returns the Signature field value
func (o *CommitPreparationV1Request) GetSignature() string {
	if o == nil {
		var ret string
		return ret
	}

	return o.Signature
}

// GetSignatureOk returns a tuple with the Signature field value
// and a boolean to check if the value has been set.
func (o *CommitPreparationV1Request) GetSignatureOk() (*string, bool) {
	if o == nil {
		return nil, false
	}
	return &o.Signature, true
}

// SetSignature sets field value
func (o *CommitPreparationV1Request) SetSignature(v string) {
	o.Signature = v
}

// GetSequenceNumber returns the SequenceNumber field value
func (o *CommitPreparationV1Request) GetSequenceNumber() float32 {
	if o == nil {
		var ret float32
		return ret
	}

	return o.SequenceNumber
}

// GetSequenceNumberOk returns a tuple with the SequenceNumber field value
// and a boolean to check if the value has been set.
func (o *CommitPreparationV1Request) GetSequenceNumberOk() (*float32, bool) {
	if o == nil {
		return nil, false
	}
	return &o.SequenceNumber, true
}

// SetSequenceNumber sets field value
func (o *CommitPreparationV1Request) SetSequenceNumber(v float32) {
	o.SequenceNumber = v
}

func (o CommitPreparationV1Request) MarshalJSON() ([]byte, error) {
	toSerialize,err := o.ToMap()
	if err != nil {
		return []byte{}, err
	}
	return json.Marshal(toSerialize)
}

func (o CommitPreparationV1Request) ToMap() (map[string]interface{}, error) {
	toSerialize := map[string]interface{}{}
	toSerialize["sessionID"] = o.SessionID
	toSerialize["messageType"] = o.MessageType
	toSerialize["clientIdentityPubkey"] = o.ClientIdentityPubkey
	toSerialize["serverIdentityPubkey"] = o.ServerIdentityPubkey
	toSerialize["hashLockEvidenceAck"] = o.HashLockEvidenceAck
	if !IsNil(o.ClientTransferNumber) {
		toSerialize["clientTransferNumber"] = o.ClientTransferNumber
	}
	toSerialize["signature"] = o.Signature
	toSerialize["sequenceNumber"] = o.SequenceNumber
	return toSerialize, nil
}

type NullableCommitPreparationV1Request struct {
	value *CommitPreparationV1Request
	isSet bool
}

func (v NullableCommitPreparationV1Request) Get() *CommitPreparationV1Request {
	return v.value
}

func (v *NullableCommitPreparationV1Request) Set(val *CommitPreparationV1Request) {
	v.value = val
	v.isSet = true
}

func (v NullableCommitPreparationV1Request) IsSet() bool {
	return v.isSet
}

func (v *NullableCommitPreparationV1Request) Unset() {
	v.value = nil
	v.isSet = false
}

func NewNullableCommitPreparationV1Request(val *CommitPreparationV1Request) *NullableCommitPreparationV1Request {
	return &NullableCommitPreparationV1Request{value: val, isSet: true}
}

func (v NullableCommitPreparationV1Request) MarshalJSON() ([]byte, error) {
	return json.Marshal(v.value)
}

func (v *NullableCommitPreparationV1Request) UnmarshalJSON(src []byte) error {
	v.isSet = true
	return json.Unmarshal(src, &v.value)
}


