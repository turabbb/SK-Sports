// src/config/emailConfig.js
const emailConfig = {
  // Direct values - just put your actual EmailJS credentials here
  serviceId: 'service_b9rhoke',        // Replace with your actual Service ID
  templateId: 'template_b5jdqx7',      // Replace with your actual Template ID  
  publicKey: '_Qt6mefQExPaLmGWi',   // Replace with your actual Public Key
  
  templateParams: {
    from_name: 'SK Sports',
    reply_to: 'support@sk-sports.com',
  }
};

// Validation function
export const validateEmailConfig = () => {
  const { serviceId, templateId, publicKey } = emailConfig;
  
  console.log('🔍 Validating EmailJS Configuration...');
  console.log('Service ID:', serviceId ? '✅ Set' : '❌ Missing');
  console.log('Template ID:', templateId ? '✅ Set' : '❌ Missing');
  console.log('Public Key:', publicKey ? '✅ Set' : '❌ Missing');
  
  if (!serviceId) {
    console.error('❌ EmailJS Service ID not configured');
    return false;
  }
  
  if (!templateId) {
    console.error('❌ EmailJS Template ID not configured');
    return false;
  }
  
  if (!publicKey) {
    console.error('❌ EmailJS Public Key not configured');
    return false;
  }
  
  console.log('✅ EmailJS configuration is valid');
  return true;
};

export default emailConfig;