import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../../services/api';
import KanbanColumn from './KanbanColumn';
import './CandidateKanban.css';

interface Candidate {
  id: string;
  name: string;
  email: string;
  stage: string;
  jobId: string;
  jobTitle?: string;
  appliedAt: number;
}

interface CandidateKanbanProps {
  candidates: Candidate[];
  onCandidateClick: (id: string) => void;
}

const STAGES = [
  { id: 'applied', label: 'Applied', color: '#3b82f6' },
  { id: 'screen', label: 'Screen', color: '#8b5cf6' },
  { id: 'tech', label: 'Tech', color: '#f59e0b' },
  { id: 'offer', label: 'Offer', color: '#10b981' },
  { id: 'hired', label: 'Hired', color: '#10b981' },
  { id: 'rejected', label: 'Rejected', color: '#ef4444' },
];

export default function CandidateKanban({ candidates, onCandidateClick }: CandidateKanbanProps) {
  const [draggedCandidate, setDraggedCandidate] = useState<Candidate | null>(null);
  const queryClient = useQueryClient();

  const stageMutation = useMutation({
    mutationFn: async ({ id, stage }: { id: string; stage: string }) => {
      return api.updateCandidate(id, { stage });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
    },
  });

  const groupByStage = (candidates: Candidate[]) => {
    return STAGES.reduce((acc, stage) => {
      acc[stage.id] = candidates.filter(c => c.stage === stage.id);
      return acc;
    }, {} as Record<string, Candidate[]>);
  };

  const grouped = groupByStage(candidates);

  const handleDrop = (stageId: string) => {
    if (draggedCandidate && draggedCandidate.stage !== stageId) {
      stageMutation.mutate({ id: draggedCandidate.id, stage: stageId });
      setDraggedCandidate(null);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="kanban-board">
        {STAGES.map(stage => (
          <KanbanColumn
            key={stage.id}
            stage={stage}
            candidates={grouped[stage.id] || []}
            onDrop={handleDrop}
            onDragStart={(candidate) => setDraggedCandidate(candidate)}
            onCandidateClick={onCandidateClick}
          />
        ))}
      </div>
    </DndProvider>
  );
}

