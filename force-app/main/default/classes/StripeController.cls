public with sharing class StripeController {
    @AuraEnabled
    public static String createStripeToken(String cardData) {
        // Deserialize JSON string into a Map
        // Deserialize JSON string into Map<String, Object>
        Map<String, Object> rawCardDetails = (Map<String, Object>) JSON.deserializeUntyped(cardData);

    // Convert Map<String, Object> to Map<String, String>
        Map<String, String> cardDetails = new Map<String, String>();
        for (String key : rawCardDetails.keySet()) {
            cardDetails.put(key, (String) rawCardDetails.get(key));
        }

        // Prepare the request
        Payment_Credentials__mdt credentials = Payment_Credentials__mdt.getInstance('Payment_Keys');
        String secretKey = credentials.Secret_Key__c;
        HttpRequest req = new HttpRequest();
        req.setEndpoint('https://api.stripe.com/v1/tokens');
        req.setMethod('POST');
        req.setHeader('Authorization', 'Bearer ' + secretKey); // Replace with your Stripe secret key
        req.setHeader('Content-Type', 'application/x-www-form-urlencoded');

        // Build the request body
        String requestBody = 'card[number]=' + EncodingUtil.urlEncode(cardDetails.get('number'), 'UTF-8') +
                             '&card[exp_month]=' + EncodingUtil.urlEncode(cardDetails.get('exp_month'), 'UTF-8') +
                             '&card[exp_year]=' + EncodingUtil.urlEncode(cardDetails.get('exp_year'), 'UTF-8') +
                             '&card[cvc]=' + EncodingUtil.urlEncode(cardDetails.get('cvc'), 'UTF-8') +
                             '&card[name]=' + EncodingUtil.urlEncode(cardDetails.get('name'), 'UTF-8');

        req.setBody(requestBody);

        // Send the request
        Http http = new Http();
        HttpResponse res = http.send(req);

        // Handle the response
        if (res.getStatusCode() == 200) {
            // Parse the response and return the token
            Map<String, Object> responseMap = (Map<String, Object>) JSON.deserializeUntyped(res.getBody());
            return (String) responseMap.get('id'); // Return the token ID
        } else {
            // Handle error response
            throw new AuraHandledException('Error creating token: ' + res.getBody());
        }
    }
}