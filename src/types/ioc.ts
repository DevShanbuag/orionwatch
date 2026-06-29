/**
 * IOC (Indicator of Compromise) and Correlation types
 */

import type { Severity, PaginationParams, DateRange } from './common';

/**
 * Supported IOC types
 */
export type IOCType =
  | 'IPv4'
  | 'IPv6'
  | 'Domain'
  | 'URL'
  | 'SHA256'
  | 'MD5'
  | 'Email'
  | 'CVE'
  | 'MITRE_Technique'
  | 'Malware'
  | 'Threat_Actor';

/**
 * IOC confidence score (0-100)
 */
export type IOConfidence = number;

/**
 * IOC relationship types
 */
export type IOCRelationshipType =
  | 'IOC_TO_INCIDENT'
  | 'IOC_TO_IOC'
  | 'INCIDENT_TO_THREAT_ACTOR'
  | 'THREAT_ACTOR_TO_MITRE_TECHNIQUE'
  | 'THREAT_ACTOR_TO_MALWARE';

/**
 * Indicator of Compromise
 */
export interface IOC {
  id: string;
  type: IOCType;
  value: string;
  confidence: IOConfidence;
  source: string;
  first_seen: string;
  last_seen: string;
  severity: Severity;
  relationship_count: number;
  tags?: string[];
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at?: string;
}

/**
 * IOC statistics
 */
export interface IOCStats {
  total_iocs: number;
  by_type: Record<IOCType, number>;
  high_confidence_iocs: number;
  active_iocs: number;
  iocs_with_relationships: number;
}

/**
 * IOC filter parameters
 */
export interface IOCFilter {
  type?: IOCType;
  severity?: Severity;
  confidence_min?: number;
  source?: string;
  date_range?: DateRange;
  search?: string;
  has_relationships?: boolean;
}

/**
 * IOC list parameters
 */
export interface IOCListParams extends PaginationParams {
  filter?: IOCFilter;
}

/**
 * Create IOC input
 */
export interface CreateIOCInput {
  type: IOCType;
  value: string;
  confidence: IOConfidence;
  source: string;
  severity: Severity;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

/**
 * Update IOC input
 */
export interface UpdateIOCInput {
  confidence?: IOConfidence;
  severity?: Severity;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

/**
 * IOC relationship
 */
export interface IOCRelationship {
  id: string;
  source_type: 'IOC' | 'Incident' | 'Threat_Actor';
  source_id: string;
  target_type: 'IOC' | 'Incident' | 'Threat_Actor' | 'MITRE_Technique' | 'Malware';
  target_id: string;
  relationship_type: IOCRelationshipType;
  confidence: IOConfidence;
  created_at: string;
}

/**
 * Threat actor
 */
export interface ThreatActor {
  id: string;
  name: string;
  aliases?: string[];
  description?: string;
  confidence: IOConfidence;
  source: string;
  first_seen: string;
  last_seen: string;
  severity: Severity;
  relationship_count: number;
  created_at: string;
  updated_at?: string;
}

/**
 * Malware family
 */
export interface Malware {
  id: string;
  name: string;
  aliases?: string[];
  description?: string;
  confidence: IOConfidence;
  source: string;
  first_seen: string;
  last_seen: string;
  severity: Severity;
  relationship_count: number;
  created_at: string;
  updated_at?: string;
}

/**
 * MITRE ATT&CK technique
 */
export interface MITRETechnique {
  id: string;
  technique_id: string;
  name: string;
  tactic?: string;
  description?: string;
  confidence: IOConfidence;
  source: string;
  relationship_count: number;
  created_at: string;
  updated_at?: string;
}

/**
 * Correlation result
 */
export interface CorrelationResult {
  ioc_id: string;
  ioc_type: IOCType;
  ioc_value: string;
  correlations: {
    incidents: Array<{
      id: string;
      title: string;
      severity: Severity;
      confidence: IOConfidence;
    }>;
    iocs: Array<{
      id: string;
      type: IOCType;
      value: string;
      confidence: IOConfidence;
    }>;
    threat_actors: Array<{
      id: string;
      name: string;
      confidence: IOConfidence;
    }>;
    malware: Array<{
      id: string;
      name: string;
      confidence: IOConfidence;
    }>;
    mitre_techniques: Array<{
      id: string;
      technique_id: string;
      name: string;
      confidence: IOConfidence;
    }>;
  };
  total_correlations: number;
  correlation_score: IOConfidence;
}

/**
 * Correlation statistics
 */
export interface CorrelationStats {
  total_correlations: number;
  by_type: Record<IOCRelationshipType, number>;
  high_confidence_correlations: number;
  incidents_with_correlations: number;
  threat_actors_active: number;
}

/**
 * Correlation filter parameters
 */
export interface CorrelationFilter {
  ioc_type?: IOCType;
  min_confidence?: number;
  relationship_type?: IOCRelationshipType;
  date_range?: DateRange;
}

/**
 * Create relationship input
 */
export interface CreateRelationshipInput {
  source_type: 'IOC' | 'Incident' | 'Threat_Actor';
  source_id: string;
  target_type: 'IOC' | 'Incident' | 'Threat_Actor' | 'MITRE_Technique' | 'Malware';
  target_id: string;
  relationship_type: IOCRelationshipType;
  confidence: IOConfidence;
}