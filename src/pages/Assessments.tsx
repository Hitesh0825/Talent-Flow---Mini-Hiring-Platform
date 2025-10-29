import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllJobs, getAllAssessments } from '../database/jsonStorage';
import AssessmentBuilder from '../components/assessments/AssessmentBuilder';
import './Assessments.css';

export default function Assessments() {
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [showBuilder, setShowBuilder] = useState(false);

  const { data: jobs, isLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const allJobs = getAllJobs();
      return allJobs.filter(j => j.status === 'active');
    },
  });

  const { data: assessments } = useQuery({
    queryKey: ['assessments'],
    queryFn: async () => {
      try {
        return getAllAssessments();
      } catch (error) {
        console.error('Error loading assessments:', error);
        return [];
      }
    },
  });

  const handleJobSelect = (jobId: string) => {
    setSelectedJobId(jobId);
    setShowBuilder(true);
  };

  const handleAssessmentClick = (assessment: any) => {
    setSelectedJobId(assessment.jobId);
    setShowBuilder(true);
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (showBuilder && selectedJobId) {
    return (
      <AssessmentBuilder
        jobId={selectedJobId}
        onClose={() => {
          setShowBuilder(false);
          setSelectedJobId(null);
        }}
      />
    );
  }

  return (
    <div className="assessments-page">
      <div className="assessments-header">
        <div>
          <h2>Assessments</h2>
          <p className="subtitle">Create and manage job-specific assessments</p>
        </div>
      </div>

      {assessments && assessments.length > 0 && (
        <div className="existing-assessments">
          <h3>Existing Assessments</h3>
          <div className="assessment-list">
            {assessments.map((assessment: any) => {
              const job = jobs?.find(j => j.id === assessment.jobId);
              return (
                <div 
                  key={assessment.id} 
                  className="assessment-card"
                  onClick={() => handleAssessmentClick(assessment)}
                >
                  <h4>{assessment.title}</h4>
                  <p>{job?.title || 'Unknown job'}</p>
                  <p className="assessment-meta">
                    {assessment.sections?.length || 0} sections
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="assessment-actions">
        <h3>Create New Assessment</h3>
        <p>Select a job to create an assessment:</p>
        {jobs && jobs.length > 0 ? (
          <div className="job-selector">
            {jobs.map(job => (
              <button
                key={job.id}
                className="job-option"
                onClick={() => handleJobSelect(job.id)}
              >
                {job.title}
              </button>
            ))}
          </div>
        ) : (
          <div className="no-jobs-message">
            <p>No active jobs available.</p>
            <p className="hint">Create a job first, then come back here to add an assessment.</p>
          </div>
        )}
      </div>
    </div>
  );
}

