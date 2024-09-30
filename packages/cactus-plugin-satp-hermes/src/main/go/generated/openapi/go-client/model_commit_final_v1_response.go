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

// checks if the CommitFinalV1Response type satisfies the MappedNullable interface at compile time
var _ MappedNullable = &CommitFinalV1Response{}

// CommitFinalV1Response struct for CommitFinalV1Response
type CommitFinalV1Response struct {
	SessionID string `json:"sessionID"`
	MessageType string `json:"messageType"`
	ClientIdentityPubkey string `json:"clientIdentityPubkey"`
	ServerIdentityPubkey string `json:"serverIdentityPubkey"`
	CommitAcknowledgementClaim string `json:"commitAcknowledgementClaim"`
	CommitAcknowledgementClaimFormat map[string]interface{} `json:"commitAcknowledgementClaimFormat,omitempty"`
	HashCommitFinal string `json:"hashCommitFinal"`
	ServerTransferNumber *int32 `json:"serverTransferNumber,omitempty"`
	Signature string `json:"signature"`
	SequenceNumber float32 `json:"sequenceNumber"`
}

// NewCommitFinalV1Response instantiates a new CommitFinalV1Response object
// This constructor will assign default values to properties that have it defined,
// and makes sure properties required by API are set, but the set of arguments
// will change when the set of required properties is changed
func NewCommitFinalV1Response(sessionID string, messageType string, clientIdentityPubkey string, serverIdentityPubkey string, commitAcknowledgementClaim string, hashCommitFinal string, signature string, sequenceNumber float32) *CommitFinalV1Response {
	this := CommitFinalV1Response{}
	this.SessionID = sessionID
	this.MessageType = messageType
	this.ClientIdentityPubkey = clientIdentityPubkey
	this.ServerIdentityPubkey = serverIdentityPubkey
	this.CommitAcknowledgementClaim = commitAcknowledgementClaim
	this.HashCommitFinal = hashCommitFinal
	this.Signature = signature
	this.SequenceNumber = sequenceNumber
	return &this
}

// NewCommitFinalV1ResponseWithDefaults instantiates a new CommitFinalV1Response object
// This constructor will only assign default values to properties that have it defined,
// but it doesn't guarantee that properties required by API are set
func NewCommitFinalV1ResponseWithDefaults() *CommitFinalV1Response {
	this := CommitFinalV1Response{}
	return &this
}

// GetSessionID returns the SessionID field value
func (o *CommitFinalV1Response) GetSessionID() string {
	if o == nil {
		var ret string
		return ret
	}

	return o.SessionID
}

// GetSessionIDOk returns a tuple with the SessionID field value
// and a boolean to check if the value has been set.
func (o *CommitFinalV1Response) GetSessionIDOk() (*string, bool) {
	if o == nil {
		return nil, false
	}
	return &o.SessionID, true
}

// SetSessionID sets field value
func (o *CommitFinalV1Response) SetSessionID(v string) {
	o.SessionID = v
}

// GetMessageType returns the MessageType field value
func (o *CommitFinalV1Response) GetMessageType() string {
	if o == nil {
		var ret string
		return ret
	}

	return o.MessageType
}

// GetMessageTypeOk returns a tuple with the MessageType field value
// and a boolean to check if the value has been set.
func (o *CommitFinalV1Response) GetMessageTypeOk() (*string, bool) {
	if o == nil {
		return nil, false
	}
	return &o.MessageType, true
}

// SetMessageType sets field value
func (o *CommitFinalV1Response) SetMessageType(v string) {
	o.MessageType = v
}

// GetClientIdentityPubkey returns the ClientIdentityPubkey field value
func (o *CommitFinalV1Response) GetClientIdentityPubkey() string {
	if o == nil {
		var ret string
		return ret
	}

	return o.ClientIdentityPubkey
}

// GetClientIdentityPubkeyOk returns a tuple with the ClientIdentityPubkey field value
// and a boolean to check if the value has been set.
func (o *CommitFinalV1Response) GetClientIdentityPubkeyOk() (*string, bool) {
	if o == nil {
		return nil, false
	}
	return &o.ClientIdentityPubkey, true
}

// SetClientIdentityPubkey sets field value
func (o *CommitFinalV1Response) SetClientIdentityPubkey(v string) {
	o.ClientIdentityPubkey = v
}

