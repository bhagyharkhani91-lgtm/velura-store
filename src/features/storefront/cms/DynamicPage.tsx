import { useParams } from 'react-router-dom';
import { useCMSStore } from '../../../stores/cmsStore';
import { Container } from '../../../components/layout/Container/Container';
import { ErrorElement } from '../../../components/layout/ErrorElement/ErrorElement';
import './DynamicPage.css'; // We will create this for basic prose styling

export function DynamicPage() {
  const { pageSlug } = useParams<{ pageSlug: string }>();
  const { getPageBySlug } = useCMSStore();
  
  const page = getPageBySlug(pageSlug || '');

  if (!page || !page.isPublished) {
    return <ErrorElement />;
  }

  return (
    <div className="dynamic-page py-16 min-h-[60vh]">
      <Container>
        <div className="prose max-w-3xl mx-auto">
          {/* Dangerously setting inner HTML since this comes from our admin CMS */}
          <div dangerouslySetInnerHTML={{ __html: page.content }} />
        </div>
      </Container>
    </div>
  );
}
