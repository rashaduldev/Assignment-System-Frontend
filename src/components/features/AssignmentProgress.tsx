'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { useAssignmentSubmissionProgress } from '@/hooks/useSubmissions';
import { GradingTable } from '@/components/features/GradingTable';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Field';
import { EmptyState } from '@/components/ui/Table';
import type { AssignmentSubmissionProgress } from '@/types';

export function AssignmentProgress({ assignmentId, maxMarks, initialData }: { assignmentId: string; maxMarks: number; initialData: AssignmentSubmissionProgress[] }) {
  const { data: progress = [] } = useAssignmentSubmissionProgress(assignmentId, initialData);
  const [query, setQuery] = useState('');
  const matches = (name: string, email: string) => !query.trim() || `${name} ${email}`.toLowerCase().includes(query.trim().toLowerCase());
  const submitted = progress.filter((item) => item.submission && matches(item.student.name, item.student.email));
  const missing = progress.filter((item) => !item.submission && matches(item.student.name, item.student.email));
  const totalSubmitted = progress.filter((item) => item.submission).length;

  return <div className="space-y-6">
    <div className="grid gap-3 sm:grid-cols-3">
      <Metric label="Students" value={progress.length} />
      <Metric label="Submitted" value={totalSubmitted} tone="ok" />
      <Metric label="Not submitted" value={progress.length - totalSubmitted} tone="danger" />
    </div>
    <div className="relative max-w-md"><Search className="absolute left-3 top-2.5 text-primary/40" size={16} /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search student name or email" className="pl-9" /></div>
    <section><h2 className="mb-3 font-display text-lg text-primary">Submitted work ({submitted.length})</h2>{submitted.length ? <GradingTable assignmentId={assignmentId} maxMarks={maxMarks} initialData={submitted.map((item) => item.submission!)} /> : <EmptyState message="No matching submissions." />}</section>
    <section><h2 className="mb-3 font-display text-lg text-primary">Not submitted ({missing.length})</h2>{missing.length ? <div className="rounded-md border border-primary/10 bg-white p-4"><div className="flex flex-wrap gap-2">{missing.map(({ student }) => <Badge key={student._id} tone="danger">{student.name} · {student.email}</Badge>)}</div></div> : <EmptyState message="Everyone has submitted." />}</section>
  </div>;
}

function Metric({ label, value, tone = 'neutral' }: { label: string; value: number; tone?: 'neutral' | 'ok' | 'danger' }) {
  const tones = { neutral: 'border-primary/10', ok: 'border-success/30', danger: 'border-danger/30' };
  return <div className={`rounded-md border bg-white px-4 py-3 ${tones[tone]}`}><p className="text-xs uppercase tracking-wide text-primary/55">{label}</p><p className="mt-1 text-2xl font-semibold text-primary">{value}</p></div>;
}