// GetServerIdentityPubkey returns the ServerIdentityPubkey field value
func (o *CommitFinalV1Response) GetServerIdentityPubkey() string {
	if o == nil {
		var ret string
		return ret
	}

	return o.ServerIdentityPubkey
}

// GetServerIdentityPubkeyOk returns a tuple with the ServerIdentityPubkey field value
// and a boolean to check if the value has been set.
func (o *CommitFinalV1Response) GetServerIdentityPubkeyOk() (*string, bool) {
	if o == nil {
		return nil, false
	}
	return &o.ServerIdentityPubkey, true
}

// SetServerIdentityPubkey sets field value
func (o *CommitFinalV1Response) SetServerIdentityPubkey(v string) {
	o.ServerIdentityPubkey = v
}

// GetCommitAcknowledgementClaim returns the CommitAcknowledgementClaim field value
func (o *CommitFinalV1Response) GetCommitAcknowledgementClaim() string {
	if o == nil {
		var ret string
		return ret
	}

	return o.CommitAcknowledgementClaim
}

// GetCommitAcknowledgementClaimOk returns a tuple with the CommitAcknowledgementClaim field value
// and a boolean to check if the value has been set.
func (o *CommitFinalV1Response) GetCommitAcknowledgementClaimOk() (*string, bool) {
	if o == nil {
		return nil, false
	}
	return &o.CommitAcknowledgementClaim, true
}

// SetCommitAcknowledgementClaim sets field value
func (o *CommitFinalV1Response) SetCommitAcknowledgementClaim(v string) {
	o.CommitAcknowledgementClaim = v
}

// GetCommitAcknowledgementClaimFormat returns the CommitAcknowledgementClaimFormat field value if set, zero value otherwise.
func (o *CommitFinalV1Response) GetCommitAcknowledgementClaimFormat() map[string]interface{} {
	if o == nil || IsNil(o.CommitAcknowledgementClaimFormat) {
		var ret map[string]interface{}
		return ret
	}
	return o.CommitAcknowledgementClaimFormat
}

// GetCommitAcknowledgementClaimFormatOk returns a tuple with the CommitAcknowledgementClaimFormat field value if set, nil otherwise
// and a boolean to check if the value has been set.
func (o *CommitFinalV1Response) GetCommitAcknowledgementClaimFormatOk() (map[string]interface{}, bool) {
	if o == nil || IsNil(o.CommitAcknowledgementClaimFormat) {
		return map[string]interface{}{}, false
	}
	return o.CommitAcknowledgementClaimFormat, true
}

// HasCommitAcknowledgementClaimFormat returns a boolean if a field has been set.
func (o *CommitFinalV1Response) HasCommitAcknowledgementClaimFormat() bool {
	if o != nil && !IsNil(o.CommitAcknowledgementClaimFormat) {
		return true
	}

	return false
}

// SetCommitAcknowledgementClaimFormat gets a reference to the given map[string]interface{} and assigns it to the CommitAcknowledgementClaimFormat field.
func (o *CommitFinalV1Response) SetCommitAcknowledgementClaimFormat(v map[string]interface{}) {
	o.CommitAcknowledgementClaimFormat = v
}

// GetHashCommitFinal returns the HashCommitFinal field value
func (o *CommitFinalV1Response) GetHashCommitFinal() string {
	if o == nil {
		var ret string
		return ret
	}

	return o.HashCommitFinal
}

// GetHashCommitFinalOk returns a tuple with the HashCommitFinal field value
// and a boolean to check if the value has been set.
func (o *CommitFinalV1Response) GetHashCommitFinalOk() (*string, bool) {
	if o == nil {
		return nil, false
	}
	return &o.HashCommitFinal, true
}

// SetHashCommitFinal sets field value
func (o *CommitFinalV1Response) SetHashCommitFinal(v string) {
	o.HashCommitFinal = v
}

// GetServerTransferNumber returns the ServerTransferNumber field value if set, zero value otherwise.
func (o *CommitFinalV1Response) GetServerTransferNumber() int32 {
	if o == nil || IsNil(o.ServerTransferNumber) {
		var ret int32
		return ret
	}
	return *o.ServerTransferNumber
}

