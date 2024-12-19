

// import { LightningElement , track} from 'lwc';
// import makePayment from '@salesforce/apex/PaymentController.makePayment';
// import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// import createStripeToken from '@salesforce/apex/StripePaymentController.createStripeToken';

// export default class PaymentIntegration extends LightningElement {
//     cardHolderName = 'John';
//     paymentAmount = 50;
//     isSuccess = false;

//     @track cardNumber= '';
//     cardExpiry;
//     cardCvv;
//     @track cardLogo = '';


//     // Field handlers with validation
//     handleCardNumberChange(event) {
//         this.cardNumber = event.target.value;
//         const isValid = /^\d{13,16}$/.test(this.cardNumber);
//         event.target.setCustomValidity(isValid ? '' : 'Card number must be 13 to 16 digits with only numbers');
//         event.target.reportValidity();
//         this.updateCardLogo();

        
//     }

//     updateCardLogo() {
//         const cardPatterns = {
//             visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
//             mastercard: /^5[1-5][0-9]{14}$/,
//             amex: /^3[47][0-9]{13}$/,
//             discover: /^6(?:011|5[0-9]{2}|4[4-9][0-9]|22(?:12[6-9]|[3-9][0-9]|[0-9]{2}))\d{12}$/

//         };

//         let detectedBrand = '';
//         for (const [brand, pattern] of Object.entries(cardPatterns)) {
//             if (pattern.test(this.cardNumber)) {
//                 detectedBrand = brand;
//                 break;
//             }
//         }

//         this.cardLogo = this.cardBrandMap[detectedBrand] || this.cardBrandMap.default;
//     }

//     get cardBrandMap() {
//         return {
//             visa: 'https://metadologie-8a-dev-ed.develop.file.force.com//file-asset-public/visa?oid=00DNS000002DR7b',
//             mastercard: 'https://metadologie-8a-dev-ed.develop.file.force.com//file-asset-public/mastercard?oid=00DNS000002DR7b',
//             switch: 'https://metadologie-8a-dev-ed.develop.file.force.com//file-asset-public/switch?oid=00DNS000002DR7b',
//              americanexpress: 'https://metadologie-8a-dev-ed.develop.file.force.com//file-asset-public/amex?oid=00DNS000002DR7b',
//             discover:'https://metadologie-8a-dev-ed.develop.file.force.com//file-asset-public/discover?oid=00DNS000002DR7b',
//             jcb: 'https://metadologie-8a-dev-ed.develop.file.force.com//file-asset-public/jcb?oid=00DNS000002DR7b'

//         };
//     }
    
//     get cardLogoStyle() {
//         return this.cardLogo
//         ? `background-image: url(${this.cardLogo}); background-size: 24px; background-repeat: no-repeat; background-position: 8px center; padding-left: 40px;`
//         : '';
//     }
    


//     handleExpiryChange(event) {
//         let input = event.target.value.replace(/\D/g, ''); // Remove non-numeric characters
//         if (input.length === 1 && input > '1') input = `0${input}`; // Adds 0 if month is single digit and >1
//         if (input.length === 2) input = `${input}/`; // Automatically adds "/" after MM
//         if (input.length > 2 && input[2] !== '/') input = `${input.slice(0, 2)}/${input.slice(2)}`; // Corrects input if "/" isn't present
//         this.cardExpiry = input.slice(0, 5); // Restrict to 5 characters (MM/YY)

//         event.target.value = this.cardExpiry; // Update field
//         const isValid = this.validateExpiryDate(this.cardExpiry);
//         event.target.setCustomValidity(isValid ? '' : 'Expiry date format should be MM/YY');
//         event.target.reportValidity();
//     }
    
//     handleCVVChange(event) {
//         this.cardCvv = event.target.value;
//         const isValid = /^\d{3,4}$/.test(this.cardCvv);
//         event.target.setCustomValidity(isValid ? '' : 'CVV must be 3 to 4 digits');
//         event.target.reportValidity();
//     }

//     handleCardHolderChange(event) {
//         this.cardHolderName = event.target.value;
    
//     // Validates for at least two words (first name and last name), each with alphabetic characters
//     const isValid = /^[A-Za-z]+ [A-Za-z]+$/.test(this.cardHolderName) && this.cardHolderName.length > 3;
//     event.target.setCustomValidity(isValid ? '' : 'Please enter a valid full name with first and last names');
//     event.target.reportValidity();
//     }

//     handlePaymentChange(event) {
//         this.paymentAmount = parseInt(event.target.value);
//         const isValid = this.paymentAmount >= 50;
//         event.target.setCustomValidity(isValid ? '' : 'Minimum payment amount is 50');
//         event.target.reportValidity();
//     }

//     validateExpiryDate(input) {
//         const expiryPattern = /^(0[1-9]|1[0-2])\/\d{2}$/;
//         return expiryPattern.test(input); // Use 'input' instead of 'value'
//     }
    

