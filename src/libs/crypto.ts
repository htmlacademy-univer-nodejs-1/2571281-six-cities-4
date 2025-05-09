import crypto from 'node:crypto';

export function createSHA256(payload: string, salt: string): string {
  return crypto
    .createHmac('sha256', salt)
    .update(payload)
    .digest('hex');
}
