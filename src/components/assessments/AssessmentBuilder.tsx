import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../../services/api';
import Button from '../ui/Button';
import Input from '../ui/Input';
import './AssessmentBuilder.css';

interface AssessmentBuilderProps {
  jobId: string;
  onClose: () => void;
}

const QUESTION_TYPES = [
  { value: 'single_choice', label: 'Single Choice' },
  { value: 'multi_choice', label: 'Multiple Choice' },
  { value: 'short_text', label: 'Short Text' },
  { value: 'long_text', label: 'Long Text' },
  { value: 'numeric', label: 'Numeric' },
  { value: 'file', label: 'File Upload' },
];

export default function AssessmentBuilder({ jobId, onClose }: AssessmentBuilderProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sections, setSections] = useState<any[]>([]);
  
  const queryClient = useQueryClient();

  const { data: existingAssessment } = useQuery({
    queryKey: ['assessment', jobId],
    queryFn: async () => {
      return api.fetchAssessmentByJobId(jobId);
    },
  });

  useEffect(() => {
    if (existingAssessment) {
      setTitle(existingAssessment.title);
      setDescription(existingAssessment.description);
      setSections(existingAssessment.sections || []);
    }
  }, [existingAssessment]);

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      return api.saveAssessment(jobId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessments'] });
      onClose();
    },
  });

  const addSection = () => {
    setSections([
      ...sections,
      {
        id: crypto.randomUUID(),
        title: '',
        questions: [],
      },
    ]);
  };

  const updateSection = (sectionId: string, updates: any) => {
    setSections(sections.map(s => s.id === sectionId ? { ...s, ...updates } : s));
  };

  const addQuestion = (sectionId: string) => {
    const question = {
      id: crypto.randomUUID(),
      type: 'single_choice',
      question: '',
      required: false,
      options: [],
    };
    setSections(sections.map(s =>
      s.id === sectionId
        ? { ...s, questions: [...s.questions, question] }
        : s
    ));
  };

  const updateQuestion = (sectionId: string, questionId: string, updates: any) => {
    setSections(sections.map(s =>
      s.id === sectionId
        ? {
            ...s,
            questions: s.questions.map((q: any) =>
              q.id === questionId ? { ...q, ...updates } : q
            ),
          }
        : s
    ));
  };

  const handleSave = () => {
    saveMutation.mutate({
      title,
      description,
      sections,
    });
  };

  return (
    <div className="assessment-builder">
      <div className="builder-header">
        <h2>Assessment Builder</h2>
        <Button variant="success" onClick={handleSave} disabled={saveMutation.isPending}>
          {saveMutation.isPending ? 'Saving...' : 'Save Assessment'}
        </Button>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
      </div>

      <div className="builder-content">
        <div className="form-section">
          <Input
            label="Assessment Title"
            name="assessment-title"
            value={title}
            onChange={setTitle}
            placeholder="e.g., Frontend Developer Assessment"
          />
          <Input
            label="Description"
            name="assessment-description"
            value={description}
            onChange={setDescription}
            multiline
            rows={3}
          />
        </div>

        <div className="sections-container">
          {sections.map((section, sectionIdx) => (
            <div key={section.id} className="section-block">
              <Input
                label={`Section ${sectionIdx + 1} Title`}
                name={`section-${section.id}-title`}
                value={section.title}
                onChange={(value) => updateSection(section.id, { title: value })}
                placeholder="Section title..."
              />
              <div className="questions-list">
                {section.questions.map((question: any, _qIdx: number) => (
                  <div key={question.id} className="question-block">
                    <div className="question-header">
                      <select
                        value={question.type}
                        onChange={(e) => updateQuestion(section.id, question.id, { type: e.target.value })}
                        className="question-type-select"
                      >
                        {QUESTION_TYPES.map(type => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                      <button
                        className="remove-btn"
                        onClick={() => {
                          setSections(sections.map(s =>
                            s.id === section.id
                              ? { ...s, questions: s.questions.filter((q: any) => q.id !== question.id) }
                              : s
                          ));
                        }}
                      >
                        Remove
                      </button>
                    </div>
                    <Input
                      name={`section-${section.id}-question-${question.id}`}
                      value={question.question}
                      onChange={(value) => updateQuestion(section.id, question.id, { question: value })}
                      placeholder="Question text..."
                    />
                    {(question.type === 'single_choice' || question.type === 'multi_choice') && (
                      <div className="options-editor">
                        <label>Options</label>
                        {question.options?.map((opt: string, optIdx: number) => (
                          <Input
                            key={optIdx}
                            name={`section-${section.id}-question-${question.id}-opt-${optIdx}`}
                            value={opt}
                            onChange={(value) => {
                              const newOptions = [...question.options];
                              newOptions[optIdx] = value;
                              updateQuestion(section.id, question.id, { options: newOptions });
                            }}
                            placeholder="Option..."
                          />
                        ))}
                        <Button
                          size="small"
                          onClick={() => updateQuestion(section.id, question.id, {
                            options: [...(question.options || []), ''],
                          })}
                        >
                          + Add Option
                        </Button>
                      </div>
                    )}
                    {(question.type === 'short_text' || question.type === 'long_text') && (
                    <Input
                      name={`section-${section.id}-question-${question.id}-maxlength`}
                        value={question.maxLength?.toString() || ''}
                        onChange={(value) => updateQuestion(section.id, question.id, {
                          maxLength: parseInt(value) || undefined,
                        })}
                        type="number"
                        placeholder="Max length (optional)"
                      />
                    )}
                  </div>
                ))}
                <Button size="small" onClick={() => addQuestion(section.id)}>
                  + Add Question
                </Button>
              </div>
            </div>
          ))}
          <Button variant="secondary" onClick={addSection}>
            + Add Section
          </Button>
        </div>
      </div>
    </div>
  );
}

