import { useParams, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllJobs } from '../database/jsonStorage';
import Button from '../components/ui/Button';
import AssessmentBuilder from '../components/assessments/AssessmentBuilder';
import './JobDetail.css';
import * as api from '../services/api';

export default function JobDetail() {
  const { id } = useParams();
  const [showAssessmentBuilder, setShowAssessmentBuilder] = useState(false);

  const { data: job, isLoading } = useQuery({
    queryKey: ['job', id],
    queryFn: async () => {
      if (!id) throw new Error('No job ID');
      const jobs = getAllJobs();
      const foundJob = jobs.find(j => j.id === id);
      if (!foundJob) throw new Error('Job not found');
      return foundJob;
    },
  });

  const { data: assessment, refetch: refetchAssessment } = useQuery({
    queryKey: ['assessment', id],
    queryFn: async () => {
      if (!id) return null;
      return api.fetchAssessmentByJobId(id);
    },
  });

  if (isLoading) {
    return <div className="loading">Loading job...</div>;
  }

  if (!job) {
    return <Navigate to="/jobs" replace />;
  }

  if (showAssessmentBuilder) {
    return (
      <AssessmentBuilder
        jobId={id!}
        onClose={() => {
          setShowAssessmentBuilder(false);
          refetchAssessment();
        }}
      />
    );
  }

  return (
    <div className="job-detail">
      <div className="job-header">
        <div className="job-meta">
          <span className="job-status-badge" data-status={job.status}>
            {job.status}
          </span>
          <span className="job-order">Order #{job.order}</span>
        </div>
        <h1>{job.title}</h1>
        {job.slug && (
          <p className="job-slug">/{job.slug}</p>
        )}
      </div>

      <div className="job-content">
        <div className="job-section">
          <h2>Description</h2>
          <p>{job.description || 'No description provided.'}</p>
        </div>

        {job.tags && job.tags.length > 0 && (
          <div className="job-section">
            <h2>Tags</h2>
            <div className="job-tags">
              {job.tags.map((tag: string, idx: number) => (
                <span key={idx} className="job-tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="job-section">
          <div className="section-header">
            <h2>Assessment</h2>
            <Button
              onClick={() => setShowAssessmentBuilder(true)}
              variant="primary"
              size="small"
            >
              {assessment ? 'Edit Assessment' : '+ Create Assessment'}
            </Button>
          </div>

          {assessment ? (
            <div className="assessment-preview">
              <h3>{assessment.title}</h3>
              {assessment.description && (
                <p>{assessment.description}</p>
              )}
              {assessment.sections && assessment.sections.length > 0 && (
                <div className="assessment-sections">
                  <p className="sections-count">
                    {assessment.sections.length} section{assessment.sections.length !== 1 ? 's' : ''}
                  </p>
                  <ul className="sections-list">
                    {assessment.sections.map((section: any, idx: number) => (
                      <li key={idx}>
                        <strong>{section.name || `Section ${idx + 1}`}</strong>
                        {section.questions && (
                          <span className="questions-count">
                            {' '}({section.questions.length} questions)
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="no-assessment">
              <p>No assessment created yet.</p>
              <p className="hint">Create an assessment to evaluate candidates for this position.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

