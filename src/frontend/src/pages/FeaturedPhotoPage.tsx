import { DeployRetryPanel } from '../components/DeployRetryPanel';

export default function FeaturedPhotoPage() {
  // Check if deploy panel should be shown via query parameter
  const params = new URLSearchParams(window.location.search);
  const showDeployPanel = params.get('deploy') === 'true';

  if (showDeployPanel) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <DeployRetryPanel />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden">
      <img
        src="/assets/Screenshot_20260218_094707~2.jpg"
        alt="Sunflowers birthday card for Amruta"
        className="w-full h-full object-cover"
        loading="eager"
      />
    </div>
  );
}
