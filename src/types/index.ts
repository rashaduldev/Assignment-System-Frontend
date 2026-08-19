export type UserRole = 'admin' | 'teacher' | 'student';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  classCourse?: string | ClassCourse;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ClassCourse {
  _id: string;
  name: string;
  section?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Subject {
  _id: string;
  name: string;
  classCourse: string | ClassCourse;
  createdAt: string;
  updatedAt: string;
}

export interface TeacherAssignment {
  _id: string;
  teacher: string | User;
  subject: string | Subject;
  classCourse: string | ClassCourse;
  createdAt: string;
  updatedAt: string;
}

export type AssignmentStatus = 'draft' | 'published';

export interface Assignment {
  _id: string;
  title: string;
  description: string;
  subject: string | Subject;
  classCourse: string | ClassCourse;
  teacher: string | User;
  deadline: string;
  maxMarks: number;
  status: AssignmentStatus;
  allowResubmission: boolean;
  createdAt: string;
  updatedAt: string;
}

export type SubmissionStatus = 'submitted' | 'resubmitted' | 'late' | 'reviewed';

export interface Submission {
  _id: string;
  assignment: string | Assignment;
  student: string | User;
  answerText?: string;
  fileUrl?: string;
  reviewedFileUrl?: string;
  status: SubmissionStatus;
  marks?: number;
  feedback?: string;
  submittedAt: string;
  gradedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssignmentSubmissionProgress {
  student: User;
  submission: Submission | null;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
