import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import CandidateKanban from '../components/candidates/CandidateKanban';
import CandidateForm from '../components/candidates/CandidateForm';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import * as api from '../services/api';
import './Candidates.css';

async function fetchCandidates(params: any) {
  return api.fetchCandidates(params);
}

export default function Candidates() {
  const [search, setSearch] = useState('');
  const [selectedStage, setSelectedStage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<any>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['candidates', search, selectedStage],
    queryFn: () => fetchCandidates({ search, stage: selectedStage }),
  });

  const mutation = useMutation({
    mutationFn: async (candidateData: any) => {
      if (editingCandidate) {
        return api.updateCandidate(editingCandidate.id, candidateData);
      }
      return api.createCandidate(candidateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
      setShowForm(false);
      setEditingCandidate(null);
    },
  });

  const handleCandidateClick = (id: string) => {
    navigate(`/candidates/${id}`);
  };

  const handleCreate = () => {
    setEditingCandidate(null);
    setShowForm(true);
  };

  const handleSubmit = (candidateData: any) => {
    mutation.mutate(candidateData);
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading candidates...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">Error loading candidates: {(error as Error).message}</p>
      </div>
    );
  }

  return (
    <div className="candidates-page">
      <div className="candidates-header">
        <div>
          <h2>Candidates</h2>
          <p className="subtitle">Manage and track candidate progress</p>
        </div>
        <Button onClick={handleCreate} variant="primary">
          + Add Candidate
        </Button>
      </div>

      <div className="candidates-filters">
        <Input
          name="search"
          value={search}
          onChange={setSearch}
          placeholder="Search by name or email..."
        />
        <select
          value={selectedStage}
          onChange={(e) => setSelectedStage(e.target.value)}
          className="stage-filter"
        >
          <option value="">All Stages</option>
          <option value="applied">Applied</option>
          <option value="screen">Screen</option>
          <option value="tech">Tech</option>
          <option value="offer">Offer</option>
          <option value="hired">Hired</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {data && (
        <CandidateKanban
          candidates={data.data}
          onCandidateClick={handleCandidateClick}
        />
      )}

      {showForm && (
        <CandidateForm
          candidate={editingCandidate}
          onClose={() => {
            setShowForm(false);
            setEditingCandidate(null);
          }}
          onSubmit={handleSubmit}
          isSubmitting={mutation.isPending}
        />
      )}
    </div>
  );
}

