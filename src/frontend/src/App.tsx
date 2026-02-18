import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import FeaturedPhotoPage from './pages/FeaturedPhotoPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <FeaturedPhotoPage />
    </QueryClientProvider>
  );
}

export default App;
