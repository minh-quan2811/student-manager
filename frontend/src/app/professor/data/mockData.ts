// frontend/src/app/professor/data/mockData.ts

export interface MentorshipRequest {
  id: number;
  groupId: number;
  groupName: string;
  leaderName: string;
  leaderId: number;
  description: string;
  requestMessage: string;
  timestamp: string;
  status: 'pending' | 'accepted' | 'rejected';
  rejectionNote?: string;
  members: number;
  maxMembers: number;
  neededSkills: string[];
}

export interface MentoredGroup {
  id: number;
  name: string;
  leaderId: number;
  leaderName: string;
  description: string;
  neededSkills: string[];
  currentMembers: number;
  maxMembers: number;
  members: GroupMember[];
  startDate: string;
  status: 'active' | 'completed';
}

export interface GroupMember {
  id: number;
  name: string;
  role: 'leader' | 'member';
  joinedAt: string;
}

// Current professor ID
export const CURRENT_PROFESSOR_ID = 1;
export const CURRENT_PROFESSOR_NAME = 'Dr. Sarah Smith';

export const mockMentorshipRequests: MentorshipRequest[] = [
  {
    id: 1,
    groupId: 100,
    groupName: 'Cloud Systems Lab',
    leaderName: 'Current User',
    leaderId: 10,
    description: 'Exploring distributed systems and cloud architecture',
    requestMessage: 'We are working on a cloud computing research project and would greatly benefit from your expertise in machine learning and AI. Our team is passionate about integrating AI models into distributed systems.',
    timestamp: '2024-03-10T10:30:00',
    status: 'pending',
    members: 2,
    maxMembers: 5,
    neededSkills: ['AWS', 'Docker', 'Kubernetes', 'Machine Learning']
  },
  {
    id: 2,
    groupId: 1,
    groupName: 'AI Research Group',
    leaderName: 'Alice Johnson',
    leaderId: 1,
    description: 'Working on machine learning projects',
    requestMessage: 'Our group is focused on deep learning research, particularly in computer vision. We would be honored to have you as our mentor to guide us through the complexities of neural network architectures.',
    timestamp: '2024-03-09T14:20:00',
    status: 'pending',
    members: 3,
    maxMembers: 5,
    neededSkills: ['Python', 'TensorFlow', 'Deep Learning']
  },
  {
    id: 3,
    groupId: 5,
    groupName: 'NLP Innovation Lab',
    leaderName: 'Emma Davis',
    leaderId: 5,
    description: 'Natural language processing and text analysis',
    requestMessage: 'We are developing cutting-edge NLP models and need guidance on optimizing our approach to transformer architectures and language model training.',
    timestamp: '2024-03-08T09:15:00',
    status: 'pending',
    members: 4,
    maxMembers: 6,
    neededSkills: ['Python', 'NLP', 'Transformers', 'PyTorch']
  },
  {
    id: 4,
    groupId: 201,
    groupName: 'Data Mining Team',
    leaderName: 'Bob Smith',
    leaderId: 2,
    description: 'Big data analysis and pattern recognition',
    requestMessage: 'Thank you for considering our previous request. We appreciate your time and feedback.',
    timestamp: '2024-03-05T11:00:00',
    status: 'rejected',
    rejectionNote: 'Unfortunately, I have reached my mentorship capacity for this semester. I encourage you to reach out to Dr. Michael Johnson who specializes in data mining.',
    members: 2,
    maxMembers: 4,
    neededSkills: ['Python', 'Data Mining', 'Statistics']
  }
];

export const mockMentoredGroups: MentoredGroup[] = [
  {
    id: 2,
    name: 'Web Dev Team',
    leaderId: 4,
    leaderName: 'David Lee',
    description: 'Building innovative web applications with AI integration',
    neededSkills: ['React', 'Node.js', 'Machine Learning'],
    currentMembers: 3,
    maxMembers: 4,
    members: [
      { id: 4, name: 'David Lee', role: 'leader', joinedAt: '2024-01-20' },
      { id: 8, name: 'Henry Wilson', role: 'member', joinedAt: '2024-02-15' },
      { id: 10, name: 'Current User', role: 'member', joinedAt: '2024-03-01' }
    ],
    startDate: '2024-01-20',
    status: 'active'
  },
  {
    id: 150,
    name: 'Computer Vision Lab',
    leaderId: 5,
    leaderName: 'Emma Davis',
    description: 'Advanced computer vision and image recognition research',
    neededSkills: ['Python', 'OpenCV', 'Deep Learning', 'TensorFlow'],
    currentMembers: 4,
    maxMembers: 5,
    members: [
      { id: 5, name: 'Emma Davis', role: 'leader', joinedAt: '2024-02-01' },
      { id: 2, name: 'Bob Smith', role: 'member', joinedAt: '2024-02-05' },
      { id: 7, name: 'Grace Chen', role: 'member', joinedAt: '2024-02-10' },
      { id: 1, name: 'Alice Johnson', role: 'member', joinedAt: '2024-02-15' }
    ],
    startDate: '2024-02-01',
    status: 'active'
  },
  {
    id: 99,
    name: 'Robotics AI Team',
    leaderId: 6,
    leaderName: 'Frank Miller',
    description: 'Integrating AI with robotics for autonomous systems',
    neededSkills: ['Python', 'ROS', 'Machine Learning', 'C++'],
    currentMembers: 3,
    maxMembers: 4,
    members: [
      { id: 6, name: 'Frank Miller', role: 'leader', joinedAt: '2023-09-15' },
      { id: 3, name: 'Carol White', role: 'member', joinedAt: '2023-09-20' },
      { id: 4, name: 'David Lee', role: 'member', joinedAt: '2023-10-01' }
    ],
    startDate: '2023-09-15',
    status: 'completed'
  }
];