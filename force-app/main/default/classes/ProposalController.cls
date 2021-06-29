public with sharing class ProposalController {

    @AuraEnabled(cacheable=true)
    public static List<Proposal__c> getProposalList(){
        return [
            select id, name, stage__c, synopsis__c, upvotes__c, owner.name from Proposal__c
        ];
    }
}
