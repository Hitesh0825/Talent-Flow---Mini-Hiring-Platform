import { Job, Candidate, Assessment, AssessmentResponse } from './schema';

// In-memory JSON storage
let jobsStorage: Job[] = [];
let candidatesStorage: Candidate[] = [];
let assessmentsStorage: Assessment[] = [];
let assessmentResponsesStorage: AssessmentResponse[] = [];

// Load from localStorage on init
export function loadFromStorage() {
  try {
    const jobsJson = localStorage.getItem('talentflow_jobs');
    const candidatesJson = localStorage.getItem('talentflow_candidates');
    const assessmentsJson = localStorage.getItem('talentflow_assessments');
    const responsesJson = localStorage.getItem('talentflow_assessment_responses');

    if (jobsJson) jobsStorage = JSON.parse(jobsJson);
    if (candidatesJson) candidatesStorage = JSON.parse(candidatesJson);
    if (assessmentsJson) assessmentsStorage = JSON.parse(assessmentsJson);
    if (responsesJson) assessmentResponsesStorage = JSON.parse(responsesJson);

    console.log('[JSON Storage] Loaded from localStorage', {
      jobs: jobsStorage.length,
      candidates: candidatesStorage.length,
      assessments: assessmentsStorage.length,
    });
  } catch (error) {
    console.error('[JSON Storage] Error loading from localStorage:', error);
  }
}

// Save to localStorage
export function saveToStorage() {
  try {
    localStorage.setItem('talentflow_jobs', JSON.stringify(jobsStorage, null, 2));
    localStorage.setItem('talentflow_candidates', JSON.stringify(candidatesStorage, null, 2));
    localStorage.setItem('talentflow_assessments', JSON.stringify(assessmentsStorage, null, 2));
    localStorage.setItem('talentflow_assessment_responses', JSON.stringify(assessmentResponsesStorage, null, 2));
    console.log('[JSON Storage] Saved to localStorage');
  } catch (error) {
    console.error('[JSON Storage] Error saving to localStorage:', error);
  }
}

// Jobs
export function getAllJobs(): Job[] {
  return jobsStorage;
}

export function createJob(job: Job): string {
  job.id = job.id || crypto.randomUUID();
  job.createdAt = Date.now();
  job.updatedAt = Date.now();
  jobsStorage.push(job);
  saveToStorage();
  return job.id;
}

export function updateJob(id: string, updates: Partial<Job>): Job | undefined {
  const index = jobsStorage.findIndex(j => j.id === id);
  if (index >= 0) {
    jobsStorage[index] = { ...jobsStorage[index], ...updates, updatedAt: Date.now() };
    saveToStorage();
    return jobsStorage[index];
  }
  return undefined;
}

export function deleteJob(id: string): boolean {
  const index = jobsStorage.findIndex(j => j.id === id);
  if (index >= 0) {
    jobsStorage.splice(index, 1);
    saveToStorage();
    return true;
  }
  return false;
}

// Candidates
export function getAllCandidates(): Candidate[] {
  return candidatesStorage.map(candidate => {
    // Ensure job title is loaded
    if (!candidate.jobTitle && candidate.jobId) {
      const job = jobsStorage.find(j => j.id === candidate.jobId);
      if (job) {
        candidate.jobTitle = job.title;
      }
    }
    return candidate;
  });
}

export function getCandidateById(id: string): Candidate | undefined {
  return getAllCandidates().find(c => c.id === id);
}

export function createCandidate(candidate: Candidate): string {
  candidate.id = candidate.id || crypto.randomUUID();
  candidate.appliedAt = Date.now();
  candidate.updatedAt = Date.now();
  
  // Load job title
  if (candidate.jobId) {
    const job = jobsStorage.find(j => j.id === candidate.jobId);
    if (job) {
      candidate.jobTitle = job.title;
    }
  }
  
  candidatesStorage.push(candidate);
  saveToStorage();
  return candidate.id;
}

export function updateCandidate(id: string, updates: Partial<Candidate>): Candidate | undefined {
  const index = candidatesStorage.findIndex(c => c.id === id);
  if (index >= 0) {
    // Update job title if jobId changed
    if (updates.jobId) {
      const job = jobsStorage.find(j => j.id === updates.jobId);
      if (job) {
        updates.jobTitle = job.title;
      }
    }
    
    // Update the candidate
    const updated = { ...candidatesStorage[index], ...updates, updatedAt: Date.now() };
    candidatesStorage[index] = updated;
    saveToStorage();
    
    console.log('[JSON Storage] Updated candidate:', { id, updates, newStage: updates.stage });
    
    return candidatesStorage[index];
  }
  return undefined;
}

export function deleteCandidate(id: string): boolean {
  const index = candidatesStorage.findIndex(c => c.id === id);
  if (index >= 0) {
    candidatesStorage.splice(index, 1);
    saveToStorage();
    return true;
  }
  return false;
}

// Assessments
export function getAssessmentByJobId(jobId: string): Assessment | undefined {
  return assessmentsStorage.find(a => a.jobId === jobId);
}

export function createOrUpdateAssessment(assessment: Assessment): string {
  const existing = assessmentsStorage.findIndex(a => a.jobId === assessment.jobId);
  
  if (existing >= 0) {
    assessmentsStorage[existing] = {
      ...assessmentsStorage[existing],
      ...assessment,
      updatedAt: Date.now(),
    };
    saveToStorage();
    return assessmentsStorage[existing].id;
  } else {
    assessment.id = assessment.id || crypto.randomUUID();
    assessment.createdAt = Date.now();
    assessment.updatedAt = Date.now();
    assessmentsStorage.push(assessment);
    saveToStorage();
    return assessment.id;
  }
}

export function getAllAssessments(): Assessment[] {
  return assessmentsStorage;
}

export function submitAssessmentResponse(response: AssessmentResponse): string {
  const id = response.id || crypto.randomUUID();
  const newResponse: AssessmentResponse = { ...response, id };
  assessmentResponsesStorage.push(newResponse);
  saveToStorage();
  return id;
}

// Initialize storage
loadFromStorage();

