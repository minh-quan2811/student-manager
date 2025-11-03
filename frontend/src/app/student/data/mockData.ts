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
export const CURRENT_USER_NAME = 'You';

export const mockStudents: Student[] = [
  {
    id: 1,
    name: 'Nguyễn Ngọc Quang Thắng',
    email: 'thang.nguyen@research.edu',
    gpa: 4.0,
    major: 'Electronic engineering',
    skills: ['analog mixed signal', 'Python', 'machine learning'],
    bio: 'Passionate about SoCand mixed signal',
    lookingForGroup: true,
    year: '2021'
  },
  {
    id: 2,
    name: 'Nguyễn Đình Sáng',
    email: 'sang.nguyen@research.edu',
    gpa: 3.5,
    major: 'Electronic engineering',
    skills: ['Circuit Design', 'MATLAB', 'Antenna Design'],
    bio: 'Fascinated by high-speed digital design and embedded systems.',
    lookingForGroup: true,
    year: '2021'
  },
  {
    id: 3,
    name: 'Lê Văn Đức',
    email: 'duc.le@research.edu',
    gpa: 2.8,
    major: 'Electronic engineering',
    skills: ['TensorFlow Lite', 'analog mixed signal', 'Circuit Design'],
    bio: 'Interested in renewable energy systems and power supply optimization.',
    lookingForGroup: false,
    year: '2021'
  },
  {
    id: 4,
    name: 'Nguyễn Thành Minh',
    email: 'minh.nguyen@research.edu',
    gpa: 3.2,
    major: 'Electronic engineering',
    skills: ['Signal Processing', 'MATLAB', 'Python'],
    bio: 'Focusing on filtering techniques and real-time data analysis in electronic devices.',
    lookingForGroup: true,
    year: '2021'
  },
  {
    id: 5,
    name: 'Hoàng Tuấn Anh',
    email: 'anh.hoang@research.edu',
    gpa: 3.8,
    major: 'Electronic engineering',
    skills: ['machine learning', 'javascript', 'react'],
    bio: 'Interesting in Web design',
    lookingForGroup: false,
    year: '2020'
  },
  {
    id: 6,
    name: 'Huỳnh Cao Đức',
    email: 'duc.huynh@research.edu',
    gpa: 3.1,
    major: 'Electronic engineering',
    skills: ['Telecommunication Systems', 'Optical Fiber Communication'],
    bio: 'Passionate about wireless communication system and electromagnetic simulation.',
    lookingForGroup: true,
    year: '2020'
  },
  {
    id: 7,
    name: 'Trần Dĩ Kha',
    email: 'kha.tran@research.edu',
    gpa: 2.9,
    major: 'Electronic engineering',
    skills: ['machine learning', 'Python', 'Data Science'],
    bio: 'Seeking projects involving industrial automation and precise measurement equipment.',
    lookingForGroup: true,
    year: '2020'
  },
  {
    id: 8,
    name: 'Đặng Minh Quân',
    email: 'quan.dang@research.edu',
    gpa: 3.4,
    major: 'Communication engineering',
    skills: ['machine learning', 'Data Science', 'JavaScript'],
    bio: 'Deeply interested in machine learning architecture and optimization.',
    lookingForGroup: true,
    year: '2021'
  },
];

export const mockGroups: Group[] = [
  {
    id: 3,
    name: 'Aquatic Freshness Tech',
    leaderId: 3,
    leaderName: 'Lê Văn Đức',
    description: 'Effective low-cost features for fish freshness determination on extended self-build database',
    neededSkills: ['Image Processing', 'Python', 'Computer Vision'],
    currentMembers: 4,
    maxMembers: 5,
    hasMentor: true,
    mentorName: 'Nguyễn Thị Anh Thư'
  },
  {
    id: 4,
    name: 'Mobile Optical Imaging',
    leaderId: 10,
    leaderName: 'Nguyễn Thành Minh',
    description: 'Development Of A Smartphone Based Optical Imaging Application',
    neededSkills: ['Mobile Development (Android/iOS)', 'Java/Kotlin', 'Signal Processing'],
    currentMembers: 3,
    maxMembers: 5,
    hasMentor: false

  },
  {
    id: 5,
    name: 'YOLO Electrical Management',
    leaderId: 5,
    leaderName: 'Hoàng Tuấn Anh',
    description: 'Applying the YOLO algorithm to automatically monitor, recognize, and manage electrical devices in industrial or home environments.',
    neededSkills: ['PyTorch/TensorFlow'],
    currentMembers: 1,
    maxMembers: 3,
    hasMentor: true,
    mentorName: 'Phạm Văn Tuấn'
  },
  {
    id: 6,
    name: 'Smart IoT Eyewear',
    leaderId: 12,
    leaderName: 'Trần Dĩ Kha',
    description: 'Smart eye-wear device with the internet of things and artificial intelligence',
    neededSkills: ['Embedded C', 'IoT Protocols (MQTT)', 'Low-Power Hardware Design'],
    currentMembers: 5,
    maxMembers: 5,
    hasMentor: false
  },
  {
    id: 7,
    name: 'FAST Chatbot Dev',
    leaderId: CURRENT_USER_ID,
    leaderName: 'Đặng Minh Quân',
    description: 'Smart eye-wear device with the internet of things and artificial intelligence',
    neededSkills: ['Embedded C', 'IoT Protocols (MQTT)', 'Low-Power Hardware Design'],
    currentMembers: 5,
    maxMembers: 5,
    hasMentor: false
  }
];

