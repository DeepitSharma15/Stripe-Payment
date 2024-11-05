import { LightningElement } from 'lwc';
import makePayment from '@salesforce/apex/PaymentController.makePayment';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import createStripeToken from '@salesforce/apex/StripeController.createStripeToken';

export default class PaymentIntegration extends LightningElement {
    cardHolderName = 'John';
    paymentAmount = 50;
    isSuccess = false;

    // Card Details
    cardNumber ;
    cardExpiry;
    cardCvv;

    // Handling the card details

    handleCardNumberChange(event)
    {
        this.cardNumber = event.target.value;
        //console.log(this.cardNumber);
    }

    handleExpiryChange(event)
    {
        this.cardExpiry = event.target.value;
        //console.log(this.cardExpiry);
    }

    handleCVVChange(event)
    {
        this.cardCvv = event.target.value;
        //console.log(this.cardCvv);
    }


    handleCardHolderChange(event)
    {
        this.cardHolderName = event.target.value;
        if(this.cardHolderName.length <3)
        {
            this.showToast('Invalid Name','Please Enter Atleast 3 Characters In Card Holder Name','Error','Dismissible');
        }
    }

    handlePaymentChange(event)
    {
        this.paymentAmount = parseInt(event.target.value);//Parsing Payment Amount To Integer From String
        if(this.paymentAmount<50)
        {
            this.showToast('Invalid Payment Amount','Please Enter Amount 50 or More Than 50.','Error','Dismissible');
        }
    }

    // Loading the stripe.js file here

    async loadStripeJs() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://js.stripe.com/v3/';
            script.onload = () => resolve();
            script.onerror = (error) => reject(error);
            document.head.appendChild(script);
        });
    }

    handlePayClick(event)
    {
        console.log("Handle Pay Click...");
        if(this.cardHolderName.length <3)
        {
            this.showToast('Invalid Name','Please Enter Atleast 3 Characters In Card Holder Name','Error','Dismissible');
        }
        if(this.paymentAmount<50)
        {
            this.showToast('Invalid Payment Amount','Please Enter Amount 50 or More Than 50.','Error','Dismissible');
        }
        if(this.cardHolderName.length>=3 && this.paymentAmount>=50)
        {
            // Creating the card Data with the necessary Details
            const cardData = {
                number: this.cardNumber,
                exp_month: this.cardExpiry.split('/')[0],
                exp_year: '20' + this.cardExpiry.split('/')[1], // Assuming the input is MM/YY
                cvc: this.cardCvv,
                name: this.cardHolderName
            };
            console.log(JSON.stringify(cardData));

            createStripeToken({ cardData: JSON.stringify(cardData) }) // Call Apex method
            .then(result => {
                console.log('Token created:', result); // Handle successful token creation
            })
            .catch(error => {

                console.log('Error In token Creation' +error.message);
                this.errorMessage = error.body.message; // Display error message
            });

            console.log("Meeting all condition...");
            //this.submitPayment(this.paymentAmount*100);
        }
    }

    submitPayment(amount)
    {
        console.log('Submiting the payment...');
        makePayment({amount : amount})//Submitting Request To Apex
        .then(result=>{
            this.showToast('Payment Success','Payment Of Amount '+this.paymentAmount+' Has Been Done.','Success','Dismissible');
            //this.isSuccess = true;//Updating Boolean Variable To True For Payment Success Message
        })
        .catch(error=>{
            this.showToast('Error Processing Payment','Due To Some Error Payment Cannt Be Processed','Error','Dismissible');
        })
    }


    showToast(title, message, variant, mode) {
        this.dispatchEvent(new ShowToastEvent({
            title,
            message,
            variant,
            mode
        }));
    }
}