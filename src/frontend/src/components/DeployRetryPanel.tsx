/**
 * UI panel for triggering deployment operations with retry support.
 * Displays actionable error messages and retry controls on failure.
 */

import { useRetryableOperation } from '../deployment/useRetryableOperation';
import { Button } from './ui/button';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { AlertCircle, CheckCircle2, Loader2, RefreshCw } from 'lucide-react';
import { useActor } from '../hooks/useActor';

export function DeployRetryPanel() {
  const { actor } = useActor();

  // Simulated deployment operation that calls the backend error handler
  const deployOperation = async () => {
    if (!actor) {
      throw new Error('Backend actor not initialized');
    }

    // Simulate a deployment attempt by calling the backend with a test error
    // In a real scenario, this would be replaced with actual deployment logic
    const testError = 'network timeout: no response from subnet';
    await actor.handleError(testError);
  };

  const { state, formattedError, classification, execute, retry, reset } =
    useRetryableOperation(deployOperation);

  const isRunning = state === 'running';
  const isSuccess = state === 'succeeded';
  const isFailed = state === 'failed';
  const isIdle = state === 'idle';

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Deployment Control Panel</CardTitle>
        <CardDescription>
          Test deployment retry functionality with error classification and actionable feedback.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Action Buttons */}
        <div className="flex gap-2">
          {isIdle && (
            <Button onClick={execute} disabled={isRunning}>
              {isRunning && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Start Deployment
            </Button>
          )}

          {isFailed && classification?.isSafeToRetry && (
            <Button onClick={retry} disabled={isRunning} variant="default">
              {isRunning ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Retry Deployment
            </Button>
          )}

          {(isSuccess || isFailed) && (
            <Button onClick={reset} variant="outline" disabled={isRunning}>
              Reset
            </Button>
          )}
        </div>

        {/* Success State */}
        {isSuccess && (
          <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertTitle className="text-green-800 dark:text-green-200">
              Deployment Successful
            </AlertTitle>
            <AlertDescription className="text-green-700 dark:text-green-300">
              Your deployment completed successfully. No changes were made to your application
              functionality or data.
            </AlertDescription>
          </Alert>
        )}

        {/* Error State */}
        {isFailed && formattedError && (
          <div className="space-y-3">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{formattedError.title}</AlertTitle>
              <AlertDescription className="mt-2 space-y-2">
                <p>{formattedError.description}</p>
                <p className="font-medium">{formattedError.actionMessage}</p>
              </AlertDescription>
            </Alert>

            {/* Technical Details */}
            <details className="rounded-lg border border-border bg-muted/50 p-4">
              <summary className="cursor-pointer font-medium text-sm">
                Technical Details
              </summary>
              <div className="mt-2 space-y-2 text-sm">
                <div>
                  <span className="font-medium">Error Category:</span>{' '}
                  <span className="font-mono">{classification?.category}</span>
                </div>
                <div>
                  <span className="font-medium">Safe to Retry:</span>{' '}
                  <span className="font-mono">
                    {classification?.isSafeToRetry ? 'Yes' : 'No'}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Raw Error:</span>
                  <pre className="mt-1 overflow-x-auto rounded bg-muted p-2 text-xs">
                    {formattedError.technicalDetails}
                  </pre>
                </div>
              </div>
            </details>
          </div>
        )}

        {/* Running State */}
        {isRunning && (
          <Alert>
            <Loader2 className="h-4 w-4 animate-spin" />
            <AlertTitle>Deployment in Progress</AlertTitle>
            <AlertDescription>
              Please wait while the deployment operation completes...
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
