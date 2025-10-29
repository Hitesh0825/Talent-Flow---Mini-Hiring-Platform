import { useState, useEffect } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import './JobForm.css';

interface Job {
  id: string;
  title: string;
  slug: string;
  status: 'active' | 'archived';
  tags: string[];
  order: number;
  description?: string;
}

interface JobFormProps {
  job?: Job | null;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
}

const AVAILABLE_TAGS = [
  'Remote', 'Full-time', 'Contract', 'Part-time', 'Urgent',
  'Senior', 'Junior', 'Entry-level', 'Tech', 'Sales',
  'Marketing', 'Finance', 'Operations', 'Design', 'Management',
];

export default function JobForm({ job, onClose, onSubmit, isSubmitting }: JobFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (job) {
      setTitle(job.title);
      setDescription(job.description || '');
      setTags(job.tags);
    }
  }, [job]);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const slug = generateSlug(title);
    onSubmit({
      ...(job && { id: job.id }),
      title,
      slug,
      description,
      tags,
      status: job?.status || 'active',
      order: job?.order || 0,
    });
  };

  const toggleTag = (tag: string) => {
    setTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{job ? 'Edit Job' : 'Create New Job'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="job-form">
          <Input
            label="Job Title"
            name="title"
            value={title}
            onChange={setTitle}
            placeholder="e.g., Senior Frontend Developer"
            required
            error={errors.title}
          />

          <Input
            label="Description"
            name="description"
            value={description}
            onChange={setDescription}
            placeholder="Enter job description..."
            multiline
            rows={6}
          />

          <div className="form-group">
            <label className="input-label">Tags</label>
            <div className="tags-selector">
              {AVAILABLE_TAGS.map(tag => (
                <button
                  key={tag}
                  type="button"
                  className={`tag-btn ${tags.includes(tag) ? 'selected' : ''}`}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : job ? 'Update Job' : 'Create Job'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