// GetServerTransferNumberOk returns a tuple with the ServerTransferNumber field value if set, nil otherwise
// and a boolean to check if the value has been set.
func (o *CommitFinalV1Response) GetServerTransferNumberOk() (*int32, bool) {
	if o == nil || IsNil(o.ServerTransferNumber) {
		return nil, false
	}
	return o.ServerTransferNumber, true
}

// HasServerTransferNumber returns a boolean if a field has been set.
func (o *CommitFinalV1Response) HasServerTransferNumber() bool {
	if o != nil && !IsNil(o.ServerTransferNumber) {
		return true
	}

	return false
}

// SetServerTransferNumber gets a reference to the given int32 and assigns it to the ServerTransferNumber field.
func (o *CommitFinalV1Response) SetServerTransferNumber(v int32) {
	o.ServerTransferNumber = &v
}

// GetSignature returns the Signature field value
func (o *CommitFinalV1Response) GetSignature() string {
	if o == nil {
		var ret string
		return ret
	}

	return o.Signature
}

// GetSignatureOk returns a tuple with the Signature field value
// and a boolean to check if the value has been set.
func (o *CommitFinalV1Response) GetSignatureOk() (*string, bool) {
	if o == nil {
		return nil, false
	}
	return &o.Signature, true
}

// SetSignature sets field value
func (o *CommitFinalV1Response) SetSignature(v string) {
	o.Signature = v
}

// GetSequenceNumber returns the SequenceNumber field value
func (o *CommitFinalV1Response) GetSequenceNumber() float32 {
	if o == nil {
		var ret float32
		return ret
	}

	return o.SequenceNumber
}

// GetSequenceNumberOk returns a tuple with the SequenceNumber field value
// and a boolean to check if the value has been set.
func (o *CommitFinalV1Response) GetSequenceNumberOk() (*float32, bool) {
	if o == nil {
		return nil, false
	}
	return &o.SequenceNumber, true
}

// SetSequenceNumber sets field value
func (o *CommitFinalV1Response) SetSequenceNumber(v float32) {
	o.SequenceNumber = v
}

func (o CommitFinalV1Response) MarshalJSON() ([]byte, error) {
	toSerialize,err := o.ToMap()
	if err != nil {
		return []byte{}, err
	}
	return json.Marshal(toSerialize)
}

func (o CommitFinalV1Response) ToMap() (map[string]interface{}, error) {
	toSerialize := map[string]interface{}{}
	toSerialize["sessionID"] = o.SessionID
	toSerialize["messageType"] = o.MessageType
	toSerialize["clientIdentityPubkey"] = o.ClientIdentityPubkey
	toSerialize["serverIdentityPubkey"] = o.ServerIdentityPubkey
	toSerialize["commitAcknowledgementClaim"] = o.CommitAcknowledgementClaim
	if !IsNil(o.CommitAcknowledgementClaimFormat) {
		toSerialize["commitAcknowledgementClaimFormat"] = o.CommitAcknowledgementClaimFormat
	}
	toSerialize["hashCommitFinal"] = o.HashCommitFinal
	if !IsNil(o.ServerTransferNumber) {
		toSerialize["serverTransferNumber"] = o.ServerTransferNumber
	}
	toSerialize["signature"] = o.Signature
	toSerialize["sequenceNumber"] = o.SequenceNumber
	return toSerialize, nil
}

type NullableCommitFinalV1Response struct {
	value *CommitFinalV1Response
	isSet bool
}

func (v NullableCommitFinalV1Response) Get() *CommitFinalV1Response {
	return v.value
}

func (v *NullableCommitFinalV1Response) Set(val *CommitFinalV1Response) {
	v.value = val
	v.isSet = true
}

func (v NullableCommitFinalV1Response) IsSet() bool {
	return v.isSet
}

func (v *NullableCommitFinalV1Response) Unset() {
	v.value = nil
	v.isSet = false
}

func NewNullableCommitFinalV1Response(val *CommitFinalV1Response) *NullableCommitFinalV1Response {
	return &NullableCommitFinalV1Response{value: val, isSet: true}
}

func (v NullableCommitFinalV1Response) MarshalJSON() ([]byte, error) {
	return json.Marshal(v.value)
}

func (v *NullableCommitFinalV1Response) UnmarshalJSON(src []byte) error {
	v.isSet = true
	return json.Unmarshal(src, &v.value)
}


