import { useState, useEffect } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import './CandidateForm.css';
import { getAllJobs } from '../../database/jsonStorage';

interface CandidateFormProps {
  candidate?: any;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
}

export default function CandidateForm({ candidate, onClose, onSubmit, isSubmitting }: CandidateFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [selectedJob, setSelectedJob] = useState('');
  const [jobs, setJobs] = useState<any[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Load jobs
    const loadJobs = async () => {
      try {
        const jobsData = getAllJobs();
        setJobs(jobsData.filter((j: any) => j.status === 'active'));
      } catch (error) {
        console.error('Error loading jobs:', error);
      }
    };

    loadJobs();
  }, []);

  useEffect(() => {
    if (candidate) {
      setName(candidate.name);
      setEmail(candidate.email);
      setPhone(candidate.phone || '');
      setLinkedin(candidate.linkedin || '');
      setSelectedJob(candidate.jobId || '');
    }
  }, [candidate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!email.includes('@')) {
      newErrors.email = 'Invalid email';
    }
    if (!selectedJob) {
      newErrors.job = 'Job selection is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      ...(candidate && { id: candidate.id }),
      name,
      email,
      phone,
      linkedin,
      jobId: selectedJob,
      stage: candidate?.stage || 'applied',
      appliedAt: candidate?.appliedAt || Date.now(),
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{candidate ? 'Edit Candidate' : 'Add New Candidate'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="candidate-form">
          <Input
            label="Full Name"
            name="name"
            value={name}
            onChange={setName}
            placeholder="e.g., John Doe"
            required
            error={errors.name}
          />

          <Input
            label="Email"
            name="email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="e.g., john@example.com"
            required
            error={errors.email}
          />

          <Input
            label="Phone"
            name="phone"
            value={phone}
            onChange={setPhone}
            placeholder="e.g., +1 234 567 8900"
          />

          <Input
            label="LinkedIn"
            name="linkedin"
            value={linkedin}
            onChange={setLinkedin}
            placeholder="e.g., linkedin.com/in/johndoe"
          />

          <div className="form-group">
            <label className="input-label">
              Applied For
              {errors.job && <span className="required">*</span>}
            </label>
            <select
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value)}
              className={`input ${errors.job ? 'input-error' : ''}`}
              required
            >
              <option value="">Select a job...</option>
              {jobs.map(job => (
                <option key={job.id} value={job.id}>
                  {job.title}
                </option>
              ))}
            </select>
            {errors.job && <span className="error-message">{errors.job}</span>}
          </div>

          <div className="form-actions">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : candidate ? 'Update Candidate' : 'Add Candidate'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

