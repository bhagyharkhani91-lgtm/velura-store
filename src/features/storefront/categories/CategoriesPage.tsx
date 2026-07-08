import { Container } from '../../../components/layout/Container/Container';

export function CategoriesPage() {
  return (
    <Container style={{ paddingTop: '100px', paddingBottom: '100px', minHeight: '60vh' }}>
      <h1 className="heading-4xl mb-4">Categories</h1>
      <p className="text-secondary text-lg">Explore by category.</p>
    </Container>
  );
}
