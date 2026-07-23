import { Container } from '../../../components/layout/Container/Container';
import './Legal.css';

export function TermsPage() {
  return (
    <Container className="legal-page">
      <h1 className="heading-4xl">Terms of Service</h1>
      <p className="text-secondary text-sm mb-8">Last updated: {new Date().toLocaleDateString()}</p>
      
      <div className="legal-content">
        <section>
          <h2>1. Agreement to Terms</h2>
          <p>
            By accessing this website, you agree to be bound by these Terms of Service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
          </p>
        </section>

        <section>
          <h2>2. Age Restriction</h2>
          <p>
            You must be at least 18 years of age (or the age of majority in your jurisdiction) to use this website and purchase our products. By agreeing to these Terms of Service, you represent that you are at least the age of majority in your state or province of residence.
          </p>
        </section>

        <section>
          <h2>3. Products and Pricing</h2>
          <p>
            All products are subject to availability. We reserve the right to discontinue any product at any time. Prices for our products are subject to change without notice. We reserve the right to modify or discontinue the Service (or any part or content thereof) without notice at any time.
          </p>
        </section>

        <section>
          <h2>4. Accuracy of Billing and Account Information</h2>
          <p>
            We reserve the right to refuse any order you place with us. We may, in our sole discretion, limit or cancel quantities purchased per person, per household or per order. You agree to provide current, complete and accurate purchase and account information for all purchases made at our store.
          </p>
        </section>

        <section>
          <h2>5. Returns and Refunds</h2>
          <p>
            For health and hygiene reasons, we only accept returns on unopened and unused items within 30 days of delivery, or for defective products under warranty. Please refer to our Shipping & Returns policy for full details.
          </p>
        </section>
      </div>
    </Container>
  );
}
