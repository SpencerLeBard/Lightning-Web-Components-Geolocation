public with sharing class GeolocationController {
    @AuraEnabled
    public static void setLocation(String objectApiName, Map<String, Object> location, String recordId){
        sObject sObj = Schema.getGlobalDescribe().get(objectApiName).newSObject();
        sObj.put('Id', recordId);
        for(String field : location.keySet()){
            sObj.put(field, location.get(field));
        }
        update sObj;
    }
}