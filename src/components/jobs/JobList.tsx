import { useNavigate } from 'react-router-dom';
import JobCard from './JobCard';
import './JobList.css';

interface Job {
  id: string;
  title: string;
  slug: string;
  status: 'active' | 'archived';
  tags: string[];
  order: number;
  description?: string;
}

interface JobListProps {
  jobs: Job[];
  onEdit: (job: Job) => void;
  onArchive: (id: string) => void;
  onReorder: (fromOrder: number, toOrder: number) => void;
}

export default function JobList({ jobs, onEdit, onArchive, onReorder }: JobListProps) {
  const navigate = useNavigate();

  const handleReorder = (id: string, newOrder: number) => {
    const job = jobs.find(j => j.id === id);
    if (job) {
      onReorder(job.order, newOrder);
    }
  };

  return (
    <div className="job-list">
      {jobs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <p>No jobs yet</p>
          <p style={{ fontSize: '1rem', fontWeight: 'normal', color: 'var(--text-muted)' }}>
            Click the "+ New Job" button to create your first job posting
          </p>
        </div>
      ) : (
        <div className="job-grid">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onEdit={() => onEdit(job)}
              onArchive={() => onArchive(job.id)}
              onReorder={handleReorder}
              onClick={() => navigate(`/jobs/${job.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

