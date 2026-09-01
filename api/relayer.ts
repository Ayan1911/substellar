import type { VercelRequest, VercelResponse } from '@vercel/node';
import { runBillingRelayerJob } from '../relayer/index';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Authorization header check for Vercel Cron or Serverless trigger
  const authHeader = req.headers['authorization'];
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized Cron Trigger' });
  }

  const result = await runBillingRelayerJob();
  if (result.success) {
    return res.status(200).json(result);
  } else {
    return res.status(500).json(result);
  }
}
