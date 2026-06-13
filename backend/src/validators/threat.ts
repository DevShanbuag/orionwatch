import { z } from 'zod';

export const threatIdSchema = z.string().min(1, 'Threat ID is required');

export const threatDataSchema = z.object({
  indicator: z.string().min(1, 'Indicator is required'),
  severity: z.enum(['Critical', 'High', 'Medium', 'Low']).optional(),
}).partial();

export type ThreatIdInput = z.infer<typeof threatIdSchema>;
export type ThreatDataInput = z.infer<typeof threatDataSchema>;

