import { LightningElement, api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
import { updateRecord,createRecord } from 'lightning/uiRecordApi';
import PROPOSAL_OBJECT from '@salesforce/schema/Proposal__c';
import ID_FIELD from '@salesforce/schema/Proposal__c.Id';
import NAME_FIELD from '@salesforce/schema/Proposal__c.Name';
import UPVOTES_FIELD from '@salesforce/schema/Proposal__c.Upvotes__c';
import STAGE_FIELD from '@salesforce/schema/Proposal__c.Stage__c';
import SYNOPSIS_FIELD from '@salesforce/schema/Proposal__c.Synopsis__c';
import TickerSymbol from '@salesforce/schema/Account.TickerSymbol';



export default class Proposal extends LightningElement {
   

    @api
    prop = this.initRecord();

    editMode = true;



    initRecord(){
        const fields = {};
        fields[ID_FIELD.fieldApiName]='';
        fields[NAME_FIELD.fieldApiName]='';
        fields[UPVOTES_FIELD.fieldApiName]=0;
        fields[STAGE_FIELD.fieldApiName]='New';
        fields[SYNOPSIS_FIELD.fieldApiName]='';

        return {fields};
    }
    connectedCallback(){
        console.log('in proposal');
    }
    
    upVote(){
        var votes = parseInt(this.template.querySelector("[data-id='upvotes']").label) + 1
        console.log('click!');
        
        this.template.querySelector("[data-id='upvotes']").label = votes
        console.log(votes);
        this.render();
        
    }

    closeDetail(event){

        this.dispatchEvent(new CustomEvent("closedetail",{detail:{action:'close',record:[]}}));
    }

    saveDetail(event){
        const fields = {};
        fields[ID_FIELD.fieldApiName]=this.prop.Id;
        fields[NAME_FIELD.fieldApiName]=this.template.querySelector("[data-id='name']").value;
        fields[UPVOTES_FIELD.fieldApiName]=this.template.querySelector("[data-id='upvotes']").label;
        fields[STAGE_FIELD.fieldApiName]=this.prop.Stage__c;
        fields[SYNOPSIS_FIELD.fieldApiName]=this.template.querySelector("[data-id='synopsis']").value;

        
        
        if (this.prop.Id != null) {
            const recordInput={fields};
            updateRecord(recordInput)
                .then(() => {
                    this.dispatchEvent(
                        new ShowToastEvent({title: 'Success',message: 'Proposal updated',variant: 'success'
                        })
                    );
                    const closeDetailEvent = new CustomEvent("closedetail",{detail:{action:'update',record:fields}});
                   
                    this.dispatchEvent(closeDetailEvent);
                    
                    
                })
                .catch(error => {
                    this.dispatchEvent(
                        new ShowToastEvent({title: 'Error updating Proposal',message: error.body.message,variant: 'error'
                        })
                    );
                });
        } else {
            const recordInput={apiName: PROPOSAL_OBJECT.objectApiName, fields};
            fields[UPVOTES_FIELD.fieldApiName]=0;
            fields[STAGE_FIELD.fieldApiName]='New';
            console.log(recordInput);
            createRecord(recordInput)
                .then(() => {
                    this.dispatchEvent(
                        new ShowToastEvent({title: 'Success',message: 'Proposal created!',variant: 'success'
                        })
                    );
                    const closeDetailEvent = new CustomEvent("closedetail",{detail:{action:'create',record:fields}});
                    
                    this.dispatchEvent(closeDetailEvent);
                    console.log('created');
                    
                })
                .catch(error => {
                    var errmsg = error.body.message;
                    console.log('create error' + errmsg);
                    
                    this.dispatchEvent(
                        new ShowToastEvent({title: 'Error creating Proposal', message: errmsg, variant: 'error'
                        })
                    );
                });
        }
        console.log('saving!');

    }



    handleSaveClick() {
        
        this.prop.Synopsis__c = this.template.querySelector("[data-id='synopsis']").value;
        
        const event = new ShowToastEvent({
            variant: 'success',
            title: 'Proposal Saved!',
            message: 'Proposal "' + this.prop.name + '" has been saved.',
        });
        this.dispatchEvent(event);
        
        
    }
}