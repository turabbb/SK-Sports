// src/services/emailService.js
import emailjs from '@emailjs/browser';
import emailConfig, { validateEmailConfig } from '../config/emailConfig';

class EmailService {
  constructor() {
    this.initialized = false;
  }

  // Initialize EmailJS
  init() {
    if (!validateEmailConfig()) {
      throw new Error('EmailJS configuration is invalid. Please check your credentials in src/config/emailConfig.js');
    }
    
    emailjs.init(emailConfig.publicKey);
    this.initialized = true;
    console.log('✅ EmailJS initialized successfully');
  }

  // Send order confirmation email - matches your beautiful template!
  async sendOrderConfirmation(orderData, customerInfo, shippingAddress, cartItems, totalPrice, paymentMethod) {
    try {
      if (!this.initialized) {
        this.init();
      }

      console.log('📧 Preparing order confirmation email...');

      // Format order items for email (matches your template's format)
      const orderItemsText = cartItems.map(item => 
        `• ${item.name}${item.selectedSize ? ` (Size: ${item.selectedSize})` : ''} - Qty: ${item.quantity} - Rs. ${(item.price * item.quantity).toLocaleString()}`
      ).join('\n');

      // Format shipping address
      const fullAddress = `${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.province} ${shippingAddress.zip}, ${shippingAddress.country}`;

      // Format order date
      const orderDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      // Email template parameters - perfectly matches your HTML template variables
      const templateParams = {
        // IMPORTANT: EmailJS recipient info
        to_email: customerInfo.email,  // This is critical for EmailJS
        to_name: customerInfo.name,
        
        // Order details
        order_number: orderData.orderNumber || `ORD-${Date.now()}`,
        order_date: orderDate,
        
        // Customer information
        customer_name: customerInfo.name,
        customer_email: customerInfo.email,
        customer_phone: customerInfo.phone,
        
        // Shipping details
        shipping_address: fullAddress,
        
        // Order items and payment
        order_items: orderItemsText,
        total_amount: `Rs. ${totalPrice.toLocaleString()}`,
        payment_method: paymentMethod,
        
        // Additional template params from config
        ...emailConfig.templateParams
      };

      // Debug: Check if email is present
      console.log('📧 Recipient email check:', {
        customerEmail: customerInfo.email,
        toEmail: templateParams.to_email,
        emailExists: !!templateParams.to_email
      });

      console.log('📋 Email template parameters prepared:');
      console.log('- Order Number:', templateParams.order_number);
      console.log('- Customer:', templateParams.customer_name);
      console.log('- Email:', templateParams.customer_email);
      console.log('- Total:', templateParams.total_amount);

      console.log('📤 Sending email via EmailJS...');

      const result = await emailjs.send(
        emailConfig.serviceId,
        emailConfig.templateId,
        templateParams
      );

      console.log('✅ Order confirmation email sent successfully!');
      console.log('EmailJS Response:', result);
      
      return { success: true, result, message: 'Order confirmation email sent successfully!' };

    } catch (error) {
      console.error('❌ Failed to send order confirmation email:', error);
      
      // Detailed error logging
      if (error.status) {
        console.error('EmailJS Error Status:', error.status);
        console.error('EmailJS Error Text:', error.text);
      }
      
      let errorMessage = 'Failed to send email';
      if (error.text) {
        errorMessage = error.text;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return { success: false, error: errorMessage };
    }
  }

  // Send test email with your template
  async sendTestEmail(testEmail = 'test@example.com') {
    try {
      if (!this.initialized) {
        this.init();
      }

      console.log('🧪 Sending test email to:', testEmail);

      const testParams = {
        to_name: 'Test Customer',
        to_email: testEmail,
        order_number: `TEST-${Date.now()}`,
        order_date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }),
        customer_name: 'Test Customer',
        customer_email: testEmail,
        customer_phone: '+92 300 1234567',
        shipping_address: 'Test Street, Test City, Punjab 54000, Pakistan',
        order_items: '• Test Sports Jersey (Size: L) - Qty: 1 - Rs. 2,500\n• Test Football - Qty: 1 - Rs. 1,500',
        total_amount: 'Rs. 4,000',
        payment_method: 'Cash on Delivery',
        ...emailConfig.templateParams
      };

      const result = await emailjs.send(
        emailConfig.serviceId,
        emailConfig.templateId,
        testParams
      );

      console.log('✅ Test email sent successfully:', result);
      return { success: true, result, message: 'Test email sent successfully!' };

    } catch (error) {
      console.error('❌ Test email failed:', error);
      
      let errorMessage = 'Test email failed';
      if (error.text) {
        errorMessage = error.text;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return { success: false, error: errorMessage };
    }
  }

  // FIXED: Get configuration status for debugging
  getConfigStatus() {
    // Use the same validation logic as validateEmailConfig
    const isValidServiceId = emailConfig.serviceId && emailConfig.serviceId.trim() !== '';
    const isValidTemplateId = emailConfig.templateId && emailConfig.templateId.trim() !== '';
    const isValidPublicKey = emailConfig.publicKey && emailConfig.publicKey.trim() !== '';
    
    console.log('🔍 Config Status Check:');
    console.log('- Service ID valid:', isValidServiceId, '(', emailConfig.serviceId, ')');
    console.log('- Template ID valid:', isValidTemplateId, '(', emailConfig.templateId, ')');
    console.log('- Public Key valid:', isValidPublicKey, '(', emailConfig.publicKey?.substring(0, 8) + '...)', ')');
    
    const allValid = isValidServiceId && isValidTemplateId && isValidPublicKey;
    console.log('- All valid:', allValid);
    
    return {
      serviceId: isValidServiceId,
      templateId: isValidTemplateId,
      publicKey: isValidPublicKey,
      initialized: this.initialized,
      allValid: allValid
    };
  }

  // Manual configuration test (for debugging)
  async testConfiguration() {
    try {
      console.log('🔧 Testing EmailJS configuration...');
      
      const status = this.getConfigStatus();
      console.log('Configuration Status:', status);
      
      if (!status.allValid) {
        throw new Error('EmailJS configuration is incomplete. Please check your credentials.');
      }
      
      if (!this.initialized) {
        this.init();
      }
      
      console.log('✅ EmailJS configuration test passed!');
      return { success: true, message: 'Configuration is valid' };
      
    } catch (error) {
      console.error('❌ Configuration test failed:', error);
      return { success: false, error: error.message };
    }
  }
}

// Export a singleton instance
export default new EmailService();