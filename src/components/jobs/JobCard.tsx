import { useDrag, useDrop } from 'react-dnd';
import './JobCard.css';

interface Job {
  id: string;
  title: string;
  slug: string;
  status: 'active' | 'archived';
  tags: string[];
  order: number;
  description?: string;
}

interface JobCardProps {
  job: Job;
  onEdit: () => void;
  onArchive: () => void;
  onReorder: (id: string, order: number) => void;
  onClick: () => void;
}

export default function JobCard({ job, onEdit, onArchive, onReorder, onClick }: JobCardProps) {
  const [{ isDragging: isDraggingGlobal }, drag] = useDrag({
    type: 'job',
    item: () => ({ id: job.id, order: job.order }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: 'job',
    drop: (item: { id: string; order: number }) => {
      if (item.id !== job.id) {
        onReorder(item.id, job.order);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`job-card ${isDraggingGlobal ? 'dragging' : ''} ${isOver ? 'over' : ''}`}
    >
      <div className="job-card-header">
        <div className="job-status" data-status={job.status}>
          {job.status}
        </div>
        <div className="job-actions">
          <button onClick={(e) => { e.stopPropagation(); onEdit(); }} className="icon-btn">
            edit
          </button>
          <button onClick={(e) => { e.stopPropagation(); onArchive(); }} className="icon-btn">
            {job.status === 'archived' ? '📤' : '📥'}
          </button>
        </div>
      </div>
      
      <div className="job-card-body" onClick={onClick}>
        <h3 className="job-title">{job.title}</h3>
        {job.description && (
          <p className="job-description">{job.description.substring(0, 100)}...</p>
        )}
      </div>

      <div className="job-card-footer">
        <div className="job-tags">
          {job.tags.slice(0, 3).map((tag, idx) => (
            <span key={idx} className="job-tag">
              {tag}
            </span>
          ))}
        </div>
        <div className="job-order">#{job.order}</div>
      </div>
    </div>
  );
}

