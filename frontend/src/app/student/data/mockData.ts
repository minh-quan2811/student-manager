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
    name: 'Nguyễn Ngọc Quang Thắng',
    email: 'thang.nguyen@research.edu',
    gpa: 4.0,
    major: 'Electronic engineering',
    skills: ['analog mixed signal', 'Python', 'AI'],
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
    skills: ['Circuit Design', 'VHDL', 'Microcontrollers (PIC, STM32)'],
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
    skills: ['PCB Layout', 'Altium Designer', 'Power Electronics'],
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
    skills: ['FPGA Programming (Verilog)', 'SystemVerilog', 'VLSI Design'],
    bio: 'Experienced in developing complex digital logic and ASIC design flows.',
    lookingForGroup: false,
    year: '2020'
  },
  {
    id: 6,
    name: 'Huỳnh Cao Đức',
    email: 'duc.huynh@research.edu',
    gpa: 3.1,
    major: 'Electronic engineering',
    skills: ['RF/Microwave Engineering', 'Antenna Design', 'Ansys HFSS'],
    bio: 'Passionate about wireless communication hardware and electromagnetic simulation.',
    lookingForGroup: true,
    year: '2020'
  },
  {
    id: 7,
    name: 'Trần Dĩ Kha',
    email: 'kha.tran@research.edu',
    gpa: 2.9,
    major: 'Electronic engineering',
    skills: ['Instrumentation', 'LabVIEW', 'Control Systems'],
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
    skills: ['5G/6G Networks', 'Network Protocols', 'C++'],
    bio: 'Deeply interested in next-generation mobile network architecture and optimization.',
    lookingForGroup: true,
    year: '2021'
  },
  {
    id: 9,
    name: 'Trần Vũ Đạt',
    email: 'dat.tran@research.edu',
    gpa: 2.7,
    major: 'Communication engineering',
    skills: ['Optical Fiber Communication', 'Telecommunication Systems', 'Python'],
    bio: 'Exploring the potential of optical networks for high-capacity data transmission.',
    lookingForGroup: false,
    year: '2021'
  },
  {
    id: 10,
    name: 'Nguyễn Thị Quỳnh Anh',
    email: 'anh.nguyenthi@research.edu',
    gpa: 3.7,
    major: 'Communication engineering',
    skills: ['OFDM', 'MIMO Systems', 'Digital Signal Processing (DSP)'],
    bio: 'Strong foundation in theoretical and practical aspects of advanced wireless communication techniques.',
    lookingForGroup: true,
    year: '2020'
  },
  {
    id: 11,
    name: 'Nguyễn Trọng Hiếu',
    email: 'hieu.nguyen@research.edu',
    gpa: 3.0,
    major: 'Communication engineering',
    skills: ['Network Security', 'Linux Administration', 'Cloud Networking'],
    bio: 'Focusing on securing communication channels and managing complex network infrastructure.',
    lookingForGroup: false,
    year: '2020'
  },
  {
    id: 12,
    name: 'Lê Quốc Duy',
    email: 'duy.le@research.edu',
    gpa: 3.6,
    major: 'Embedded system',
    skills: ['RTOS (FreeRTOS)', 'C Programming', 'ARM Architecture'],
    bio: 'Dedicated to developing real-time operating systems and optimizing low-level device drivers.',
    lookingForGroup: true,
    year: '2021'
  },
  {
    id: 13,
    name: 'Lê Gia Vinh',
    email: 'vinh.le@research.edu',
    gpa: 3.3,
    major: 'Embedded system',
    skills: ['IoT Protocols (MQTT, CoAP)', 'Sensor Interfacing', 'PlatformIO'],
    bio: 'Working on integrating embedded devices with cloud services for IoT applications.',
    lookingForGroup: true,
    year: '2021'
  },
  {
    id: 14,
    name: 'Trần Ngọc Hiệp',
    email: 'hiep.tran@research.edu',
    gpa: 2.9,
    major: 'Embedded system',
    skills: ['Automotive Embedded Systems', 'CAN Bus', 'LIN Bus'],
    bio: 'Aspiring to contribute to the field of vehicular electronics and in-car networks.',
    lookingForGroup: false,
    year: '2021'
  },
  {
    id: 15,
    name: 'Phạm Hữu Phước',
    email: 'phuoc.pham@research.edu',
    gpa: 3.1,
    major: 'Embedded system',
    skills: ['Machine Learning on Edge Devices', 'TensorFlow Lite', 'MicroPython'],
    bio: 'Exploring how to deploy efficient AI models directly onto resource-constrained microcontrollers.',
    lookingForGroup: true,
    year: '2021'
  },
  {
    id: 16,
    name: 'Nguyễn Quang Thạc',
    email: 'thac.nguyen@research.edu',
    gpa: 3.5,
    major: 'Embedded system',
    skills: ['Device Testing and Validation', 'JTAG/SWD Debugging', 'Assembly Language'],
    bio: 'Focused on ensuring the reliability and performance of embedded hardware and firmware.',
    lookingForGroup: true,
    year: '2021'
  }
];

