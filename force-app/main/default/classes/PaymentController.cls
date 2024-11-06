public class PaymentController {
    /*
     * @description : This Method Makes The Payment For Given Amount
     * @return : This Method Returns The String Of Response
     */
    @AuraEnabled
    public static String makePayment(Integer amount, String token)
    {
        try{
            //Fetching Custom Metadata For Credentials
            Payment_Credentials__mdt credentials = Payment_Credentials__mdt.getInstance('Payment_Keys');
            String secretKey = credentials.Secret_Key__c;
            String publicKey = credentials.Public_Key__c;

            String apiURL = 'https://api.stripe.com/v1/charges';

            HttpRequest request = new HttpRequest();
            HttpResponse response = new HttpResponse();
            Http httpRequest = new Http();

            String requestBody = 'amount='+EncodingUtil.urlEncode(String.valueOf(amount),'UTF-8')+'&currency='+EncodingUtil.urlEncode('inr','UTF-8')+'&source='+EncodingUtil.urlEncode(token ,'UTF-8');
            request.setEndpoint(apiURL);
            request.setMethod('POST');
            request.setBody(requestBody);

            request.setHeader('Authorization','Basic '+EncodingUtil.base64Encode(Blob.valueOf(secretKey+':' +publicKey)));
            request.setHeader('Content-Type', 'application/x-www-form-urlencoded');
            response = httpRequest.send(request);

            if(response.getStatusCode() == 200)
            {
                return response.getBody();
            }
            else if (response.getStatusCode() != 200) {
                throw new AuraHandledException('Error Processing Payment From Apex');
            }
        }
        Catch(Exception e)
        {
            System.debug('Exception Message : '+e.getMessage());
            System.debug('Exception Line Number : '+e.getLineNumber());
            throw new AuraHandledException('Error Processing Payment From Apex');//Throwing Exception If Error Occured
        }
        return '';
    }
}