export const mockMyGroups: Group[] = [
  {
    id: 100,
    name: 'FAST Chatbot Dev',
    leaderId: CURRENT_USER_ID,
    leaderName: CURRENT_USER_NAME,
    description: 'Research and development of chatbot for consulting students of FAST faculty',
    neededSkills: ['React', 'Node.js', 'NLP (Natural Language Processing)'],
    currentMembers: 2,
    maxMembers: 5,
    hasMentor: true,
    mentorName: 'Dr.NGUYỄN THỊ ANH THƯ',
    members: [
      { id: CURRENT_USER_ID, name: CURRENT_USER_NAME, role: 'leader', joinedAt: '2024-01-01' },
      { id: 2, name: 'Nguyễn Thành Minh', role: 'member', joinedAt: '2024-01-15' }
    ]
  },
  {
    id: 2,
    name: 'ExAMS Group',
    leaderId: 1,
    leaderName: 'Nguyễn Ngọc Quang Thắng',
    description: 'Design SAR ADC on MATLAB',
    neededSkills: ['Matlab', 'analog & analog mixed signal'],
    currentMembers: 3,
    maxMembers: 4,
    hasMentor: true,
    mentorName: 'Dr. NGUYỄN LÊ HÒA',
    members: [
      { id: 2, name: 'Nguyễn Ngọc Quang Thắng', role: 'leader', joinedAt: '2024-01-20' },
      { id: 3, name: 'Lê Văn Đức', role: 'member', joinedAt: '2024-02-15' },
      { id: CURRENT_USER_ID, name: CURRENT_USER_NAME, role: 'member', joinedAt: '2024-03-01' }
    ]
  }
];

export const mockInvitations: GroupInvitation[] = [
  {
    id: 3,
    groupId: 3,
    groupName: 'Smart Parking System Based on GPS, Camera and LoRaWan Technology',
    leaderName: 'Lê Văn Đức',
    message: 'We think your skills would be perfect for our project!',
    timestamp: '2024-03-10T10:30:00',
    status: 'pending'
  },
  {
    id: 2,
    groupId: 3,
    groupName: 'Mobile Optical Imaging',
    leaderName: 'Nguyễn Thành Minh',
    message: 'Development Of A Smartphone Based Optical Imaging Application',
    timestamp: '2024-03-09T14:20:00',
    status: 'pending'
  }
];

export const mockProfessors: Professor[] = [
  {
    id: 1,
    name: 'Dr.NGUYỄN THỊ ANH THƯ',
    email: 'thu.nguyen@research.edu',
    department: 'Electronic and Telecommunication Engineering',
    researchAreas: ['Machine Learning', 'AI', 'Computer Vision', 'Data Mining'],
    availableSlots: 2,
    totalSlots: 5
  },
  {
    id: 2,
    name: 'Dr. NGUYỄN LÊ HÒA',
    email: 'hoa.nguyen@research.edu',
    department: 'Electronic and Telecommunication Engineering',
    researchAreas: ['Power Electronics', 'Automation', 'Control Systems', 'Renewable Energy'],
    availableSlots: 3,
    totalSlots: 4
  },
  {
    id: 3,
    name: 'Dr.NGUYỄN QUANG NHƯ QUỲNH',
    email: 'quynh.nguyen@research.edu',
    department: 'Electronic and Telecommunication Engineering',
    researchAreas: ['Communication Systems', 'Start-up', 'Wireless Networks', 'Innovation & Tech Transfer'],
    availableSlots: 1,
    totalSlots: 3
  },
  {
    id: 4,
    name: 'Dr. PHẠM VĂN TUẤN',
    email: 'tuan.pham@research.edu',
    department: 'Artificial Intelligence',
    researchAreas: ['Deep Learning', 'Neural Networks', 'Optimization Algorithms', 'Reinforcement Learning'],
    availableSlots: 0,
    totalSlots: 4
  },
  {
    id: 5,
    name: 'Dr.LÊ QUỐC HUY',
    email: 'huy.nguyen@research.edu',
    department: 'Electronic and Telecommunication Engineering',
    researchAreas: ['Embedded Systems', 'IoT', 'Microcontroller Programming', 'Electrical and Electronic Engineering'],
    availableSlots: 2,
    totalSlots: 5
  },
];