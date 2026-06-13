import { z } from 'zod';

// URL validation schema - allows only http/https, trims whitespace, rejects javascript:/data:/file: etc.
export const urlSchema = z.string()
  .trim()
  .refine((url) => {
    try {
      const parsedUrl = new URL(url);
      // Only allow http/https protocols
      return ['http:', 'https:'].includes(parsedUrl.protocol);
    } catch {
      return false;
    }
  }, 'Invalid URL format - only http/https URLs are allowed');

export const urlSearchSchema = z.object({
  url: urlSchema,
});

export type UrlSearchInput = z.infer<typeof urlSearchSchema>;

