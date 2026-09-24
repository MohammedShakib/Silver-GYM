import EmailProvider from './EmailProvider.js';

class DevelopmentEmailProvider extends EmailProvider {
  async send({ to, subject, template, data }) {
    console.log('\n--- DEVELOPMENT EMAIL PROVIDER ---');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Template: ${template}`);
    console.log('Data:', JSON.stringify(data, null, 2));
    console.log('----------------------------------\n');
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      messageId: `dev-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'DELIVERED',
    };
  }
}

export default new DevelopmentEmailProvider();
