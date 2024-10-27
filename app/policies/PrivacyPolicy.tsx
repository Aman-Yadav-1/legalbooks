import React from 'react'

export const PrivacyPolicy: React.FC = () => (
  <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen font-sans text-gray-700">
    <div className="container mx-auto px-4 py-12 max-w-4xl">
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-6 px-8 mb-[-1%] rounded-t-lg">
        <h1 className="text-3xl font-extrabold text-white text-center">Privacy Policy</h1>
      </div>
      
      <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-200">
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 border-b pb-2 border-gray-200">1. Introduction</h2>
          <p className="text-base leading-relaxed">
            Welcome to LegalBooks. We value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you purchase and download digital documents from our platform.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 border-b pb-2 border-gray-200">2. Information We Collect</h2>
          <h3 className="text-xl font-medium mb-3 text-gray-800">2.1 Personal Information:</h3>
          <ul className="list-disc pl-6 mb-5 text-base space-y-2">
            <li>Account Information: When you create an account or make a purchase, we collect personal details such as your name, email address, and payment information.</li>
            <li>Transaction Data: Details of your purchases, including payment history and transaction IDs.</li>
          </ul>
          <h3 className="text-xl font-medium mb-3 text-gray-800">2.2 Usage Data:</h3>
          <ul className="list-disc pl-6 text-base space-y-2">
            <li>Activity Data: Information about your interactions with our website, such as browsing history, download activity, and IP address.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 border-b pb-2 border-gray-200">3. How We Use Your Information</h2>
          <h3 className="text-xl font-medium mb-3 text-gray-800">3.1 To Provide Services:</h3>
          <ul className="list-disc pl-6 mb-5 text-base space-y-2">
            <li>Order Processing: To process your orders and deliver digital documents.</li>
            <li>Customer Support: To respond to your inquiries, provide support, and resolve any issues related to your purchase.</li>
          </ul>
          <h3 className="text-xl font-medium mb-3 text-gray-800">3.2 To Improve Our Services:</h3>
          <ul className="list-disc pl-6 mb-5 text-base space-y-2">
            <li>Analytics: To analyze usage patterns and improve the functionality and content of our website.</li>
          </ul>
          <h3 className="text-xl font-medium mb-3 text-gray-800">3.3 Marketing and Communications:</h3>
          <ul className="list-disc pl-6 text-base space-y-2">
            <li>Promotional Emails: With your consent, we may send you promotional materials, updates, and newsletters. You can opt out of these communications at any time.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 border-b pb-2 border-gray-200">4. How We Protect Your Information</h2>
          <h3 className="text-xl font-medium mb-3 text-gray-800">4.1 Security Measures:</h3>
          <ul className="list-disc pl-6 mb-5 text-base space-y-2">
            <li>Data Encryption: We use industry-standard encryption to protect your personal and payment information during transmission.</li>
            <li>Access Controls: We implement access controls to ensure that only authorized personnel can access your personal information.</li>
          </ul>
          <h3 className="text-xl font-medium mb-3 text-gray-800">4.2 Data Retention:</h3>
          <ul className="list-disc pl-6 text-base space-y-2">
            <li>Retention Period: We retain personal information only as long as necessary to fulfill the purposes outlined in this Privacy Policy or as required by law.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 border-b pb-2 border-gray-200">5. Sharing Your Information</h2>
          <h3 className="text-xl font-medium mb-3 text-gray-800">5.1 Third-Party Service Providers:</h3>
          <ul className="list-disc pl-6 mb-5 text-base space-y-2">
            <li>Payment Processors: We share your payment information with third-party payment processors to complete transactions.</li>
            <li>Analytics Providers: We may use third-party analytics tools to collect and analyze usage data.</li>
          </ul>
          <h3 className="text-xl font-medium mb-3 text-gray-800">5.2 Legal Requirements:</h3>
          <ul className="list-disc pl-6 text-base space-y-2">
            <li>Compliance: We may disclose your information if required by law or in response to legal processes.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 border-b pb-2 border-gray-200">6. Your Rights</h2>
          <h3 className="text-xl font-medium mb-3 text-gray-800">6.1 Access and Correction:</h3>
          <ul className="list-disc pl-6 mb-5 text-base space-y-2">
            <li>Request Access: You have the right to request access to the personal information we hold about you and to request corrections if necessary.</li>
          </ul>
          <h3 className="text-xl font-medium mb-3 text-gray-800">6.2 Data Deletion:</h3>
          <ul className="list-disc pl-6 mb-5 text-base space-y-2">
            <li>Request Deletion: You may request the deletion of your personal information, subject to legal and contractual obligations.</li>
          </ul>
          <h3 className="text-xl font-medium mb-3 text-gray-800">6.3 Opt-Out:</h3>
          <ul className="list-disc pl-6 text-base space-y-2">
            <li>Marketing Communications: You can opt out of receiving marketing communications by following the unsubscribe instructions in the email or contacting us directly.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 border-b pb-2 border-gray-200">7. Cookies and Tracking Technologies</h2>
          <h3 className="text-xl font-medium mb-3 text-gray-800">7.1 Cookies:</h3>
          <ul className="list-disc pl-6 mb-5 text-base space-y-2">
            <li>Usage: We use cookies and similar tracking technologies to enhance your experience on our website, analyze usage, and personalize content.</li>
          </ul>
          <h3 className="text-xl font-medium mb-3 text-gray-800">7.2 Control:</h3>
          <ul className="list-disc pl-6 text-base space-y-2">
            <li>Cookie Settings: You can control cookie preferences through your browser settings. Please note that disabling cookies may affect the functionality of our website.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 border-b pb-2 border-gray-200">8. Third-Party Links</h2>
          <p className="text-base leading-relaxed">
            Our website may contain links to third-party sites. We are not responsible for the privacy practices or content of these third-party sites. We encourage you to review their privacy policies before providing any personal information.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 border-b pb-2 border-gray-200">9. Changes to This Privacy Policy</h2>
          <p className="text-base leading-relaxed">
            We may update this Privacy Policy from time to time. Any changes will be posted on our website with an updated effective date. Your continued use of our services constitutes acceptance of the revised policy.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 border-b pb-2 border-gray-200">10. Contact Us</h2>
          <p className="text-base leading-relaxed mb-4">If you have any questions or concerns about this Privacy Policy, please contact us at:</p>
          <p className="text-base mb-2">Email: <a href="mailto:support@legalbooks.in" className="text-blue-600 hover:text-blue-800 transition duration-300 ease-in-out">support@legalbooks.in</a></p>
          <p className="text-base mb-2">Phone: <span className="font-medium">9440142156</span></p>
          <p className="text-base">Address: <span className="font-medium">Plot No 1- Sheshachalam Colony, West Marredpally, Hyderabad, Telangana - 500026</span></p>
        </section>
      </div>
    </div>
  </div>
)