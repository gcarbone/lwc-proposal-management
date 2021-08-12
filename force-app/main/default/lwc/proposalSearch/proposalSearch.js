import { LightningElement, wire, api, track } from 'lwc';
import { deleteRecord } from 'lightning/uiRecordApi';
import getProposalList from '@salesforce/apex/ProposalController.getProposalList';
import { refreshApex } from '@salesforce/apex';


const actions = [
    { label: 'Show / Edit details', name: 'show_details' },
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
    stageValue = '';
    namesearch='';
    showRecordDetail = false;
    @api
    columndata = [];
    columns = columns;
    record = {};
    _proposalList = [];

    @wire(getProposalList,{name:'$namesearch', stage:'$stageValue'})
    proposals(result) {
        this._proposalList = result;
        if (result.data) {
            this.columndata = result.data.map(x =>{
                return {
                 "Id": x.Id,
                 "Name": x.Name,
                 "Upvotes__c": x.Upvotes__c,
                 "Stage__c": x.Stage__c,
                 "Synopsis__c": x.Synopsis__c,
                 "OwnerName": x.Owner.Name
                };
               });
            this.error = undefined;
            console.log(JSON.stringify(result.data));
        } else if (result.error) {
            this.error = result.error;
            this.columndata = undefined;
            console.log(JSON.stringify(error));
            this._proposalList = [];
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
        const { Id } = row;
        const index = this.findRowIndexById(Id);
        console.log('deleting ' + Id);
        deleteRecord(Id)
            .then(() => {
                refreshApex(this.proposalList);
              })
              .catch(error => {
              })
        if (index !== -1) {
            this.columndata = this.columndata
                .slice(0, index)
                .concat(this.columndata.slice(index + 1));
        }
    }

    findRowIndexById(id) {
        let ret = -1;
        
        this.columndata.some((row, index) => {
            if (row.Id === id) {
                ret = index;
                return true;
            }
            return false;
        });
        return ret;
    }

    showRowDetails(row) {
        this.record = row;
        this.showRecordDetail = true;
        console.log('show record detail' + JSON.stringify(row));
    }

    get stageOptions() {
        return [
            { label: 'All Stages', value: '' },
            { label: 'New', value: 'New' },
            { label: 'In Voting Process', value: 'In Voting Process' },
            { label: 'Under Review', value: 'Under Review' },
            { label: 'Accepted', value: 'Accepted' },
            { label: 'Rejected', value: 'Rejected' },
        ];
    }

    closeDetail(event){
        this.showRecordDetail = false;
        var edata = event.detail;
        var erec = edata.record;
        var recId = erec.Id;
  
        if (edata.action == 'update'){
            var index = this.findRowIndexById(recId);
            this.columndata[index].Name = erec.Name;
            this.columndata[index].Upvotes__c = erec.Upvotes__c;
            this.columndata[index].Synopsis__c = erec.Synopsis__c;
            console.log(JSON.stringify(this.columndata));
            this.refreshData();
        }
        if (edata.action != 'close'){
            console.log("in refresh");
            refreshApex(this._proposalList);
        }

    }

      // in order to refresh your columndata, execute this function:
    refreshData(){
        this.columndata = JSON.parse(JSON.stringify(this.columndata));
    }

    handleNewButton(event) {
        this.record = {};
        this.showRecordDetail = true;
    }

    handleStageChange(event) {
        this.stageValue = event.detail.value;
    }

    handleNamesearchChange(event){
        this.namesearch = event.target.value;
    }
}