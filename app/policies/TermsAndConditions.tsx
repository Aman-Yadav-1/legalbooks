import React from 'react'

export const TermsAndConditions: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-6">
        <h1 className="text-3xl font-extrabold text-center text-white">
          Terms and Conditions
        </h1>
      </div>
      
      <div className="p-8 space-y-8">
        {[
          {
            title: "1. Acceptance of Terms",
            content: "By purchasing and downloading digital documents and Leads from our platform, you agree to be bound by these Terms and Conditions. If you do not agree with these terms, do not proceed with the purchase."
          },
          {
            title: "2. Digital Content",
            content: "All digital documents and Leads provided are for personal use only. You may not reproduce, re-sell, distribute, modify, or publicly display the items without our prior written consent."
          },
          {
            title: "3. Payment and Pricing",
            content: "Prices for digital documents and Leads listed on our website are subject to change without notice. Payment is required in full before the delivery of the digital documents or Leads."
          },
          {
            title: "4. Delivery",
            content: "Upon successful payment, the digital document or Lead Cards will be made available for download or access. The delivery method will be specified at the time of purchase. It is your responsibility to ensure that you provide accurate information for delivery."
          },
          {
            title: "5. License and Use",
            content: "Upon purchase, you are granted a non-exclusive, non-transferable license to use the digital documents or Leads. This license is limited to personal use and may not be shared or used for commercial purposes."
          },
          {
            title: "6. Refund Policy",
            content: "Refunds are subject to our Refund Policy, which is outlined separately. Please review the policy before making a purchase. Refunds will only be issued under the conditions specified in our Refund Policy."
          },
          {
            title: "7. Intellectual Property",
            content: "All intellectual property rights in the digital documents and Leads are owned by us or our licensors. You may not claim ownership of or infringe on our intellectual property rights."
          },
          {
            title: "8. User Responsibilities",
            content: "You agree to use the digital documents or Lead Cards in compliance with all applicable laws and regulations. You are responsible for maintaining the security of your account and login information."
          },
          {
            title: "9. Limitation of Liability",
            content: "To the maximum extent permitted by law, we are not liable for any indirect, incidental, special, or consequential damages arising from the use or inability to use the digital documents. Our liability is limited to the purchase price of the document."
          },
          {
            title: "10. Warranties",
            content: "We make no warranties or representations regarding the accuracy, completeness, or fitness for a particular purpose of the digital documents. All documents are provided \"as is\"."
          },
          {
            title: "11. Termination",
            content: "We reserve the right to terminate your access to the digital documents and Leads account if you breach any of these Terms and Conditions. Upon termination, you must cease using the digital documents and delete any copies in your possession."
          },
          {
            title: "12. Governing Law",
            content: "These Terms and Conditions are governed by and construed in accordance with the laws of India. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in Hyderabad."
          },
          {
            title: "13. Changes to Terms",
            content: "We may update these Terms and Conditions from time to time. Any changes will be posted on our website and will become effective immediately. Your continued use of the digital documents and Lead Cards after such changes constitutes acceptance of the new terms."
          },
          {
            title: "14. Contact Information",
            content: "For any questions or concerns regarding these Terms and Conditions, please contact us at support@legalbooks.in or call us at 9440142156."
          }
        ].map((section, index) => (
          <section key={index} className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition duration-300">
            <h2 className="text-xl font-semibold mb-3 text-indigo-600">
              {section.title}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {section.content}
            </p>
          </section>
        ))}
      </div>
    </div>
  </div>
)