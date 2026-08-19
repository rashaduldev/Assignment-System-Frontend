import type { Assignment, ClassCourse, Subject, User } from '@/types';

type Ref<T> = string | T;

/**
 * Every list/relation field from the API (assignment.subject, submission.student,
 * etc.) is typed as `string | PopulatedDoc` because the backend sometimes
 * returns a bare ObjectId string and sometimes a populated document,
 * depending on the endpoint. These helpers read through that union safely
 * in one place instead of each component re-deriving the same `typeof x === 'string' ? x : x.field` check.
 */

/** Extracts the Mongo ObjectId string from a possibly-populated reference. */
export function idOf<T extends { _id: string }>(ref: Ref<T>): string {
  return typeof ref === 'string' ? ref : ref._id;
}

/** Extracts a display name, falling back to the raw id string if unpopulated. */
export function nameOf<T extends { name: string }>(ref: Ref<T>): string {
  return typeof ref === 'string' ? ref : ref.name;
}

/** Formats a class/course with its optional section, e.g. "Class 10 - A". */
export function classLabel(ref: Ref<ClassCourse>): string {
  if (typeof ref === 'string') return ref;
  return ref.section ? `${ref.name} - ${ref.section}` : ref.name;
}

/** Display name for a possibly-populated Subject reference. */
export function subjectName(ref: Ref<Subject>): string {
  return nameOf(ref);
}

/** Display name for a possibly-populated User (teacher/student) reference. */
export function userName(ref: Ref<User>): string {
  return nameOf(ref);
}

/** { id, title } pair for a possibly-populated Assignment reference. */
export function assignmentRef(ref: Ref<Assignment>): { id: string; title: string } {
  return typeof ref === 'string' ? { id: ref, title: ref } : { id: ref._id, title: ref.title };
}
