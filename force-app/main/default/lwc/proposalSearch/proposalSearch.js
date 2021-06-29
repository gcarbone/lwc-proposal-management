import { LightningElement, wire } from 'lwc';
import getProposalList from '@salesforce/apex/ProposalController.getProposalList';
const actions = [
    { label: 'Show details', name: 'show_details' },
    { label: 'Delete', name: 'delete' },
];

const columns = [
    {
        type: 'action',
        typeAttributes: { rowActions: actions },
    },
    { label: 'Name', fieldName: 'Name' },
    { label: 'Stage', fieldName: 'Stage__c'},
    { label: 'Upvotes', fieldName: 'Upvotes__c', type: 'number' },
    { label: 'Owner', fieldName: 'OwnerName'},
    
    
];
export default class ProposalSearch extends LightningElement {
    
    data = [];
    columns = columns;
    record = {};

    @wire(getProposalList)
    proposals({ error, data }) {
        if (data) {
            this.data = data;
            this.error = undefined;
         console.log(JSON.stringify(data));
        } else if (error) {
            this.error = error;
            this.data = undefined;
        console.log(JSON.stringify(error));
        }
    };





    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        switch (actionName) {
            case 'delete':
                this.deleteRow(row);
                break;
            case 'show_details':
                this.showRowDetails(row);
                break;
            default:
        }
    }

    deleteRow(row) {
        const { id } = row;
        const index = this.findRowIndexById(id);
        if (index !== -1) {
            this.data = this.data
                .slice(0, index)
                .concat(this.data.slice(index + 1));
        }
    }

    findRowIndexById(id) {
        let ret = -1;
        this.data.some((row, index) => {
            if (row.id === id) {
                ret = index;
                return true;
            }
            return false;
        });
        return ret;
    }

    showRowDetails(row) {
        this.record = row;
    }
}