import { api, wire, LightningElement } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import getProposalList from '@salesforce/apex/ProposalController.getProposalList';



export default class ProposalList extends LightningElement {

    @api
    recList;

    @wire(getProposalList)
    proposals({ error, data }) {
        if (data) {
            this.recList = data;
            this.error = undefined;
         //   console.log(JSON.stringify(data));
        } else if (error) {
            this.error = error;
            this.recList = undefined;
        //    console.log(JSON.stringify(error));
        }
    };
    

    connectedCallback(){
        

    }
}