//     validateCvv(input) {
//         const cvvPattern = /^\d{3,4}$/;
//         return cvvPattern.test(input.value);
//     }

//     async loadStripeJs() {
//         return new Promise((resolve, reject) => {
//             const script = document.createElement('script');
//             script.src = 'https://js.stripe.com/v3/';
//             script.onload = () => resolve();
//             script.onerror = (error) => reject(error);
//             document.head.appendChild(script);
//         });
//     }

//     handlePayClick() {
//         if (!this.cardHolderName || !this.cardNumber || !this.cardExpiry || !this.cardCvv || !this.paymentAmount) {
//             this.showToast('Error', 'Please fill in all fields', 'error', 'dismissible');
//             return;
//         }

//         if (this.cardHolderName.length > 3 && this.paymentAmount >= 50) {
//             const cardData = {
//                 number: this.cardNumber,
//                 exp_month: this.cardExpiry.split('/')[0],
//                 exp_year: '20' + this.cardExpiry.split('/')[1],
//                 cvc: this.cardCvv,
//                 name: this.cardHolderName
//             };
//             createStripeToken({ cardData: JSON.stringify(cardData) })
//                 .then(result => {
//                     console.log("Token Created"+result)
//                     console.log('Token created:', result);
//                     this.submitPayment(this.paymentAmount*100, result);

//                     this.isSuccess = true;

//                     this.cardCvv = ''; this.cardHolderName = ''; this.cardExpiry = ''; this.cardCvv = ''; this.amount = '';
//                 })
//                 .catch(error => {
//                     this.showToast('Error Processing Payment', 'Payment could not be processed', 'error', 'dismissible');
//                 });
//         }
//     }

//     submitPayment(amount, token) {
//         makePayment({ amount: amount , token: token })
//             .then(() => {
//                 this.showToast('Payment Success', `Payment of ₹${this.paymentAmount} has been completed successfully.`, 'success', 'dismissible');
//             })
//             .catch(() => {
//                 this.showToast('Error Processing Payment', 'Due to an error, payment cannot be processed', 'error', 'dismissible');
//             });
//     }

//     showToast(title, message, variant, mode) {
//         this.dispatchEvent(new ShowToastEvent({ title, message, variant, mode }));
//     }
// }



import { LightningElement , track} from 'lwc';
import makePayment from '@salesforce/apex/PaymentController.makePayment';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import createStripeToken from '@salesforce/apex/StripePaymentController.createStripeToken';

export default class PaymentIntegration extends LightningElement {
    cardHolderName = 'John';
    paymentAmount = 50;
    isSuccess = false;

    @track cardNumber= '';
    cardExpiry;
    cardCvv;
    @track cardLogo = 'https://www.google.com/imgres?q=default%20blank%20credit%20card%20image&imgurl=https%3A%2F%2Fpng.pngtree.com%2Fpng-vector%2F20230909%2Fourmid%2Fpngtree-blank-credit-card-lending-png-image_9236486.png&imgrefurl=https%3A%2F%2Fpngtree.com%2Ffree-png-vectors%2Fblank-credit-card&docid=UBs6B8wQRPnj9M&tbnid=aM2TiptoHC19AM&vet=12ahUKEwjh--qA0smJAxVW1TgGHamQOnAQM3oECBgQAA..i&w=512&h=360&hcb=2&ved=2ahUKEwjh--qA0smJAxVW1TgGHamQOnAQM3oECBgQAA';


    // Field handlers with validation
    handleCardNumberChange(event) {
        this.cardNumber = event.target.value;
        const isValid = /^\d{13,16}$/.test(this.cardNumber);
        event.target.setCustomValidity(isValid ? '' : 'Card number must be 13 to 16 digits with only numbers');
        event.target.reportValidity();
    
        // Update logo immediately on valid input
        if (isValid) {
            this.updateCardLogo();
        } else {
            this.cardLogo = this.cardBrandMap.default; // Reset to default if invalid
        }
    }
    

    updateCardLogo() {
        const cardPatterns = {
            visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
            mastercard: /^5[1-5][0-9]{14}$/,
            amex: /^3[47][0-9]{13}$/,
            discover: /^6(?:011|5[0-9]{2}|4[4-9][0-9]|22(?:12[6-9]|[3-9][0-9]|[0-9]{2}))\d{12}$/
        };
    
        let detectedBrand = '';
        for (const [brand, pattern] of Object.entries(cardPatterns)) {
            if (pattern.test(this.cardNumber)) {
                detectedBrand = brand;
                break;
            }
        }
    
        this.cardLogo = this.cardBrandMap[detectedBrand] || this.cardBrandMap.default;
    }

