import { Container } from '../../../components/layout/Container/Container';
import { useSettingsStore } from '../../../stores/settingsStore';

interface GenericInfoPageProps {
  title: string;
}

export function GenericInfoPage({ title }: GenericInfoPageProps) {
  const { returnPolicy } = useSettingsStore();

  return (
    <Container style={{ paddingTop: '100px', paddingBottom: '100px', minHeight: '60vh' }}>
      <h1 className="heading-4xl mb-8">{title}</h1>
      {title === "Return and Exchange Policy" ? (
        <div className="text-secondary text-lg whitespace-pre-wrap max-w-4xl leading-relaxed">
          {returnPolicy || "No return policy has been configured yet."}
        </div>
      ) : (
        <p className="text-secondary text-lg">This page is under construction.</p>
      )}
    </Container>
  );
}
