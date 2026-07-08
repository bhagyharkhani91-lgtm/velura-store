import { useRouteError, Link } from 'react-router-dom';
import { Container } from '../Container/Container';
import { Button } from '../../ui/Button/Button';

export function ErrorElement() {
  const error = useRouteError() as any;
  const is404 = error?.status === 404;

  return (
    <Container style={{ paddingTop: '100px', paddingBottom: '100px', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <h1 className="heading-6xl" style={{ marginBottom: 'var(--space-4)' }}>
        {is404 ? '404' : 'Oops!'}
      </h1>
      <h2 className="heading-2xl" style={{ marginBottom: 'var(--space-4)' }}>
        {is404 ? 'Page Not Found' : 'Something went wrong'}
      </h2>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-lg)', marginBottom: 'var(--space-8)' }}>
        {is404 
          ? "We couldn't find the page you're looking for. It might have been moved or doesn't exist." 
          : (error?.message || "An unexpected error occurred.")}
      </p>
      <Link to="/">
        <Button size="lg">Return Home</Button>
      </Link>
    </Container>
  );
}
