// frontend/src/app/student/data/mockData.ts
export interface Student {
  id: number;
  name: string;
  email: string;
  gpa: number;
  major: string;
  skills: string[];
  bio: string;
  lookingForGroup: boolean;
  year: string;
}

export interface Group {
  id: number;
  name: string;
  leaderId: number;
  leaderName: string;
  description: string;
  neededSkills: string[];
  currentMembers: number;
  maxMembers: number;
  hasMentor: boolean;
  mentorName?: string;
}

export interface Professor {
  id: number;
  name: string;
  email: string;
  department: string;
  researchAreas: string[];
  availableSlots: number;
  totalSlots: number;
}

export const mockStudents: Student[] = [
  {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice@research.edu',
    gpa: 3.8,
    major: 'Computer Science',
    skills: ['React', 'Python', 'Machine Learning'],
    bio: 'Passionate about AI and web development',
    lookingForGroup: true,
    year: 'Junior'
  },
  {
    id: 2,
    name: 'Bob Smith',
    email: 'bob@research.edu',
    gpa: 3.9,
    major: 'Data Science',
    skills: ['Python', 'TensorFlow', 'Statistics'],
    bio: 'Interested in data analysis and AI',
    lookingForGroup: true,
    year: 'Senior'
  },
  {
    id: 3,
    name: 'Carol White',
    email: 'carol@research.edu',
    gpa: 3.7,
    major: 'Computer Science',
    skills: ['Java', 'Android', 'Kotlin'],
    bio: 'Mobile app developer',
    lookingForGroup: false,
    year: 'Sophomore'
  },
  {
    id: 4,
    name: 'David Lee',
    email: 'david@research.edu',
    gpa: 3.6,
    major: 'Software Engineering',
    skills: ['JavaScript', 'React', 'Node.js'],
    bio: 'Full-stack developer',
    lookingForGroup: true,
    year: 'Junior'
  },
  {
    id: 5,
    name: 'Emma Davis',
    email: 'emma@research.edu',
    gpa: 4.0,
    major: 'Artificial Intelligence',
    skills: ['Python', 'Machine Learning', 'Deep Learning'],
    bio: 'AI researcher',
    lookingForGroup: true,
    year: 'Senior'
  },
  {
    id: 6,
    name: 'Frank Miller',
    email: 'frank@research.edu',
    gpa: 3.5,
    major: 'Computer Science',
    skills: ['C++', 'Algorithms', 'Data Structures'],
    bio: 'Competitive programmer',
    lookingForGroup: false,
    year: 'Sophomore'
  },
  {
    id: 7,
    name: 'Grace Chen',
    email: 'grace@research.edu',
    gpa: 3.85,
    major: 'Data Science',
    skills: ['R', 'Python', 'Data Visualization'],
    bio: 'Data analyst passionate about insights',
    lookingForGroup: true,
    year: 'Junior'
  },
  {
    id: 8,
    name: 'Henry Wilson',
    email: 'henry@research.edu',
    gpa: 3.75,
    major: 'Software Engineering',
    skills: ['Vue.js', 'TypeScript', 'GraphQL'],
    bio: 'Frontend specialist',
    lookingForGroup: true,
    year: 'Senior'
  }
];

export const mockGroups: Group[] = [
  {
    id: 1,
    name: 'AI Research Group',
    leaderId: 1,
    leaderName: 'Alice Johnson',
    description: 'Working on machine learning projects',
    neededSkills: ['Python', 'TensorFlow'],
    currentMembers: 3,
    maxMembers: 5,
    hasMentor: false
  },
  {
    id: 2,
    name: 'Web Dev Team',
    leaderId: 4,
    leaderName: 'David Lee',
    description: 'Building innovative web applications',
    neededSkills: ['React', 'Node.js'],
    currentMembers: 2,
    maxMembers: 4,
    hasMentor: true,
    mentorName: 'Dr. Emily Brown'
  },
  {
    id: 3,
    name: 'Mobile Innovation',
    leaderId: 3,
    leaderName: 'Carol White',
    description: 'Creating mobile solutions',
    neededSkills: ['Android', 'Kotlin'],
    currentMembers: 4,
    maxMembers: 4,
    hasMentor: false
  },
  {
    id: 4,
    name: 'Data Analytics',
    leaderId: 2,
    leaderName: 'Bob Smith',
    description: 'Data-driven research projects',
    neededSkills: ['Python', 'Statistics', 'Data Visualization'],
    currentMembers: 2,
    maxMembers: 5,
    hasMentor: true,
    mentorName: 'Dr. Michael Johnson'
  },
  {
    id: 5,
    name: 'Cloud Computing Lab',
    leaderId: 8,
    leaderName: 'Henry Wilson',
    description: 'Exploring cloud technologies and distributed systems',
    neededSkills: ['AWS', 'Docker', 'Kubernetes'],
    currentMembers: 1,
    maxMembers: 4,
    hasMentor: true,
    mentorName: 'Dr. Emily Brown'
  },
  {
    id: 6,
    name: 'Cybersecurity Team',
    leaderId: 6,
    leaderName: 'Frank Miller',
    description: 'Research in security and cryptography',
    neededSkills: ['C++', 'Cryptography', 'Network Security'],
    currentMembers: 3,
    maxMembers: 5,
    hasMentor: false
  }
];

export const mockProfessors: Professor[] = [
  {
    id: 1,
    name: 'Dr. Sarah Smith',
    email: 'sarah.smith@research.edu',
    department: 'Computer Science',
    researchAreas: ['Machine Learning', 'AI'],
    availableSlots: 2,
    totalSlots: 5
  },
  {
    id: 2,
    name: 'Dr. Michael Johnson',
    email: 'michael.j@research.edu',
    department: 'Data Science',
    researchAreas: ['Statistics', 'Data Analysis'],
    availableSlots: 3,
    totalSlots: 4
  },
  {
    id: 3,
    name: 'Dr. Emily Brown',
    email: 'emily.b@research.edu',
    department: 'Software Engineering',
    researchAreas: ['Web Development', 'Cloud Computing'],
    availableSlots: 1,
    totalSlots: 3
  },
  {
    id: 4,
    name: 'Dr. Robert Taylor',
    email: 'robert.t@research.edu',
    department: 'Artificial Intelligence',
    researchAreas: ['Deep Learning', 'Neural Networks'],
    availableSlots: 0,
    totalSlots: 4
  },
  {
    id: 5,
    name: 'Dr. Linda Martinez',
    email: 'linda.m@research.edu',
    department: 'Data Science',
    researchAreas: ['Big Data', 'Data Mining'],
    availableSlots: 2,
    totalSlots: 5
  }
];