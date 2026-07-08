import { Container } from '../../layout/Container/Container';
import './BrandsBanner.css';

const brands = [
  'Blush',
  'Galaku',
  'Magic Motion',
  'Leten',
  'Meese',
  'Satisfyer',
  'J-Hande',
  'Calmras'
];

export function BrandsBanner() {
  return (
    <section className="brands-section">
      <Container>
        <h2 className="brands-title">BRANDS THAT WE CARRY</h2>
        <div className="brands-list">
          {brands.map((brand, idx) => (
            <div key={idx} className="brand-logo-placeholder">
              {brand}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
