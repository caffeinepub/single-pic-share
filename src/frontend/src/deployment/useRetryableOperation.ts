/**
 * React hook for retryable deployment operations with state management.
 */

import { useState, useCallback } from 'react';
import { classifyFailure, FailureClassification } from './classifyFailure';
import { formatDeploymentError, FormattedError } from './formatDeploymentError';

export type OperationState = 'idle' | 'running' | 'succeeded' | 'failed';

export interface RetryableOperationResult<T> {
  state: OperationState;
  data: T | null;
  error: Error | null;
  classification: FailureClassification | null;
  formattedError: FormattedError | null;
  execute: () => Promise<void>;
  retry: () => Promise<void>;
  reset: () => void;
}

/**
 * Hook that wraps an async operation with retry support and error classification.
 * Preserves the same inputs between attempts and provides detailed state tracking.
 */
export function useRetryableOperation<T>(
  operation: () => Promise<T>
): RetryableOperationResult<T> {
  const [state, setState] = useState<OperationState>('idle');
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [classification, setClassification] = useState<FailureClassification | null>(null);
  const [formattedError, setFormattedError] = useState<FormattedError | null>(null);

  const execute = useCallback(async () => {
    setState('running');
    setError(null);
    setClassification(null);
    setFormattedError(null);

    try {
      const result = await operation();
      setData(result);
      setState('succeeded');
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj);
      
      // Classify and format the error
      const errorClassification = classifyFailure(errorObj);
      const formatted = formatDeploymentError(errorClassification);
      
      setClassification(errorClassification);
      setFormattedError(formatted);
      setState('failed');
    }
  }, [operation]);

  const retry = useCallback(async () => {
    // Retry uses the same operation with the same inputs
    await execute();
  }, [execute]);

  const reset = useCallback(() => {
    setState('idle');
    setData(null);
    setError(null);
    setClassification(null);
    setFormattedError(null);
  }, []);

  return {
    state,
    data,
    error,
    classification,
    formattedError,
    execute,
    retry,
    reset,
  };
}
