/**
 * Formats deployment errors into human-readable, actionable messages.
 */

import { FailureClassification } from './classifyFailure';

export interface FormattedError {
  title: string;
  description: string;
  actionMessage: string;
  technicalDetails: string;
}

/**
 * Converts a classified failure into a user-friendly error message
 * with clear next steps and reassurance about retry safety.
 */
export function formatDeploymentError(classification: FailureClassification): FormattedError {
  const { category, isSafeToRetry, originalError } = classification;

  switch (category) {
    case 'network':
      return {
        title: 'Network Connection Issue',
        description:
          'The deployment failed due to a network connectivity problem. This is usually a temporary issue with the Internet Computer network or your internet connection.',
        actionMessage: isSafeToRetry
          ? 'You can safely retry this deployment. Retrying will not change your application functionality or data.'
          : 'Please check your network connection and try again later.',
        technicalDetails: originalError,
      };

    case 'deploy':
      return {
        title: 'Deployment Step Failed',
        description:
          'The deployment process encountered an issue while deploying to the Internet Computer. This could be related to canister management, wallet configuration, or deployment infrastructure.',
        actionMessage: isSafeToRetry
          ? 'You can safely retry this deployment. Retrying will not change your application functionality or data.'
          : 'Please review the deployment configuration and try again.',
        technicalDetails: originalError,
      };

    case 'build':
      return {
        title: 'Build Failed',
        description:
          'The deployment failed during the build step. This typically indicates a code compilation or bundling issue that needs to be fixed before deployment can succeed.',
        actionMessage:
          'Please review the build diagnostics below and fix any code issues before retrying.',
        technicalDetails: originalError,
      };

    case 'parsing':
      return {
        title: 'Message Parsing Error',
        description:
          'The system encountered an error while parsing the deployment response. This may indicate an unexpected format in the deployment process output.',
        actionMessage:
          'Please ensure the deployment message format is correct. If this persists, contact support.',
        technicalDetails: originalError,
      };

    case 'unknown':
    default:
      return {
        title: 'Unexpected Error',
        description:
          'An unexpected error occurred during deployment. The system could not automatically classify this error.',
        actionMessage: isSafeToRetry
          ? 'You can try retrying this deployment. If the issue persists, please contact support with the technical details below.'
          : 'Please contact support with the technical details below.',
        technicalDetails: originalError,
      };
  }
}
