import { z } from 'zod';

// IPv4 address validation schema
export const ipv4AddressSchema = z.string().refine((ip) => {
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipv4Regex.test(ip);
}, 'Invalid IPv4 address format');

// IPv6 address validation schema
export const ipv6AddressSchema = z.string().refine((ip) => {
  const ipv6RegexSimple = /^(?:[0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$|^::$|^::1$/;
  return ipv6RegexSimple.test(ip);
}, 'Invalid IPv6 address format');

// Combined IP address validation (accepts either IPv4 or IPv6)
export const ipAddressSchema = z.union([ipv4AddressSchema, ipv6AddressSchema]);

export const ipSearchSchema = z.object({
  ip: ipAddressSchema,
});

export type IpSearchInput = z.infer<typeof ipSearchSchema>;

// Helper functions
export function isIpv4(ip: string): boolean {
  const result = ipv4AddressSchema.safeParse(ip);
  return result.success;
}

export function isIpv6(ip: string): boolean {
  const result = ipv6AddressSchema.safeParse(ip);
  return result.success;
}

export function getIpVersion(ip: string): 'IPv4' | 'IPv6' | null {
  if (isIpv4(ip)) return 'IPv4';
  if (isIpv6(ip)) return 'IPv6';
  return null;
}


