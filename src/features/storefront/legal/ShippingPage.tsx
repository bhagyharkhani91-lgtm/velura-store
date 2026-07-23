import { Container } from '../../../components/layout/Container/Container';
import { Truck, RotateCcw, ShieldCheck, Clock, Package, AlertTriangle } from 'lucide-react';
import '../info/Info.css';
import './Legal.css';

export function ShippingPage() {
  return (
    <Container className="info-page">
      <h1 className="heading-4xl mb-4 text-center">Shipping &amp; Returns</h1>
      <p className="text-secondary text-center mb-12" style={{ fontSize: 'var(--text-lg)' }}>
        Everything you need to know about receiving your order and our hassle-free returns.
      </p>

      {/* Highlights */}
      <div className="legal-highlights">
        <div className="legal-highlight-card">
          <Truck size={28} className="legal-highlight-icon" />
          <h3>Discreet Shipping</h3>
          <p>Plain unmarked packaging for your privacy. No branding or product details on the outside.</p>
        </div>
        <div className="legal-highlight-card">
          <Clock size={28} className="legal-highlight-icon" />
          <h3>Fast Processing</h3>
          <p>Orders processed within 24 hours. Delivered in 3–7 business days.</p>
        </div>
        <div className="legal-highlight-card">
          <RotateCcw size={28} className="legal-highlight-icon" />
          <h3>Easy Returns</h3>
          <p>Unopened items returnable within 14 days of delivery.</p>
        </div>
        <div className="legal-highlight-card">
          <ShieldCheck size={28} className="legal-highlight-icon" />
          <h3>Secure Billing</h3>
          <p>Discreet charge descriptor on your bank statement.</p>
        </div>
      </div>

      {/* Shipping Policy */}
      <section className="legal-section">
        <div className="legal-section-header">
          <Package size={22} className="legal-section-icon" />
          <h2 className="heading-2xl">Shipping Policy</h2>
        </div>

        <div className="legal-block">
          <h3>Processing Time</h3>
          <p>All orders are processed within <strong>1–2 business days</strong> (Monday–Saturday, excluding public holidays) after payment is confirmed. You will receive an email confirmation with a tracking number once your order has been dispatched.</p>
        </div>

        <div className="legal-block">
          <h3>Shipping Options &amp; Estimated Delivery</h3>
          <table className="legal-table">
            <thead>
              <tr>
                <th>Shipping Method</th>
                <th>Estimated Delivery</th>
                <th>Cost</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Standard Shipping</td>
                <td>5–7 Business Days</td>
                <td>₹99</td>
              </tr>
              <tr>
                <td>Express Shipping</td>
                <td>2–3 Business Days</td>
                <td>₹199</td>
              </tr>
              <tr>
                <td>Same-Day Delivery</td>
                <td>Same Day (select cities)</td>
                <td>₹299</td>
              </tr>
              <tr>
                <td>Free Shipping</td>
                <td>5–7 Business Days</td>
                <td>Free on orders above ₹999</td>
              </tr>
            </tbody>
          </table>
          <p className="legal-note">Delivery timelines are estimates and may vary during peak seasons, public holidays, or due to unforeseen courier delays.</p>
        </div>

        <div className="legal-block">
          <h3>Discreet Packaging</h3>
          <p>We take your privacy seriously. Every order is shipped in a <strong>plain, unmarked brown box or standard courier satchel</strong>. There are no brand names, logos, or product descriptions on the outside of the package. The sender name on the shipping label will appear as our corporate name.</p>
        </div>

        <div className="legal-block">
          <h3>Discreet Billing</h3>
          <p>The charge on your credit card or bank statement will appear under our corporate entity name — <strong>not</strong> any product-related name — to ensure complete privacy.</p>
        </div>

        <div className="legal-block">
          <h3>Cash on Delivery (COD)</h3>
          <p>We offer <strong>Cash on Delivery</strong> for select pin codes. This option will be shown at checkout if it is available for your delivery address. Please note that COD orders may take an additional 1–2 business days to process.</p>
        </div>

        <div className="legal-block">
          <h3>International Shipping</h3>
          <p>Currently, we only ship within India. We are working on expanding our delivery to international destinations. Stay tuned for updates.</p>
        </div>
      </section>

      {/* Returns Policy */}
      <section className="legal-section">
        <div className="legal-section-header">
          <RotateCcw size={22} className="legal-section-icon" />
          <h2 className="heading-2xl">Returns &amp; Refunds Policy</h2>
        </div>

        <div className="legal-block">
          <h3>Eligibility for Returns</h3>
          <p>Due to the hygienic nature of our products, we can <strong>only accept returns</strong> under the following conditions:</p>
          <ul className="legal-list">
            <li>The item is <strong>unopened, unused, and in its original sealed packaging</strong>.</li>
            <li>The return request is initiated within <strong>14 days of delivery</strong>.</li>
            <li>The item is not listed as a non-returnable product (see below).</li>
          </ul>
        </div>

        <div className="legal-block">
          <h3>Non-Returnable Items</h3>
          <p>For hygiene and safety reasons, the following items <strong>cannot be returned or exchanged</strong> once opened:</p>
          <ul className="legal-list">
            <li>Personal massagers and insertable wellness devices.</li>
            <li>Lubricants, oils, and topical products.</li>
            <li>Apparel, bodysuits, and personal wear.</li>
            <li>Any item marked "Final Sale" or "Non-Returnable" on its product page.</li>
          </ul>
        </div>

        <div className="legal-block">
          <h3>Defective or Damaged Items</h3>
          <p>If you receive a <strong>defective, damaged, or incorrect item</strong>, please contact our support team within <strong>48 hours of delivery</strong> with your order number and clear photos of the issue. We will arrange for a free replacement or a full refund at no cost to you.</p>
        </div>

        <div className="legal-block">
          <h3>How to Initiate a Return</h3>
          <ol className="legal-list">
            <li>Email us at <strong>support@personalcare.in</strong> with your order number and reason for return.</li>
            <li>Our team will review your request within 1–2 business days and send you a return authorization.</li>
            <li>Pack the item securely in its original packaging and ship it using the provided return label.</li>
            <li>Once we receive and inspect the returned item, your refund will be processed within <strong>5–7 business days</strong>.</li>
          </ol>
        </div>

        <div className="legal-block">
          <h3>Refund Method</h3>
          <p>Approved refunds are issued to the <strong>original payment method</strong> used at checkout. If the original payment method is unavailable, we will issue store credit. Shipping charges are non-refundable unless the return is due to our error.</p>
        </div>

        <div className="legal-block legal-warning-block">
          <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
          <p><strong>Important:</strong> We reserve the right to refuse a return if the item shows signs of use, tampering, or damage not caused by our error. Returned items that do not meet our policy will be shipped back to the customer at their expense.</p>
        </div>
      </section>

      {/* Contact */}
      <div className="faq-contact">
        <h2 className="heading-2xl mb-4">Have a question about your order?</h2>
        <p className="text-secondary mb-6">Our support team is available Monday–Saturday, 10 AM – 7 PM IST.</p>
        <a href="mailto:support@personalcare.in" className="navbar-search-btn" style={{ padding: 'var(--space-3) var(--space-8)', borderRadius: 'var(--radius-md)', textDecoration: 'none', display: 'inline-block' }}>
          Contact Support
        </a>
      </div>
    </Container>
  );
}
