// Types
export interface Student {
  id: string;
  name: string;
  class: string;
  faculty: string;
  year: number;
  gpa: number;
  major: string;
  email: string;
  skills?: string[];
  bio?: string;
}

export interface Professor {
  id: string;
  name: string;
  faculty: string;
  field: string;
  achievements: string;
  email: string;
  publications: number;
  bio?: string;
  researchInterests?: string[];
}

export interface ResearchMember {
  studentId: string;
  name: string;
  role: string;
  gpa: number;
  major: string;
}

export interface Research {
  id: string;
  groupName: string;
  faculty: string;
  year: number;
  rank: number;
  members: number;
  topic: string;
  leader: string;
  description: string;
  teamMembers: ResearchMember[];
  professors: string[]; // Professor IDs
  paperPath?: string; // Path to PDF in public/papers/
  abstract?: string;
}

// Mock Students Data - ADD MORE AS NEEDED
export const mockStudents: Student[] = [
  { 
    id: 'S001', 
    name: 'John Doe', 
    class: 'CS-2021', 
    faculty: 'Computer Science', 
    year: 2021, 
    gpa: 3.8, 
    major: 'Software Engineering', 
    email: 'john@research.edu',
    skills: ['Python', 'Machine Learning', 'TensorFlow', 'Computer Vision'],
    bio: 'Passionate about AI and healthcare applications. Leading the AI Vision Team with focus on medical diagnostics.'
  },
  // Add more students here...
];

// Additional students for CSV upload simulation
export const additionalStudents: Student[] = [
  { 
    id: 'S009', 
    name: 'Alex Taylor', 
    class: 'CS-2024', 
    faculty: 'Computer Science', 
    year: 2024, 
    gpa: 3.95, 
    major: 'Machine Learning', 
    email: 'alex@research.edu',
    skills: ['Quantum Computing', 'Advanced Algorithms', 'Python', 'Research'],
    bio: 'Exploring quantum computing applications in machine learning.'
  },
  // Add more students here...
];

// Mock Professors Data - ADD MORE AS NEEDED
export const mockProfessors: Professor[] = [
  { 
    id: 'P001', 
    name: 'Dr. Robert Chen', 
    faculty: 'Computer Science', 
    field: 'Machine Learning', 
    achievements: 'Published 50+ papers, IEEE Fellow', 
    email: 'robert.chen@research.edu', 
    publications: 52,
    bio: 'Leading expert in machine learning and AI with over 15 years of research experience. Focus on healthcare applications and computer vision.',
    researchInterests: ['Deep Learning', 'Computer Vision', 'Medical AI', 'Neural Networks']
  },
  // Add more professors here...
];

// Additional professors for CSV upload simulation
export const additionalProfessors: Professor[] = [
  { 
    id: 'P007', 
    name: 'Dr. David Kim', 
    faculty: 'Computer Science', 
    field: 'Natural Language Processing', 
    achievements: 'AAAI Fellow, 40+ papers', 
    email: 'david.kim@research.edu', 
    publications: 42,
    bio: 'NLP researcher specializing in multilingual systems and language models.',
    researchInterests: ['NLP', 'Language Models', 'Translation', 'Text Mining']
  },
  // Add more professors here...
];

// Mock Research Data - ADD MORE AS NEEDED
// IMPORTANT: To add your own PDFs:
// 1. Place your PDF files in: frontend/public/papers/
// 2. Update the paperPath field with the filename (e.g., 'your-paper.pdf')
// 3. The path will be: /papers/your-paper.pdf
export const mockResearch: Research[] = [
  { 
    id: 'R001', 
    groupName: 'AI Vision Team', 
    faculty: 'Computer Science', 
    year: 2024, 
    rank: 1, 
    members: 4, 
    topic: 'Computer Vision for Healthcare', 
    leader: 'John Doe', 
    description: 'Developing AI-powered diagnostic tools using computer vision',
    teamMembers: [
      { studentId: 'S001', name: 'John Doe', role: 'Team Leader', gpa: 3.8, major: 'Software Engineering' },
      { studentId: 'S007', name: 'David Lee', role: 'ML Engineer', gpa: 3.92, major: 'Cybersecurity' },
      { studentId: 'S003', name: 'Mike Johnson', role: 'Data Analyst', gpa: 3.6, major: 'AI & ML' },
      { studentId: 'S005', name: 'Tom Brown', role: 'Backend Developer', gpa: 3.5, major: 'Data Science' }
    ],
    professors: ['P001', 'P003'], // Must match professor IDs
    paperPath: '/papers/ai-vision-healthcare.pdf', // ← UPDATE THIS with your actual PDF filename
    abstract: 'This research explores the application of deep learning computer vision techniques in healthcare diagnostics. We developed a convolutional neural network model capable of detecting anomalies in medical imaging with 94% accuracy.'
  },
  // Add more research groups here...
];

// Additional research groups for CSV upload simulation
export const additionalResearch: Research[] = [
  { 
    id: 'R009', 
    groupName: 'Quantum Computing', 
    faculty: 'Computer Science', 
    year: 2024, 
    rank: 1, 
    members: 4, 
    topic: 'Quantum Algorithms', 
    leader: 'Alex Taylor', 
    description: 'Exploring quantum computing applications',
    teamMembers: [
      { studentId: 'S009', name: 'Alex Taylor', role: 'Team Leader', gpa: 3.95, major: 'Machine Learning' },
      { studentId: 'S001', name: 'John Doe', role: 'Software Engineer', gpa: 3.8, major: 'Software Engineering' },
      { studentId: 'S003', name: 'Mike Johnson', role: 'Algorithm Designer', gpa: 3.6, major: 'AI & ML' },
      { studentId: 'S007', name: 'David Lee', role: 'Security Analyst', gpa: 3.92, major: 'Cybersecurity' }
    ],
    professors: ['P001', 'P003'],
    paperPath: '/papers/quantum-algorithms.pdf', // ← UPDATE THIS
    abstract: 'Investigation of quantum machine learning algorithms for optimization problems, demonstrating exponential speedup over classical approaches.'
  },
  // Add more research groups here...
];

// Filter Options
export const faculties = ['all', 'Computer Science', 'Electrical Engineering', 'Mechanical Engineering'];
export const years = ['all', '2021', '2022', '2023', '2024'];