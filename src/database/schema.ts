export interface Job {
  id: string;
  title: string;
  slug: string;
  status: 'active' | 'archived';
  tags: string[];
  order: number;
  description?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  stage: 'applied' | 'screen' | 'tech' | 'offer' | 'hired' | 'rejected';
  jobId: string;
  jobTitle?: string;
  appliedAt: number;
  updatedAt: number;
  phone?: string;
  linkedin?: string;
  notes?: Array<{
    id: string;
    text: string;
    createdAt: number;
    mentions?: string[];
  }>;
}

export interface CandidateTimeline {
  candidateId: string;
  events: Array<{
    id: string;
    type: 'stage_change' | 'note_added' | 'assessment_completed';
    data: any;
    timestamp: number;
  }>;
}

export interface Assessment {
  id: string;
  jobId: string;
  title: string;
  description: string;
  sections: Array<{
    id: string;
    title: string;
    questions: Array<{
      id: string;
      type: 'single_choice' | 'multi_choice' | 'short_text' | 'long_text' | 'numeric' | 'file';
      question: string;
      options?: string[];
      required: boolean;
      conditions?: Array<{
        questionId: string;
        operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than';
        value: any;
      }>;
      min?: number;
      max?: number;
      maxLength?: number;
      numericMin?: number;
      numericMax?: number;
    }>;
  }>;
  createdAt: number;
  updatedAt: number;
}

export interface AssessmentResponse {
  id: string;
  assessmentId: string;
  candidateId: string;
  responses: Record<string, any>;
  submittedAt: number;
}
// Interfaces only; JSON storage handles persistence

