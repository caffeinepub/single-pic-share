/**
 * Classifies deployment failures into categories and determines if retry is safe.
 */

export type FailureCategory = 'build' | 'deploy' | 'network' | 'parsing' | 'unknown';

export interface FailureClassification {
  category: FailureCategory;
  isSafeToRetry: boolean;
  originalError: string;
}

/**
 * Analyzes an error and classifies it into a failure category.
 * Returns whether the failure is likely transient and safe to retry.
 */
export function classifyFailure(error: unknown): FailureClassification {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const lowerMessage = errorMessage.toLowerCase();

  // Check for parsing errors
  if (lowerMessage.includes('parsing') || lowerMessage.includes('parse')) {
    return {
      category: 'parsing',
      isSafeToRetry: false,
      originalError: errorMessage,
    };
  }

  // Check for build errors
  if (lowerMessage.includes('build') || lowerMessage.includes('compilation')) {
    return {
      category: 'build',
      isSafeToRetry: false,
      originalError: errorMessage,
    };
  }

  // Check for deployment errors (canister, wallet, legacy)
  if (
    lowerMessage.includes('canister') ||
    lowerMessage.includes('wallet') ||
    lowerMessage.includes('legacy') ||
    lowerMessage.includes('deploy')
  ) {
    return {
      category: 'deploy',
      isSafeToRetry: true,
      originalError: errorMessage,
    };
  }

  // Check for network errors (most likely to be transient)
  if (
    lowerMessage.includes('network') ||
    lowerMessage.includes('timeout') ||
    lowerMessage.includes('connection') ||
    lowerMessage.includes('no response') ||
    lowerMessage.includes('subnet') ||
    lowerMessage.includes('fetch')
  ) {
    return {
      category: 'network',
      isSafeToRetry: true,
      originalError: errorMessage,
    };
  }

  // Unknown error - be conservative and allow retry
  return {
    category: 'unknown',
    isSafeToRetry: true,
    originalError: errorMessage,
  };
}
