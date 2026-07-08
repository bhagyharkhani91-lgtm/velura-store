import { Container } from '../../../components/layout/Container/Container';
import './Info.css';

export function FAQPage() {
  const faqs = [
    {
      question: "Is the packaging discreet?",
      answer: "Yes, 100%. We understand the importance of privacy. All orders are shipped in plain, unmarked brown boxes or standard courier satchels. There are no logos, branding, or product descriptions on the outside of the package. The return address and billing name will appear as our discreet corporate entity."
    },
    {
      question: "What will show up on my bank statement?",
      answer: "Your privacy is guaranteed. The charge on your credit card or bank statement will appear under our discreet parent company name, not 'Naughty Nights'."
    },
    {
      question: "Do you offer Cash on Delivery (COD)?",
      answer: "Yes, we offer Cash on Delivery for select locations. You can choose this option during checkout if it is available for your pin code."
    },
    {
      question: "How long does shipping take?",
      answer: "Orders are typically processed within 24 hours. Standard shipping takes 3-5 business days depending on your location. We also offer expedited shipping options at checkout for faster delivery."
    },
    {
      question: "What is your return policy?",
      answer: "Due to the intimate nature of our products and strict hygiene standards, we only accept returns for items that are unopened, unused, and in their original sealed packaging within 14 days of delivery. If you receive a defective item, please contact our support team immediately for a replacement."
    },
    {
      question: "Are your products safe and body-safe?",
      answer: "Absolutely. We only stock premium products made from body-safe materials like medical-grade silicone, ABS plastic, and glass. We do not sell products containing phthalates or harmful chemicals."
    }
  ];

  return (
    <Container className="info-page">
      <h1 className="heading-4xl mb-12 text-center">Frequently Asked Questions</h1>
      
      <div className="faq-container">
        {faqs.map((faq, index) => (
          <details key={index} className="faq-item">
            <summary className="faq-question">
              {faq.question}
              <span className="faq-icon">+</span>
            </summary>
            <div className="faq-answer">
              <p>{faq.answer}</p>
            </div>
          </details>
        ))}
      </div>
      
      <div className="faq-contact">
        <h2 className="heading-2xl mb-4">Still have questions?</h2>
        <p className="text-secondary mb-6">Our experts are here to help. Reach out to us anytime.</p>
        <button className="navbar-search-btn" style={{ padding: 'var(--space-3) var(--space-8)', borderRadius: 'var(--radius-md)' }}>
          Contact Support
        </button>
      </div>
    </Container>
  );
}
