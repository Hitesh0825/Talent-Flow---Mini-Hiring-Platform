import { useParams, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import './CandidateDetail.css';
import * as api from '../services/api';

async function fetchCandidate(id: string) {
  return api.fetchCandidateById(id);
}

async function fetchTimeline(id: string) {
  return api.fetchTimelineForCandidate(id);
}

export default function CandidateDetail() {
  const { id } = useParams();

  const { data: candidate, isLoading: candidateLoading } = useQuery({
    queryKey: ['candidate', id],
    queryFn: () => id ? fetchCandidate(id) : null,
    enabled: !!id,
  });

  const { data: timeline, isLoading: timelineLoading } = useQuery({
    queryKey: ['timeline', id],
    queryFn: () => id ? fetchTimeline(id) : null,
    enabled: !!id,
  });

  if (candidateLoading) {
    return <div className="loading">Loading candidate...</div>;
  }

  if (!candidate) {
    return <Navigate to="/candidates" replace />;
  }

  return (
    <div className="candidate-detail">
      <div className="candidate-header">
        <div>
          <h1>{candidate.name}</h1>
          <p className="candidate-email">{candidate.email}</p>
        </div>
        <span className={`status-badge ${candidate.stage}`}>
          {candidate.stage}
        </span>
      </div>

      <div className="candidate-content">
        <div className="info-grid">
          <div className="info-item">
            <label>Job</label>
            <p>{candidate.jobTitle || 'No job assigned'}</p>
          </div>
          <div className="info-item">
            <label>Applied</label>
            <p>{format(new Date(candidate.appliedAt), 'MMMM dd, yyyy')}</p>
          </div>
          {candidate.phone && (
            <div className="info-item">
              <label>Phone</label>
              <p>{candidate.phone}</p>
            </div>
          )}
          {candidate.linkedin && (
            <div className="info-item">
              <label>LinkedIn</label>
              <a href={`https://${candidate.linkedin}`} target="_blank" rel="noopener noreferrer">
                {candidate.linkedin}
              </a>
            </div>
          )}
        </div>

        {timelineLoading ? (
          <div>Loading timeline...</div>
        ) : timeline && timeline.events ? (
          <div className="timeline-section">
            <h2>Timeline</h2>
            <div className="timeline">
              {timeline.events.map((event: any, idx: number) => (
                <div key={idx} className="timeline-item">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <h4>
                      {event.type === 'stage_change' && 'Stage Changed'}
                      {event.type === 'note_added' && 'Note Added'}
                      {event.type === 'assessment_completed' && 'Assessment Completed'}
                    </h4>
                    <p>{format(new Date(event.timestamp), 'MMM dd, yyyy h:mm a')}</p>
                    {event.type === 'stage_change' && event.data?.stage && (
                      <span className="timeline-stage">{event.data.stage}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

