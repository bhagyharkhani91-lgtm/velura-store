import { useParams } from 'react-router-dom';
import { useCMSStore } from '../../../stores/cmsStore';
import { Container } from '../../../components/layout/Container/Container';
import { ErrorElement } from '../../../components/layout/ErrorElement/ErrorElement';
import DOMPurify from 'dompurify';
import './DynamicPage.css'; // We will create this for basic prose styling

export function DynamicPage() {
  const { pageSlug } = useParams<{ pageSlug: string }>();
  const { getPageBySlug } = useCMSStore();
  
  const page = getPageBySlug(pageSlug || '');

  if (!page || !page.isPublished) {
    return <ErrorElement />;
  }

  const sanitizedContent = DOMPurify.sanitize(page.content);

  return (
    <div className="dynamic-page py-16 min-h-[60vh]">
      <Container>
        <div className="prose max-w-3xl mx-auto">
          {/* Dangerously setting inner HTML after strict sanitization */}
          <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
        </div>
      </Container>
    </div>
  );
}
