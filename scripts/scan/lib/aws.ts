import {
  STSClient,
  AssumeRoleCommand,
  GetCallerIdentityCommand,
} from '@aws-sdk/client-sts';
import { EC2Client } from '@aws-sdk/client-ec2';
import { RDSClient } from '@aws-sdk/client-rds';
import { CloudWatchClient } from '@aws-sdk/client-cloudwatch';
import { CloudWatchLogsClient } from '@aws-sdk/client-cloudwatch-logs';
import { CostExplorerClient } from '@aws-sdk/client-cost-explorer';

export interface AssumedCredentials {
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken: string;
  expiration: Date;
  /** The account ID we just assumed INTO (the customer's account). */
  accountId: string;
}

/**
 * Assume a customer's IAM role using their External ID.
 * Uses ambient credentials (env / ~/.aws/credentials) as the source.
 */
export async function assumeCustomerRole(args: {
  roleArn: string;
  externalId: string;
  sessionName?: string;
}): Promise<AssumedCredentials> {
  const sts = new STSClient({});

  const result = await sts.send(
    new AssumeRoleCommand({
      RoleArn: args.roleArn,
      ExternalId: args.externalId,
      RoleSessionName: args.sessionName ?? `signal-scan-${Date.now()}`,
      DurationSeconds: 3600,
    }),
  );

  if (
    !result.Credentials ||
    !result.Credentials.AccessKeyId ||
    !result.Credentials.SecretAccessKey ||
    !result.Credentials.SessionToken ||
    !result.Credentials.Expiration
  ) {
    throw new Error('AssumeRole returned no credentials.');
  }

  // Resolve the account ID from the assumed role's identity.
  const assumedSts = new STSClient({
    credentials: {
      accessKeyId: result.Credentials.AccessKeyId,
      secretAccessKey: result.Credentials.SecretAccessKey,
      sessionToken: result.Credentials.SessionToken,
    },
  });
  const identity = await assumedSts.send(new GetCallerIdentityCommand({}));
  if (!identity.Account) {
    throw new Error('Could not resolve account ID from assumed credentials.');
  }

  return {
    accessKeyId: result.Credentials.AccessKeyId,
    secretAccessKey: result.Credentials.SecretAccessKey,
    sessionToken: result.Credentials.SessionToken,
    expiration: result.Credentials.Expiration,
    accountId: identity.Account,
  };
}

function credsFor(creds: AssumedCredentials) {
  return {
    accessKeyId: creds.accessKeyId,
    secretAccessKey: creds.secretAccessKey,
    sessionToken: creds.sessionToken,
  };
}

export function ec2ClientFor(
  creds: AssumedCredentials,
  region: string,
): EC2Client {
  return new EC2Client({ region, credentials: credsFor(creds) });
}

export function rdsClientFor(
  creds: AssumedCredentials,
  region: string,
): RDSClient {
  return new RDSClient({ region, credentials: credsFor(creds) });
}

export function cloudwatchClientFor(
  creds: AssumedCredentials,
  region: string,
): CloudWatchClient {
  return new CloudWatchClient({ region, credentials: credsFor(creds) });
}

export function cloudwatchLogsClientFor(
  creds: AssumedCredentials,
  region: string,
): CloudWatchLogsClient {
  return new CloudWatchLogsClient({ region, credentials: credsFor(creds) });
}

/**
 * Cost Explorer is a global service — only callable via us-east-1.
 * No region argument: we hardcode it.
 */
export function costExplorerClientFor(
  creds: AssumedCredentials,
): CostExplorerClient {
  return new CostExplorerClient({
    region: 'us-east-1',
    credentials: credsFor(creds),
  });
}
