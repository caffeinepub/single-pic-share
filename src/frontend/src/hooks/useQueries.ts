import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';

/**
 * Example query hook for testing deployment error handling.
 * This demonstrates how to integrate the backend's handleError method.
 */
export function useTestDeploymentError(errorMessage: string, enabled: boolean = false) {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['test-deployment-error', errorMessage],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.handleError(errorMessage);
      return { success: true };
    },
    enabled: !!actor && !isFetching && enabled,
    retry: false,
  });
}
