import type { ProjectCaseStudy } from '@/data/projects';

export type ArchitectureNodeKind = 'client' | 'gateway' | 'service' | 'realtime' | 'queue' | 'data' | 'external';

export interface ArchitectureNode {
  id: string;
  label: string;
  kind: ArchitectureNodeKind;
  detail: string;
}

export interface ArchitectureEdge {
  from: string;
  to: string;
  label?: string;
}

export interface ProjectEngineeringStory {
  projectId: string;
  metric: string;
  metricLabel: string;
  scale: string;
  tradeoff: string;
  architecture: ArchitectureNode[];
  edges: ArchitectureEdge[];
}

export const PROJECT_ENGINEERING_STORIES: Record<string, ProjectEngineeringStory> = {
  'exam-system': {
    projectId: 'exam-system',
    metric: '97%',
    metricLabel: 'faster batch processing',
    scale: '20k+ concurrent candidates • 200k records • 10 provinces',
    tradeoff: 'Prefer deterministic autosave + recoverability over a thinner stateless client because exam integrity matters more than client simplicity.',
    architecture: [
      { id: 'candidate', label: 'Exam Client', kind: 'client', detail: 'Autosave + reconnect queue' },
      { id: 'gateway', label: 'API Gateway', kind: 'gateway', detail: 'Routing, auth and policy boundary' },
      { id: 'exam', label: 'Exam API', kind: 'service', detail: 'Submission and exam-domain rules' },
      { id: 'realtime', label: 'Realtime Hub', kind: 'realtime', detail: 'Live supervision and answer sync' },
      { id: 'jobs', label: 'Batch / Jobs', kind: 'queue', detail: 'Parallel imports, scoring and cleanup' },
      { id: 'db', label: 'MySQL / SQL', kind: 'data', detail: 'Exam data + operational logs' },
    ],
    edges: [
      { from: 'candidate', to: 'gateway', label: 'HTTPS' },
      { from: 'gateway', to: 'exam' },
      { from: 'candidate', to: 'realtime', label: 'WS' },
      { from: 'exam', to: 'jobs' },
      { from: 'exam', to: 'db' },
      { from: 'jobs', to: 'db' },
    ],
  },
  'fintech-payment': {
    projectId: 'fintech-payment',
    metric: '10B₫',
    metricLabel: 'processed in 2 months',
    scale: '50k–100k transactions/month • 500k+ transaction logs',
    tradeoff: 'Use explicit idempotency and retry state instead of optimistic “fire-and-forget” integration; extra persistence is worth preventing duplicate money movement.',
    architecture: [
      { id: 'consumer', label: 'Product Apps', kind: 'client', detail: 'Checkout and account flows' },
      { id: 'payment', label: 'Payment API', kind: 'gateway', detail: 'Idempotency boundary' },
      { id: 'strategy', label: 'Provider Strategy', kind: 'service', detail: 'Factory/Strategy integrations' },
      { id: 'retry', label: 'Retry Worker', kind: 'queue', detail: 'Webhook recovery and reconciliation' },
      { id: 'ledger', label: 'Transaction DB', kind: 'data', detail: 'Durable payment state' },
      { id: 'provider', label: 'MoMo / VTC / SePay', kind: 'external', detail: 'External payment providers' },
    ],
    edges: [
      { from: 'consumer', to: 'payment' },
      { from: 'payment', to: 'strategy' },
      { from: 'strategy', to: 'provider' },
      { from: 'provider', to: 'payment', label: 'webhook' },
      { from: 'payment', to: 'ledger' },
      { from: 'payment', to: 'retry' },
      { from: 'retry', to: 'provider' },
    ],
  },
  'e-government': {
    projectId: 'e-government',
    metric: 'L4',
    metricLabel: 'fully online public service',
    scale: 'Multi-agency workflows • national identity/payment integrations',
    tradeoff: 'Model workflow state explicitly instead of hiding it in UI branching; a verbose state machine is easier to audit across agencies.',
    architecture: [
      { id: 'citizen', label: 'Citizen Portal', kind: 'client', detail: 'Submission and status tracking' },
      { id: 'workflow', label: 'Workflow API', kind: 'service', detail: 'State-machine orchestration' },
      { id: 'agency', label: 'Agency Services', kind: 'service', detail: 'Department-specific processing' },
      { id: 'identity', label: 'VNeID', kind: 'external', detail: 'National identity verification' },
      { id: 'national', label: 'National Portal', kind: 'external', detail: 'Cross-system exchange' },
      { id: 'records', label: 'Case Records', kind: 'data', detail: 'Traceable application history' },
    ],
    edges: [
      { from: 'citizen', to: 'workflow' },
      { from: 'workflow', to: 'identity' },
      { from: 'workflow', to: 'agency' },
      { from: 'agency', to: 'national' },
      { from: 'workflow', to: 'records' },
    ],
  },
  'weather-warning': {
    projectId: 'weather-warning',
    metric: '5M+',
    metricLabel: 'time-series records',
    scale: '10-minute ingestion • 12 warning thresholds • GIS visualization',
    tradeoff: 'Precompute alert-oriented aggregates while retaining raw observations; storage grows, but operational queries stay predictable during severe weather.',
    architecture: [
      { id: 'station', label: 'Weather Stations', kind: 'external', detail: 'National observation APIs' },
      { id: 'collector', label: 'Collector', kind: 'service', detail: '10-minute scheduled ingestion' },
      { id: 'rules', label: 'Alert Rules', kind: 'service', detail: '12 threshold evaluators' },
      { id: 'series', label: 'Time-series DB', kind: 'data', detail: '5M+ observations' },
      { id: 'gis', label: 'GIS API', kind: 'gateway', detail: 'Storm path and history queries' },
      { id: 'map', label: 'Operations Map', kind: 'client', detail: 'Analyst visualization' },
    ],
    edges: [
      { from: 'station', to: 'collector' },
      { from: 'collector', to: 'series' },
      { from: 'collector', to: 'rules' },
      { from: 'series', to: 'gis' },
      { from: 'rules', to: 'gis' },
      { from: 'gis', to: 'map' },
    ],
  },
};

export function getProjectEngineeringStory(project: ProjectCaseStudy | string) {
  const id = typeof project === 'string' ? project : project.id;
  return PROJECT_ENGINEERING_STORIES[id] ?? PROJECT_ENGINEERING_STORIES['exam-system'];
}
