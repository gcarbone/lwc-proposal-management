public with sharing class ProposalController {

    @AuraEnabled(cacheable=true)
    public static List<Proposal__c> getProposalList(){
        return [
            select id, name, stage__c, synopsis__c, upvotes__c, owner.name from Proposal__c
        ];
    }

    @AuraEnabled(cacheable=true)
    public static List<Proposal__c> getProposalList(String name, String stage){
        String searchterm = '%' + name + '%';
        
        if (name == '' & stage == ''){
            return [
                select id, name, stage__c, synopsis__c, upvotes__c, owner.name from Proposal__c
            ];
        } else if (name == ''){
            return [
                select id, name, stage__c, synopsis__c, upvotes__c, owner.name from Proposal__c
                where stage__c = :stage
            ];
        } else if (stage == ''){
            return [
                select id, name, stage__c, synopsis__c, upvotes__c, owner.name from Proposal__c
                where name like :searchterm
            ];
        } else {
            return [
            select id, name, stage__c, synopsis__c, upvotes__c, owner.name from Proposal__c
            where stage__c = :stage and name like :searchterm
        ];
        }
    }

    
}
