import { useDrop } from 'react-dnd';
import CandidateCard from './CandidateCard';
import './KanbanColumn.css';

interface Candidate {
  id: string;
  name: string;
  email: string;
  stage: string;
  jobId: string;
  jobTitle?: string;
  appliedAt: number;
}

interface Stage {
  id: string;
  label: string;
  color: string;
}

interface KanbanColumnProps {
  stage: Stage;
  candidates: Candidate[];
  onDrop: (stageId: string) => void;
  onDragStart: (candidate: Candidate) => void;
  onCandidateClick: (id: string) => void;
}

export default function KanbanColumn({
  stage,
  candidates,
  onDrop,
  onDragStart,
  onCandidateClick,
}: KanbanColumnProps) {
  const [{ isOver }, drop] = useDrop({
    accept: 'candidate',
    drop: () => {
      // Trigger the stage update
      onDrop(stage.id);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div ref={drop} className={`kanban-column ${isOver ? 'drop-target' : ''}`}>
      <div className="column-header" style={{ borderLeftColor: stage.color }}>
        <h3>{stage.label}</h3>
        <span className="count">{candidates.length}</span>
      </div>
      <div className="column-body">
        {candidates.length === 0 ? (
          <div className="empty-column">
            <p>No candidates yet</p>
          </div>
        ) : (
          candidates.map(candidate => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              onDragStart={() => onDragStart(candidate)}
              onClick={() => onCandidateClick(candidate.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

