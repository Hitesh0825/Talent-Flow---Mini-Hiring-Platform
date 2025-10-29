import { useEffect, useState } from 'react';
import { getAllJobs, getAllCandidates, getAllAssessments } from '../database/jsonStorage';

export default function DebugView() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      const jobsArr = getAllJobs();
      const candidatesArr = getAllCandidates();
      const assessmentsArr = getAllAssessments();
      const jobs = jobsArr.length;
      const candidates = candidatesArr.length;
      const assessments = assessmentsArr.length;
      const sampleJobs = jobsArr.slice(0, 3);
      const sampleCandidates = candidatesArr.slice(0, 3);
      
      setStats({
        jobs,
        candidates,
        assessments,
        sampleJobs,
        sampleCandidates,
      });
    };

    fetchStats();
  }, []);

  if (!stats) return <div>Loading debug info...</div>;

  return (
    <div style={{ padding: '2rem', background: '#f0f0f0', borderRadius: '0.5rem', margin: '1rem 0' }}>
      <h3>Database Debug Info</h3>
      <div style={{ margin: '1rem 0' }}>
        <strong>Jobs:</strong> {stats.jobs}<br />
        <strong>Candidates:</strong> {stats.candidates}<br />
        <strong>Assessments:</strong> {stats.assessments}
      </div>
      
      <details>
        <summary>Sample Jobs (first 3)</summary>
        <pre style={{ background: 'white', padding: '1rem', borderRadius: '0.5rem', overflow: 'auto' }}>
          {JSON.stringify(stats.sampleJobs, null, 2)}
        </pre>
      </details>
      
      <details>
        <summary>Sample Candidates (first 3)</summary>
        <pre style={{ background: 'white', padding: '1rem', borderRadius: '0.5rem', overflow: 'auto' }}>
          {JSON.stringify(stats.sampleCandidates, null, 2)}
        </pre>
      </details>
    </div>
  );
}

