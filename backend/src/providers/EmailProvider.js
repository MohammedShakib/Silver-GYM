export default class EmailProvider {
  /**
   * Send an email.
   * @param {Object} options
   * @param {string} options.to - Recipient email address
   * @param {string} options.subject - Email subject
   * @param {string} options.template - Template name
   * @param {Object} options.data - Template data
   * @returns {Promise<{ messageId: string, status: string }>}
   */
  async send({ to, subject, template, data }) {
    throw new Error('EmailProvider.send must be implemented');
  }
}