    get cardBrandMap() {
        return {
            visa: 'https://metadologie-8a-dev-ed.develop.file.force.com//file-asset-public/visa?oid=00DNS000002DR7b',
            mastercard: 'https://metadologie-8a-dev-ed.develop.file.force.com//file-asset-public/mastercard?oid=00DNS000002DR7b',
            switch: 'https://metadologie-8a-dev-ed.develop.file.force.com//file-asset-public/switch?oid=00DNS000002DR7b',
             amex: 'https://metadologie-8a-dev-ed.develop.file.force.com//file-asset-public/amex?oid=00DNS000002DR7b',
            discover:'https://metadologie-8a-dev-ed.develop.file.force.com//file-asset-public/discover?oid=00DNS000002DR7b',
            jcb: 'https://metadologie-8a-dev-ed.develop.file.force.com//file-asset-public/jcb?oid=00DNS000002DR7b'

        };
    }
    
    get cardLogoStyle() {
        return this.cardLogo
        ? `background-image: url(${this.cardLogo}); background-size: 24px; background-repeat: no-repeat; background-position: 8px center; padding-left: 40px;`
        : '';
    }
    


    handleExpiryChange(event) {
        let input = event.target.value.replace(/\D/g, ''); // Remove non-numeric characters
        if (input.length === 1 && input > '1') input = `0${input}`; // Adds 0 if month is single digit and >1
        if (input.length === 2) input = `${input}/`; // Automatically adds "/" after MM
        if (input.length > 2 && input[2] !== '/') input = `${input.slice(0, 2)}/${input.slice(2)}`; // Corrects input if "/" isn't present
        this.cardExpiry = input.slice(0, 5); // Restrict to 5 characters (MM/YY)

        event.target.value = this.cardExpiry; // Update field
        const isValid = this.validateExpiryDate(this.cardExpiry);
        event.target.setCustomValidity(isValid ? '' : 'Expiry date format should be MM/YY');
        event.target.reportValidity();
    }
    
    handleCVVChange(event) {
        this.cardCvv = event.target.value;
        const isValid = /^\d{3,4}$/.test(this.cardCvv);
        event.target.setCustomValidity(isValid ? '' : 'CVV must be 3 to 4 digits');
        event.target.reportValidity();
    }

    handleCardHolderChange(event) {
        this.cardHolderName = event.target.value;
    
    // Validates for at least two words (first name and last name), each with alphabetic characters
    const isValid = /^[A-Za-z]+ [A-Za-z]+$/.test(this.cardHolderName) && this.cardHolderName.length > 3;
    event.target.setCustomValidity(isValid ? '' : 'Please enter a valid full name with first and last names');
    event.target.reportValidity();
    }

    handlePaymentChange(event) {
        this.paymentAmount = parseInt(event.target.value);
        const isValid = this.paymentAmount >= 50;
        event.target.setCustomValidity(isValid ? '' : 'Minimum payment amount is 50');
        event.target.reportValidity();
    }

    validateExpiryDate(input) {
        const expiryPattern = /^(0[1-9]|1[0-2])\/\d{2}$/;
        return expiryPattern.test(input); // Use 'input' instead of 'value'
    }
    

    validateCvv(input) {
        const cvvPattern = /^\d{3,4}$/;
        return cvvPattern.test(input.value);
    }

    async loadStripeJs() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://js.stripe.com/v3/';
            script.onload = () => resolve();
            script.onerror = (error) => reject(error);
            document.head.appendChild(script);
        });
    }

    handlePayClick() {
        if (!this.cardHolderName || !this.cardNumber || !this.cardExpiry || !this.cardCvv || !this.paymentAmount) {
            this.showToast('Error', 'Please fill in all fields', 'error', 'dismissible');
            return;
        }

        if (this.cardHolderName.length > 3 && this.paymentAmount >= 50) {
            const cardData = {
                number: this.cardNumber,
                exp_month: this.cardExpiry.split('/')[0],
                exp_year: '20' + this.cardExpiry.split('/')[1],
                cvc: this.cardCvv,
                name: this.cardHolderName
            };
            createStripeToken({ cardData: JSON.stringify(cardData) })
                .then(result => {
                    console.log("Token Created"+result)
                    console.log('Token created:', result);
                    this.submitPayment(this.paymentAmount*100, result);

                    this.isSuccess = true;

                    this.cardCvv = ''; this.cardHolderName = ''; this.cardExpiry = ''; this.cardCvv = ''; this.amount = '';
                })
                .catch(error => {
                    this.showToast('Error Processing Payment', 'Payment could not be processed', 'error', 'dismissible');
                });
        }
    }

    submitPayment(amount, token) {
        makePayment({ amount: amount , token: token })
            .then(() => {
                this.showToast('Payment Success', `Payment of ₹${this.paymentAmount} has been completed successfully.`, 'success', 'dismissible');
            })
            .catch(() => {
                this.showToast('Error Processing Payment', 'Due to an error, payment cannot be processed', 'error', 'dismissible');
            });
    }

    showToast(title, message, variant, mode) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant, mode }));
    }
    goToDashboard() {
       
       
        window.open('https://dashboard.stripe.com/test/payments', '_blank');
    }
}




