import { Container } from '../../../components/layout/Container/Container';
import './Legal.css';

export function PrivacyPage() {
  return (
    <Container className="legal-page">
      <h1 className="heading-4xl">Privacy Policy</h1>
      <p className="text-secondary text-sm mb-8">Last updated: {new Date().toLocaleDateString()}</p>
      
      <div className="legal-content">
        <section>
          <h2>1. Introduction</h2>
          <p>
            At PERSONAL CARE, we take your privacy extremely seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make a purchase.
          </p>
        </section>

        <section>
          <h2>2. Private Billing and Shipping</h2>
          <p>
            Your privacy is our top priority. All charges on your credit card statement will appear under our corporate name. All packages are shipped in plain, unmarked boxes with no logos or descriptions of the contents on the outside.
          </p>
        </section>

        <section>
          <h2>3. Information We Collect</h2>
          <p>We may collect information about you in a variety of ways, including:</p>
          <ul>
            <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, shipping address, email address, and telephone number, which you voluntarily give to us when you register or make a purchase.</li>
            <li><strong>Financial Data:</strong> Data related to your payment method (e.g., valid credit card number, card brand, expiration date) that we may collect when you purchase our products. Payment information is processed securely by our payment gateway providers.</li>
          </ul>
        </section>

        <section>
          <h2>4. Use of Your Information</h2>
          <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you to:</p>
          <ul>
            <li>Fulfill and manage purchases, orders, payments, and other transactions.</li>
            <li>Deliver targeted advertising, newsletters, and other information (if you have opted in).</li>
            <li>Improve our website and your shopping experience.</li>
          </ul>
        </section>

        <section>
          <h2>5. Data Security</h2>
          <p>
            We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.
          </p>
        </section>
      </div>
    </Container>
  );
}
