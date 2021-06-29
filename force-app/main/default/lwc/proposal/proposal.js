import { LightningElement, api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'

export default class Proposal extends LightningElement {
   

    @api
    prop = null;

    editMode = false;

    get editMode() {
        return this.editMode;
    }
    
    connectedCallback(){
        console.log(JSON.stringify(this.prop));
    }
    
    upVote(){
        console.log('click!');
        console.log(this.prop.Upvotes__c);
        this.prop.Upvotes__c = this.prop.Upvotes__c + 1;
        console.log(this.prop.Upvotes__c);
        this.render();
        
    }

    handleEditClick() {
        this.editMode = !this.editMode;
    }

    handleSaveClick() {
        this.editMode = !this.editMode;
        this.prop.synopsis = this.template.querySelector("[data-id='synopsis']").value;
        
        const event = new ShowToastEvent({
            variant: 'success',
            title: 'Proposal Saved!',
            message: 'Proposal "' + this.prop.name + '" has been saved.',
        });
        this.dispatchEvent(event);
        
        
    }
}