export const mockGroups: Group[] = [
  {
    id: 1,
    name: 'ExAMS Group',
    leaderId: 1,
    leaderName: 'Nguyễn Ngọc Quang Thắng',
    description: 'Design SAR ADC on MATLAB',
    neededSkills: ['Matlab', 'analog & analog mixed signal'],
    currentMembers: 3,
    maxMembers: 5,
    hasMentor: false
  },
  {
    id: 2,
    name: 'FAST Chatbot Dev',
    leaderId: 8,
    leaderName: 'Đặng Minh Quân',
    description: 'Research and development of chatbot for consulting students of FAST faculty',
    neededSkills: ['React', 'Node.js', 'NLP (Natural Language Processing)'],
    currentMembers: 2,
    maxMembers: 4,
    hasMentor: false
  },
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
    leaderName: 'Nguyễn Thị Quỳnh Anh',
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
    description: 'Application of Object Detection Algorithm "YOLO" in Electrical Device Management',
    neededSkills: ['PyTorch/TensorFlow', 'YOLO Algorithm', 'Electrical Systems Knowledge'],
    currentMembers: 1,
    maxMembers: 3,
    hasMentor: true,
    mentorName: 'Phạm Văn Tuấn'
  },
  {
    id: 6,
    name: 'Smart IoT Eyewear',
    leaderId: 12,
    leaderName: 'Lê Quốc Duy',
    description: 'Smart eye-wear device with the internet of things and artificial intelligence',
    neededSkills: ['Embedded C', 'IoT Protocols (MQTT)', 'Low-Power Hardware Design'],
    currentMembers: 5,
    maxMembers: 6,
    hasMentor: false
  }
];

export const mockProfessors: Professor[] = [
  {
    id: 1,
    name: 'Dr.NGUYỄN THỊ ANH THƯ',
    email: 'thu.nguyen@research.edu',
    department: 'Electronic and Telecommunication Engineering',
    researchAreas: ['Machine Learning', 'AI'],
    availableSlots: 2,
    totalSlots: 5
  },
  {
    id: 2,
    name: 'Dr. NGUYỄN LÊ HÒA',
    email: 'hoa.nguyen@research.edu',
    department: 'Electronic and Telecommunication Engineering',
    researchAreas: ['power electronic', 'Automation'],
    availableSlots: 3,
    totalSlots: 4
  },
  {
    id: 3,
    name: 'Dr.NGUYỄN QUANG NHƯ QUỲNH',
    email: 'quynh.nguyen@research.edu',
    department: 'Electronic and Telecommunication Engineering',
    researchAreas: ['Communication', 'Start-up'],
    availableSlots: 1,
    totalSlots: 3
  },
  {
    id: 4,
    name: 'Dr. PHẠM VĂN TUẤN',
    email: 'tuan.pham@research.edu',
    department: 'Artificial Intelligence',
    researchAreas: ['Deep Learning', 'Neural Networks'],
    availableSlots: 0,
    totalSlots: 4
  },
  {
    id: 5,
    name: 'Dr.Lê Quốc Huy',
    email: 'huy.nguyen@research.edu',
    department: 'Electronic and Telecommunication Engineering',
    researchAreas: ['Embedded Systems', 'Electrical and Electronic Engineering'],
    availableSlots: 2,
    totalSlots: 5
  },
];