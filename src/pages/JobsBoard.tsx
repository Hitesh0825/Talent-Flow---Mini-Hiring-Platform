import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import JobList from '../components/jobs/JobList';
import JobForm from '../components/jobs/JobForm';
import FilterBar from '../components/jobs/FilterBar';
import Button from '../components/ui/Button';
import './JobsBoard.css';

import * as api from '../services/api';

interface Job {
  id: string;
  title: string;
  slug: string;
  status: 'active' | 'archived';
  tags: string[];
  order: number;
  description?: string;
}

async function fetchJobs(params: any) {
  return api.fetchJobs(params);
}

export default function JobsBoard() {
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    tags: [] as string[],
  });
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['jobs', filters, page],
    queryFn: () => fetchJobs({ ...filters, page }),
  });

  const mutation = useMutation({
    mutationFn: async (updates: any) => {
      if (editingJob) {
        return api.updateJob(editingJob.id, updates);
      }
      return api.createJob(updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      setShowForm(false);
      setEditingJob(null);
    },
  });

  const archiveMutation = useMutation({
    mutationFn: async (id: string) => {
      return api.updateJob(id, { status: 'archived' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });

  const handleCreate = () => {
    setEditingJob(null);
    setShowForm(true);
  };

  const handleEdit = (job: Job) => {
    setEditingJob(job);
    setShowForm(true);
  };

  const handleSubmit = (jobData: any) => {
    mutation.mutate(jobData);
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading jobs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">Error loading jobs: {(error as Error).message}</p>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="jobs-board">
        <div className="jobs-header">
          <div>
            <h2>Jobs Board</h2>
            <p className="subtitle">Manage and organize your job postings</p>
          </div>
          <Button onClick={handleCreate} variant="primary">
            + New Job
          </Button>
        </div>

        <FilterBar
          filters={filters}
          onFilterChange={setFilters}
          onReset={() => {
            setFilters({ search: '', status: '', tags: [] });
            setPage(1);
          }}
        />

        {data && data.data && (
          <JobList
            jobs={data.data}
            onEdit={handleEdit}
            onArchive={archiveMutation.mutate}
            onReorder={async (fromOrder, toOrder) => {
              try {
                await api.reorderJobs(fromOrder, toOrder);
                queryClient.invalidateQueries({ queryKey: ['jobs'] });
              } catch (error) {
                console.error('Failed to reorder:', error);
              }
            }}
          />
        )}

        <div className="pagination">
          <Button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            variant="secondary"
          >
            Previous
          </Button>
          <span>
            Page {page} of {data?.pagination.totalPages || 1}
          </span>
          <Button
            onClick={() => setPage(p => p + 1)}
            disabled={page >= (data?.pagination.totalPages || 1)}
            variant="secondary"
          >
            Next
          </Button>
        </div>

        {showForm && (
          <JobForm
            job={editingJob}
            onClose={() => {
              setShowForm(false);
              setEditingJob(null);
            }}
            onSubmit={handleSubmit}
            isSubmitting={mutation.isPending}
          />
        )}
      </div>
    </DndProvider>
  );
}

