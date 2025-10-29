import { Job, Candidate, Assessment, AssessmentResponse } from './schema';

// In-memory JSON storage
let jobsStorage: Job[] = [];
let candidatesStorage: Candidate[] = [];
let assessmentsStorage: Assessment[] = [];
let assessmentResponsesStorage: AssessmentResponse[] = [];

// Seed demo data if storage is empty
function seedDemoData() {
  if (jobsStorage.length || candidatesStorage.length || assessmentsStorage.length) return;

  const now = Date.now();

  const jobs: Job[] = [
    { id: crypto.randomUUID(), title: 'Frontend Engineer', slug: 'frontend-engineer', status: 'active', tags: ['React', 'TypeScript', 'UI'], order: 1, description: 'Build delightful UIs with React and modern tooling.', createdAt: now, updatedAt: now },
    { id: crypto.randomUUID(), title: 'Backend Engineer', slug: 'backend-engineer', status: 'active', tags: ['Node.js', 'API', 'SQL'], order: 2, description: 'Design resilient APIs and services.', createdAt: now, updatedAt: now },
    { id: crypto.randomUUID(), title: 'Full Stack Developer', slug: 'full-stack-developer', status: 'active', tags: ['React', 'Node.js', 'PostgreSQL'], order: 3, description: 'Own features end-to-end across the stack.', createdAt: now, updatedAt: now },
    { id: crypto.randomUUID(), title: 'DevOps Engineer', slug: 'devops-engineer', status: 'active', tags: ['AWS', 'Terraform', 'CI/CD'], order: 4, description: 'Automate infrastructure and deployment pipelines.', createdAt: now, updatedAt: now },
    { id: crypto.randomUUID(), title: 'Data Engineer', slug: 'data-engineer', status: 'active', tags: ['Python', 'ETL', 'Spark'], order: 5, description: 'Build robust data pipelines.', createdAt: now, updatedAt: now },
    { id: crypto.randomUUID(), title: 'Machine Learning Engineer', slug: 'ml-engineer', status: 'active', tags: ['Python', 'ML', 'MLOps'], order: 6, description: 'Ship ML models to production.', createdAt: now, updatedAt: now },
    { id: crypto.randomUUID(), title: 'QA Automation Engineer', slug: 'qa-automation-engineer', status: 'active', tags: ['Playwright', 'Cypress', 'Automation'], order: 7, description: 'Ensure quality with automated testing.', createdAt: now, updatedAt: now },
    { id: crypto.randomUUID(), title: 'Mobile Developer', slug: 'mobile-developer', status: 'active', tags: ['React Native', 'iOS', 'Android'], order: 8, description: 'Build cross-platform mobile apps.', createdAt: now, updatedAt: now },
    { id: crypto.randomUUID(), title: 'Security Engineer', slug: 'security-engineer', status: 'active', tags: ['AppSec', 'Threat Modeling', 'SIEM'], order: 9, description: 'Harden systems and processes.', createdAt: now, updatedAt: now },
    { id: crypto.randomUUID(), title: 'Site Reliability Engineer', slug: 'sre', status: 'active', tags: ['Observability', 'Reliability', 'Kubernetes'], order: 10, description: 'Keep systems fast and reliable.', createdAt: now, updatedAt: now },
  ];

  jobsStorage = jobs;

  const candidateNames = [
    'Aarav Mehta','Vivaan Shah','Aditya Verma','Vihaan Gupta','Arjun Khanna',
    'Reyansh Bhat','Muhammad Ali','Ishaan Kapoor','Atharv Nair','Krish Patel',
    'Ananya Singh','Diya Malhotra','Aadhya Rao','Myra Das','Anika Iyer',
    'Sara Khan','Meera Joshi','Navya Kulkarni','Riya Chawla','Kiara Desai'
  ];
  const stages: Candidate['stage'][] = ['applied','screen','tech','offer','hired','rejected'];

  const candidates: Candidate[] = candidateNames.map((name, idx) => {
    const job = jobs[idx % jobs.length];
    const email = `${name.toLowerCase().replace(/\s+/g,'')}@example.com`;
    const stage = stages[idx % stages.length];
    const appliedAt = now - (idx * 86400000) /* days */;
    return {
      id: crypto.randomUUID(),
      name,
      email,
      phone: `+91-98${(10000000 + idx * 12345).toString().slice(0,7)}`,
      linkedin: `https://www.linkedin.com/in/${name.toLowerCase().replace(/\s+/g,'-')}`,
      stage,
      jobId: job.id,
      jobTitle: job.title,
      appliedAt,
      updatedAt: appliedAt + 3600000,
      notes: idx % 3 === 0 ? [
        { id: crypto.randomUUID(), text: 'Initial screening complete.', createdAt: appliedAt + 7200000 },
      ] : [],
    };
  });

  candidatesStorage = candidates;

  // Create assessments for 5 tech roles
  const assessmentJobs = [jobs[0], jobs[1], jobs[2], jobs[5], jobs[7]]; // FE, BE, Fullstack, ML, Mobile
  const assessments: Assessment[] = assessmentJobs.map((job, i) => ({
    id: crypto.randomUUID(),
    jobId: job.id,
    title: `${job.title} Technical Assessment`,
    description: `Evaluate core competencies for the ${job.title} role.`,
    sections: [
      {
        id: crypto.randomUUID(),
        title: 'Core Concepts',
        questions: [
          { id: crypto.randomUUID(), type: 'short_text', question: 'Describe your most challenging project.', required: true, maxLength: 500 },
          { id: crypto.randomUUID(), type: 'single_choice', question: 'Years of relevant experience?', required: true, options: ['0-1','2-3','4-6','7+'] },
          { id: crypto.randomUUID(), type: 'numeric', question: 'Rate your proficiency (1-10).', required: true, numericMin: 1, numericMax: 10 },
        ],
      },
      {
        id: crypto.randomUUID(),
        title: 'Technical',
        questions: [
          { id: crypto.randomUUID(), type: 'multi_choice', question: 'Pick the tools you use regularly.', required: false, options: job.tags.concat(['Git','Docker']) },
          { id: crypto.randomUUID(), type: 'long_text', question: 'Explain a tricky bug you fixed and how.', required: true, max: 1000 },
        ],
      },
    ],
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

