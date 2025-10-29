import { useDrag } from 'react-dnd';
import { format } from 'date-fns';
import './CandidateCard.css';

interface Candidate {
  id: string;
  name: string;
  email: string;
  stage: string;
  jobId: string;
  jobTitle?: string;
  appliedAt: number;
}

interface CandidateCardProps {
  candidate: Candidate;
  onDragStart: () => void;
  onClick: () => void;
}

export default function CandidateCard({ candidate, onDragStart, onClick }: CandidateCardProps) {
  const [{ isDragging }, drag] = useDrag({
    type: 'candidate',
    item: () => {
      onDragStart();
      return candidate;
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`candidate-card ${isDragging ? 'dragging' : ''}`}
      onClick={onClick}
    >
      <div className="candidate-header">
        <h4>{candidate.name}</h4>
      </div>
      <p className="candidate-email">{candidate.email}</p>
      {candidate.jobTitle && (
        <p className="candidate-job">
          <strong>Applied for:</strong> {candidate.jobTitle}
        </p>
      )}
      <p className="candidate-date">
        Applied {format(new Date(candidate.appliedAt), 'MMM dd, yyyy')}
      </p>
    </div>
  );
}

