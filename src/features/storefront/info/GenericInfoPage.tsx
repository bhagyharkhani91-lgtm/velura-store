import { Container } from '../../../components/layout/Container/Container';

interface GenericInfoPageProps {
  title: string;
}

export function GenericInfoPage({ title }: GenericInfoPageProps) {
  return (
    <Container style={{ paddingTop: '100px', paddingBottom: '100px', minHeight: '60vh' }}>
      <h1 className="heading-4xl mb-4">{title}</h1>
      <p className="text-secondary text-lg">This page is under construction.</p>
    </Container>
  );
}
