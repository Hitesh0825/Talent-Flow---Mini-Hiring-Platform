import {
  getAllJobs,
  createJob as createJobStorage,
  updateJob as updateJobStorage,
  getAllCandidates,
  createCandidate as createCandidateStorage,
  updateCandidate as updateCandidateStorage,
  getCandidateById,
  getAssessmentByJobId,
  createOrUpdateAssessment,
} from '../database/jsonStorage';

// Direct API functions using JSON storage
export async function fetchJobs(params: any = {}) {
  try {
    const { page = 1, pageSize = 10, search = '', status = '' } = params;
    
    // Get all jobs and filter in JavaScript
    let jobs = getAllJobs();

    if (search) {
      jobs = jobs.filter(job =>
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.slug.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status) {
      jobs = jobs.filter(job => job.status === status);
    }

    // Sort by order
    jobs.sort((a, b) => a.order - b.order);
    
    const total = jobs.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedJobs = jobs.slice(start, end);

    return {
      data: paginatedJobs,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
}

export async function fetchCandidates(params: any = {}) {
  try {
    const { page = 1, pageSize = 100, search = '', stage = '' } = params;
    
    // Get all candidates and filter in JavaScript
    let candidates = getAllCandidates();

    if (search) {
      candidates = candidates.filter(candidate =>
        candidate.name.toLowerCase().includes(search.toLowerCase()) ||
        candidate.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (stage) {
      candidates = candidates.filter(candidate => candidate.stage === stage);
    }

    // Sort by appliedAt descending
    candidates.sort((a, b) => b.appliedAt - a.appliedAt);
    
    const total = candidates.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedCandidates = candidates.slice(start, end);

    return {
      data: paginatedCandidates,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  } catch (error) {
    console.error('Error fetching candidates:', error);
    throw error;
  }
}

// Utility to inject artificial latency and error for writes
function artificialWriteDelay<T>(fn: () => T | Promise<T>): Promise<T> {
  const latency = 200 + Math.floor(Math.random() * 1000); // 200-1200ms
  const errorRate = Math.random() < (0.05 + Math.random() * 0.05); // 5-10%
  return new Promise<T>((resolve, reject) => {
    setTimeout(() => {
      if (errorRate) {
        reject(new Error('Random write failure occurred'));
        return;
      }
      Promise.resolve(fn()).then(resolve, reject);
    }, latency);
  });
}

export async function createJob(jobData: any) {
  return artificialWriteDelay(() => {
    const id = createJobStorage(jobData);
    const allJobs = getAllJobs();
    return allJobs.find(j => j.id === id);
  });
}

export async function updateJob(id: string, updates: any) {
  return artificialWriteDelay(() => {
    return updateJobStorage(id, updates);
  });
}

export async function createCandidate(candidateData: any) {
  return artificialWriteDelay(() => {
    candidateData.appliedAt = Date.now();
    candidateData.updatedAt = Date.now();
    const id = createCandidateStorage(candidateData);
    const allCandidates = getAllCandidates();
    return allCandidates.find(c => c.id === id);
  });
}

export async function updateCandidate(id: string, updates: any) {
  return artificialWriteDelay(() => {
    return updateCandidateStorage(id, updates);
  });
}

export async function fetchCandidateById(id: string) {
  const candidate = getCandidateById(id);
  if (!candidate) throw new Error('Candidate not found');
  return candidate;
}

export async function reorderJobs(fromOrder: number, toOrder: number) {
  const jobs = getAllJobs();
  const job1 = jobs.find(j => j.order === fromOrder);
  const job2 = jobs.find(j => j.order === toOrder);
  if (job1 && job2) {
    updateJobStorage(job1.id, { order: toOrder });
    updateJobStorage(job2.id, { order: fromOrder });
    return { success: true };
  }
  throw new Error('Jobs to reorder not found');
}

export async function fetchAssessmentByJobId(jobId: string) {
  return getAssessmentByJobId(jobId) || null;
}

export async function saveAssessment(jobId: string, data: any) {
  return artificialWriteDelay(() => {
    createOrUpdateAssessment({
      id: data.id,
      jobId,
      title: data.title,
      description: data.description,
      sections: data.sections || [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    } as any);
    return getAssessmentByJobId(jobId);
  });
}

export async function fetchTimelineForCandidate(id: string) {
  return { candidateId: id, events: [] };
}

