import { Job, Candidate, Assessment, AssessmentResponse } from './schema';

// In-memory JSON storage
let jobsStorage: Job[] = [];
let candidatesStorage: Candidate[] = [];
let assessmentsStorage: Assessment[] = [];
let assessmentResponsesStorage: AssessmentResponse[] = [];

// Seed demo data if storage is empty
function seedDemoData() {
  // Only seed if empty
  if (jobsStorage.length || candidatesStorage.length || assessmentsStorage.length) return;

  const now = Date.now();

  // Generate 25 jobs, with a mix of active and archived
  const jobTitles = Array.from({length: 25}, (_, i) => `Job ${i + 1}`);
  const jobStatus = (i: number) => (i % 4 === 0 ? 'archived' : 'active'); // ~6 archived
  const jobTags = ['React', 'Node.js', 'TypeScript', 'UI', 'API', 'SQL', 'Python', 'ML', 'DevOps', 'AWS', 'CI/CD', 'ETL'];
  const jobs: Job[] = jobTitles.map((title, i) => ({
    id: crypto.randomUUID(),
    title,
    slug: title.toLowerCase().replace(/\s+/g, '-'),
    status: jobStatus(i),
    tags: [jobTags[i%jobTags.length], jobTags[(i+2)%jobTags.length]],
    order: i+1,
    description: `Description for ${title}`,
    createdAt: now - i*1000000,
    updatedAt: now - i*500000,
  }));
  jobsStorage = jobs;

  // Generate 1000 candidates, distributed randomly among jobs and stages
  const stages: Candidate['stage'][] = ['applied', 'screen', 'tech', 'offer', 'hired', 'rejected'];
  const candidateNames = (n: number) => Array.from({length: n}, (_, i) => `Candidate ${i + 1}`);
  const candidateArr = candidateNames(1000);
  const candidates: Candidate[] = candidateArr.map((name, idx) => {
    const job = jobs[Math.floor(Math.random() * jobs.length)];
    const stage = stages[Math.floor(Math.random() * stages.length)];
    const appliedAt = now - Math.floor(Math.random() * 90) * 86400000; // Applied within last 90 days
    return {
      id: crypto.randomUUID(),
      name,
      email: `${name.toLowerCase().replace(/\s+/g, '')}${idx}@example.com`,
      phone: `+91-9${(Math.floor(Math.random()*1e9)).toString().padStart(9, '0')}`,
      linkedin: `https://www.linkedin.com/in/${name.toLowerCase().replace(/\s+/g, '-')}`,
      stage,
      jobId: job.id,
      jobTitle: job.title,
      appliedAt,
      updatedAt: appliedAt + Math.floor(Math.random()*86400000),
      notes: idx % 13 === 0 ? [{ id: crypto.randomUUID(), text: 'Screened by HR.', createdAt: appliedAt + 500000 }] : [],
    };
  });
  candidatesStorage = candidates;

  // 3 assessments, each with at least 10 questions (across 2+ sections)
  const assessmentJobs = [jobs[0], jobs[5], jobs[10]];
  const sectionsAndQuestions = [
    {
      title: 'General Knowledge',
      n: 5,
      types: ['single_choice', 'multi_choice', 'numeric', 'short_text', 'long_text']
    },
    {
      title: 'Technical Skills',
      n: 5,
      types: ['single_choice', 'multi_choice', 'numeric', 'short_text', 'long_text']
    },
  ];
  const questionText = (secIdx: number, qIdx: number) => `Question ${secIdx + 1}.${qIdx + 1}`;
  const assessments: Assessment[] = assessmentJobs.map((job) => ({
    id: crypto.randomUUID(),
    jobId: job.id,
    title: `${job.title} Assessment`,
    description: `Assessment for ${job.title}`,
    sections: sectionsAndQuestions.map((sec, secIdx) => ({
      id: crypto.randomUUID(),
      title: sec.title,
      questions: Array.from({length: sec.n}, (_, qIdx) => {
        const type = sec.types[qIdx % sec.types.length] as Assessment['sections'][0]['questions'][0]['type'];
        const opts = type === 'single_choice' || type === 'multi_choice' ? ['Option 1', 'Option 2', 'Option 3'] : undefined;
        return {
          id: crypto.randomUUID(),
          type,
          question: questionText(secIdx, qIdx),
          options: opts,
          required: qIdx % 2 === 0,
          numericMin: type === 'numeric' ? 0 : undefined,
          numericMax: type === 'numeric' ? 10 : undefined,
          maxLength: type === 'short_text' ? 200 : undefined,
          max: type === 'long_text' ? 1000 : undefined,
        };
      })
    })),
    createdAt: now,
    updatedAt: now,
  }));
  assessmentsStorage = assessments;

  saveToStorage();
}

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

    // If empty, seed demo data once
    if (!jobsStorage.length && !candidatesStorage.length && !assessmentsStorage.length) {
      seedDemoData();
      console.log('[JSON Storage] Seeded demo data');
    }
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

