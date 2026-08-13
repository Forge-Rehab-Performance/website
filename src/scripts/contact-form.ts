import { isValidPhoneNumber } from 'libphonenumber-js/min';

export class ContactForm extends HTMLElement {
  constructor() {
    super();

    const form = this.querySelector('form');
    const phoneInput = this.querySelector('input[name="phone"]') as HTMLInputElement;

    if (form && phoneInput) {
      // Clear validation error when user types
      phoneInput.addEventListener('input', () => {
        phoneInput.setCustomValidity('');
      });

      // Validate on submit
      form.addEventListener('submit', (e) => {
        const phoneValue = phoneInput.value.trim();
        
        if (phoneValue && !isValidPhoneNumber(phoneValue, 'US')) {
          e.preventDefault();
          phoneInput.setCustomValidity('Please enter a valid phone number.');
          form.reportValidity();
        }
      });
    }
  }
}

// Register the custom element
customElements.define('contact-form', ContactForm);
