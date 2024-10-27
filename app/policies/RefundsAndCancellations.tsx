import React from 'react'

export const RefundsAndCancellations: React.FC = () => (
  <div className="bg-gray-100 min-h-screen py-12 px-4 font-sans">
    <div className="container mx-auto max-w-4xl">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-6 px-8 rounded-t-lg">
        <h1 className="text-3xl font-extrabold text-white text-center">Refunds and Cancellations Policy</h1>
      </div>
      
      <div className="bg-white shadow-md rounded-b-lg p-8">
        {[
          {
            icon: "M6 2L6 6L4 6L12 12L20 6L18 6L18 2H6Z",
            title: "1. Scope of the Policy",
            content: "This policy applies to all digital documents purchased and delivered through our platform. Digital documents include, but are not limited to, e-books, reports, templates, and online courses."
          },
          {
            icon: "M9 9L15 15M15 9L9 15M12 3H12V12H12M12 18H12V18H12",
            title: "2. Non-Refundable Conditions",
            content: <>
              <p className="font-semibold mb-3">Lead Cards once purchased are Non-Refundable</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Immediate Access: Once a digital document is delivered and accessed by the customer, it is generally non-refundable. This is due to the nature of digital goods, which can be copied and used indefinitely.</li>
                <li>Download Completion: Refunds are not available if the document has been downloaded or accessed, even partially, unless there is a proven defect or issue with the document.</li>
              </ul>
            </>
          },
          {
            icon: "M4 5L12 12L20 5M4 19L12 12L20 19",
            title: "3. Refund Eligibility",
            content: <ul className="list-disc pl-5 space-y-2">
              <li>Defective or Incorrect Content: If the digital document is defective, incorrect, or does not match the description provided, you may be eligible for a refund or replacement. This must be reported within a specific period (e.g., 7 days) from the date of purchase.</li>
              <li>Technical Issues: If you experience technical issues that prevent you from accessing the document and have exhausted all troubleshooting steps, you may be eligible for a refund. Documentation of the issue may be required.</li>
            </ul>
          },
          {
            icon: "M3 4A2 2 0 015 2H19A2 2 0 0121 4V20A2 2 0 0119 22H5A2 2 0 013 20V4ZM6 6V18H18V6H6Z",
            title: "4. Refund Request Procedure",
            content: <ul className="list-disc pl-5 space-y-2">
              <li>Contact Us: To request a refund, contact our customer support team at support@legalbooks.in or 9440142156 with your order number and a detailed description of the issue.</li>
              <li>Resolution Timeframe: We aim to respond to refund requests within [X] business days. Once reviewed, we will provide a resolution, which may include a refund, replacement, or alternative solution.</li>
            </ul>
          },
          {
            icon: "M7 8H17V12H7V8ZM7 16H17V14H7V16ZM7 4H17V6H7V4ZM7 20H17V18H7V20Z",
            title: "5. Exceptions",
            content: "Refunds are not provided for change of mind or accidental purchases. Please review the product details and ensure it meets your needs before completing your purchase."
          },
          {
            icon: "M3 4A2 2 0 015 2H19A2 2 0 0121 4V20A2 2 0 0119 22H5A2 2 0 013 20V4ZM6 6V18H18V6H6Z",
            title: "6. Fraud Prevention",
            content: "We reserve the right to refuse refunds if we suspect fraudulent activity or abuse of the refund policy."
          },
          {
            icon: "M3 4A2 2 0 015 2H19A2 2 0 0121 4V20A2 2 0 0119 22H5A2 2 0 013 20V4ZM6 6V18H18V6H6Z",
            title: "7. Policy Changes",
            content: "We may update this policy periodically. Any changes will be effective immediately upon posting on our website. Please review the policy regularly for any updates."
          },
          {
            icon: "M7 4V20H17V4H7Z",
            title: "8. Contact Information",
            content: "If you have any questions or concerns regarding our refund policy, please contact us at support@legalbooks.in or call us at 9440142156."
          }
        ].map((section, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1">
            <div className="h-1 bg-gradient-to-r from-blue-400 to-indigo-400"></div>
            <div className="p-8">
              <h3 className="text-2xl font-semibold mb-4 flex items-center text-gray-800">
                <svg className="w-8 h-8 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={section.icon}></path>
                </svg>
                {section.title}
              </h3>
              <div className="text-gray-700 text-base leading-relaxed">
                {section.content}
              </div>
            </div>
          </div>
        ))}

        <div className="mt-12 text-center text-sm text-gray-600">
          <p>© 2024 LegalBooks. All rights reserved.</p>
          <p className="mt-2">For more information, please visit our <a href="#" className="text-blue-700 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-700 hover:underline">Privacy Policy</a>.</p>
        </div>
      </div>
    </div>
  </div>
)