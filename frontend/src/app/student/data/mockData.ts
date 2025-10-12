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

export interface GroupMember {
  id: number;
  name: string;
  role: 'leader' | 'member';
  joinedAt: string;
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
  members?: GroupMember[];
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

export interface GroupInvitation {
  id: number;
  groupId: number;
  groupName: string;
  leaderName: string;
  message: string;
  timestamp: string;
  status: 'pending' | 'accepted' | 'rejected';
}

// Current user ID (in a real app, this would come from auth)
export const CURRENT_USER_ID = 10;
export const CURRENT_USER_NAME = 'Current User';

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
    hasMentor: false,
    members: [
      { id: 1, name: 'Alice Johnson', role: 'leader', joinedAt: '2024-01-15' },
      { id: 2, name: 'Bob Smith', role: 'member', joinedAt: '2024-02-01' },
      { id: 5, name: 'Emma Davis', role: 'member', joinedAt: '2024-02-10' }
    ]
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
    mentorName: 'Dr. Emily Brown',
    members: [
      { id: 4, name: 'David Lee', role: 'leader', joinedAt: '2024-01-20' },
      { id: 8, name: 'Henry Wilson', role: 'member', joinedAt: '2024-02-15' }
    ]
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
    hasMentor: false,
    members: [
      { id: 3, name: 'Carol White', role: 'leader', joinedAt: '2024-01-10' },
      { id: 6, name: 'Frank Miller', role: 'member', joinedAt: '2024-01-25' },
      { id: 7, name: 'Grace Chen', role: 'member', joinedAt: '2024-02-05' },
      { id: 1, name: 'Alice Johnson', role: 'member', joinedAt: '2024-02-20' }
    ]
  },
];

export const mockMyGroups: Group[] = [
  {
    id: 100,
    name: 'Cloud Systems Lab',
    leaderId: CURRENT_USER_ID,
    leaderName: CURRENT_USER_NAME,
    description: 'Exploring distributed systems and cloud architecture',
    neededSkills: ['AWS', 'Docker', 'Kubernetes'],
    currentMembers: 2,
    maxMembers: 5,
    hasMentor: true,
    mentorName: 'Dr. Sarah Smith',
    members: [
      { id: CURRENT_USER_ID, name: CURRENT_USER_NAME, role: 'leader', joinedAt: '2024-01-01' },
      { id: 2, name: 'Bob Smith', role: 'member', joinedAt: '2024-01-15' }
    ]
  },
  {
    id: 2,
    name: 'Web Dev Team',
    leaderId: 4,
    leaderName: 'David Lee',
    description: 'Building innovative web applications',
    neededSkills: ['React', 'Node.js'],
    currentMembers: 3,
    maxMembers: 4,
    hasMentor: true,
    mentorName: 'Dr. Emily Brown',
    members: [
      { id: 4, name: 'David Lee', role: 'leader', joinedAt: '2024-01-20' },
      { id: 8, name: 'Henry Wilson', role: 'member', joinedAt: '2024-02-15' },
      { id: CURRENT_USER_ID, name: CURRENT_USER_NAME, role: 'member', joinedAt: '2024-03-01' }
    ]
  }
];

export const mockInvitations: GroupInvitation[] = [
  {
    id: 1,
    groupId: 1,
    groupName: 'AI Research Group',
    leaderName: 'Alice Johnson',
    message: 'We think your skills would be perfect for our machine learning project!',
    timestamp: '2024-03-10T10:30:00',
    status: 'pending'
  },
  {
    id: 2,
    groupId: 3,
    groupName: 'Mobile Innovation',
    leaderName: 'Carol White',
    message: 'Join us in building the next generation of mobile apps!',
    timestamp: '2024-03-09T14:20:00',
    status: 'pending'
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