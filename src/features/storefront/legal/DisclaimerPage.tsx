import { Container } from '../../../components/layout/Container/Container';
import './Legal.css';

export function DisclaimerPage() {
  return (
    <Container className="legal-page">
      <h1 className="heading-4xl">Medical Disclaimer</h1>
      <p className="text-secondary text-sm mb-8">Last updated: {new Date().toLocaleDateString()}</p>
      
      <div className="legal-content">
        <section>
          <h2>Not Medical Advice</h2>
          <p>
            The information provided on the VELURA website, including text, graphics, images, and other material contained on the website, is for informational and educational purposes only. It is not intended to be a substitute for professional medical advice, diagnosis, or treatment.
          </p>
          <p>
            Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition or before starting to use any intimate wellness products, especially if you have pre-existing health conditions or are pregnant.
          </p>
        </section>

        <section>
          <h2>Product Use</h2>
          <p>
            VELURA products are sold as adult novelty items. They are intended for personal use by adults. Discontinue use immediately and consult a healthcare professional if you experience any pain, discomfort, or irritation while using our products.
          </p>
        </section>

        <section>
          <h2>Hygiene and Safety</h2>
          <p>
            Proper hygiene is essential when using intimate products. Always clean your products before and after each use according to the manufacturer's instructions. Do not share intimate products to prevent the transmission of infections.
          </p>
        </section>
      </div>
    </Container>
  );
}
