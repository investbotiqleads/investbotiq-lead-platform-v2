// This file would normally use the Resend API directly
// For now, we'll create a mock implementation that can be replaced with the actual Resend API later

// Mock function to send confirmation email to user
export const sendConfirmationEmail = async (userEmail, userName, role) => {
  // In a real implementation, this would use the Resend API
  console.log(`Sending confirmation email to ${userEmail} (${userName}) for role: ${role}`);
  
  // This would be replaced with actual Resend API code
  // Example implementation with Resend would look like:
  /*
  import { Resend } from 'resend';
  
  const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY);
  
  const { data, error } = await resend.emails.send({
    from: 'InvestbotIQ <noreply@investbotiq.com>',
    to: userEmail,
    subject: 'Welcome to InvestbotIQ!',
    html: `<p>Hello ${userName},</p>
           <p>Thank you for registering with InvestbotIQ as a ${role}.</p>
           <p>We'll be in touch soon!</p>`
  });
  
  if (error) {
    console.error('Error sending confirmation email:', error);
    throw error;
  }
  
  return data;
  */
  
  // For now, just return a mock success response
  return {
    success: true,
    messageId: `mock-${Date.now()}-${userEmail}`
  };
};

// Mock function to send notification email to admin
export const sendNotificationEmail = async (adminEmail, leadData) => {
  // In a real implementation, this would use the Resend API
  console.log(`Sending notification email to admin (${adminEmail}) about new lead:`, leadData);
  
  // This would be replaced with actual Resend API code
  // Example implementation with Resend would look like:
  /*
  import { Resend } from 'resend';
  
  const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY);
  
  const { data, error } = await resend.emails.send({
    from: 'InvestbotIQ <noreply@investbotiq.com>',
    to: adminEmail,
    subject: `New ${leadData.role} Lead: ${leadData.first_name} ${leadData.last_name}`,
    html: `<p>A new lead has registered:</p>
           <ul>
             <li>Name: ${leadData.first_name} ${leadData.last_name}</li>
             <li>Email: ${leadData.email}</li>
             <li>Phone: ${leadData.phone || 'Not provided'}</li>
             <li>Role: ${leadData.role}</li>
             <li>City: ${leadData.city || 'Not provided'}</li>
             <li>Referral Code: ${leadData.referral_code || 'None'}</li>
           </ul>`
  });
  
  if (error) {
    console.error('Error sending notification email:', error);
    throw error;
  }
  
  return data;
  */
  
  // For now, just return a mock success response
  return {
    success: true,
    messageId: `mock-${Date.now()}-${adminEmail}`
  };
};
