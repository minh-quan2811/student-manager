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
  {
    id: 'S002',
    name: 'Nguyễn Đình Sáng',
    class: '21ECE',
    faculty: 'FAST',
    year: 2021,
    gpa: 3.5,
    major: 'Electronic engineering',
    email: 'sang.nguyen@research.edu',
    skills: ['Circuit Design', 'VHDL', 'Microcontrollers (PIC, STM32)'],
    bio: 'Fascinated by high-speed digital design and embedded systems.'
  },
  {
    id: 'S003',
    name: 'Lê Văn Đức',
    class: '21ECE',
    faculty: 'FAST',
    year: 2021,
    gpa: 2.8,
    major: 'Electronic engineering',
    email: 'duc.le@research.edu',
    skills: ['PCB Layout', 'Altium Designer', 'Power Electronics'],
    bio: 'Interested in renewable energy systems and power supply optimization.'
  },
  {
    id: 'S004',
    name: 'Nguyễn Thành Minh',
    class: '21ECE',
    faculty: 'FAST',
    year: 2021,
    gpa: 3.2,
    major: 'Electronic engineering',
    email: 'minh.nguyen@research.edu',
    skills: ['Signal Processing', 'MATLAB', 'Python'],
    bio: 'Focusing on filtering techniques and real-time data analysis in electronic devices.'
  },
  {
    id: 'S005',
    name: 'Hoàng Tuấn Anh',
    class: '20ECE',
    faculty: 'FAST',
    year: 2020,
    gpa: 3.8,
    major: 'Electronic engineering',
    email: 'anh.hoang@research.edu',
    skills: ['FPGA Programming (Verilog)', 'SystemVerilog', 'VLSI Design'],
    bio: 'Experienced in developing complex digital logic and ASIC design flows.'
  },
  {
    id: 'S006',
    name: 'Huỳnh Cao Đức',
    class: '20ECE',
    faculty: 'FAST',
    year: 2020,
    gpa: 3.1,
    major: 'Electronic engineering',
    email: 'duc.huynh@research.edu',
    skills: ['RF/Microwave Engineering', 'Antenna Design', 'Ansys HFSS'],
    bio: 'Passionate about wireless communication hardware and electromagnetic simulation.'
  },
  {
    id: 'S007',
    name: 'Trần Dĩ Kha',
    class: '20ECE',
    faculty: 'FAST',
    year: 2020,
    gpa: 2.9,
    major: 'Electronic engineering',
    email: 'kha.tran@research.edu',
    skills: ['Instrumentation', 'LabVIEW', 'Control Systems'],
    bio: 'Seeking projects involving industrial automation and precise measurement equipment.'
  },
    {
    id: 'S008',
    name: 'Đặng Minh Quân',
    class: '21ECE',
    faculty: 'FAST',
    year: 2021,
    gpa: 3.4,
    major: 'Communication engineering',
    email: 'quan.dang@research.edu',
    skills: ['5G/6G Networks', 'Network Protocols', 'C++'],
    bio: 'Deeply interested in next-generation mobile network architecture and optimization.'
  },
  {
    id: 'S009',
    name: 'Trần Vũ Đạt',
    class: '21ECE',
    faculty: 'FAST',
    year: 2021,
    gpa: 2.7,
    major: 'Communication engineering',
    email: 'dat.tran@research.edu',
    skills: ['Optical Fiber Communication', 'Telecommunication Systems', 'Python'],
    bio: 'Exploring the potential of optical networks for high-capacity data transmission.'
  },
  {
    id: 'S010',
    name: 'Nguyễn Thị Quỳnh Anh',
    class: '20ECE',
    faculty: 'FAST',
    year: 2020,
    gpa: 3.7,
    major: 'Communication engineering',
    email: 'anh.nguyenthi@research.edu',
    skills: ['OFDM', 'MIMO Systems', 'Digital Signal Processing (DSP)'],
    bio: 'Strong foundation in theoretical and practical aspects of advanced wireless communication techniques.'
  },
  {
    id: 'S011',
    name: 'Nguyễn Trọng Hiếu',
    class: '20ECE',
    faculty: 'FAST',
    year: 2020,
    gpa: 3.0,
    major: 'Communication engineering',
    email: 'hieu.nguyen@research.edu',
    skills: ['Network Security', 'Linux Administration', 'Cloud Networking'],
    bio: 'Focusing on securing communication channels and managing complex network infrastructure.'
  },
  {
    id: 'S012',
    name: 'Lê Quốc Duy',
    class: '21ES',
    faculty: 'FAST',
    year: 2021,
    gpa: 3.6,
    major: 'Embedded system',
    email: 'duy.le@research.edu',
    skills: ['RTOS (FreeRTOS)', 'C Programming', 'ARM Architecture'],
    bio: 'Dedicated to developing real-time operating systems and optimizing low-level device drivers.'
  },
  {
    id: 'S013',
    name: 'Lê Gia Vinh',
    class: '21ES',
    faculty: 'FAST',
    year: 2021,
    gpa: 3.3,
    major: 'Embedded system',
    email: 'vinh.le@research.edu',
    skills: ['IoT Protocols (MQTT, CoAP)', 'Sensor Interfacing', 'PlatformIO'],
    bio: 'Working on integrating embedded devices with cloud services for IoT applications.'
  },
  {
    id: 'S014',
    name: 'Trần Ngọc Hiệp',
    class: '21ES',
    faculty: 'FAST',
    year: 2021,
    gpa: 2.9,
    major: 'Embedded system',
    email: 'hiep.tran@research.edu',
    skills: ['Automotive Embedded Systems', 'CAN Bus', 'LIN Bus'],
    bio: 'Aspiring to contribute to the field of vehicular electronics and in-car networks.'
  },
  {
    id: 'S015',
    name: 'Phạm Hữu Phước',
    class: '21ES',
    faculty: 'FAST',
    year: 2021,
    gpa: 3.1,
    major: 'Embedded system',
    email: 'phuoc.pham@research.edu',
    skills: ['Machine Learning on Edge Devices', 'TensorFlow Lite', 'MicroPython'],
    bio: 'Exploring how to deploy efficient AI models directly onto resource-constrained microcontrollers.'
  },
  {
    id: 'S016',
    name: 'Nguyễn Quang Thạc',
    class: '21ES',
    faculty: 'FAST',
    year: 2021,
    gpa: 3.5,
    major: 'Embedded system',
    email: 'thac.nguyen@research.edu',
    skills: ['Device Testing and Validation', 'JTAG/SWD Debugging', 'Assembly Language'],
    bio: 'Focused on ensuring the reliability and performance of embedded hardware and firmware.'
  }
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
  {
    id: 'S002',
    name: 'Nguyễn Đình Sáng',
    class: '21ECE',
    faculty: 'FAST',
    year: 2021,
    gpa: 3.5,
    major: 'Electronic engineering',
    email: 'sang.nguyen@research.edu',
    skills: ['Circuit Design', 'VHDL', 'Microcontrollers (PIC, STM32)'],
    bio: 'Fascinated by high-speed digital design and embedded systems.'
  },
  {
    id: 'S003',
    name: 'Lê Văn Đức',
    class: '21ECE',
    faculty: 'FAST',
    year: 2021,
    gpa: 2.8,
    major: 'Electronic engineering',
    email: 'duc.le@research.edu',
    skills: ['PCB Layout', 'Altium Designer', 'Power Electronics'],
    bio: 'Interested in renewable energy systems and power supply optimization.'
  },
  {
    id: 'S004',
    name: 'Nguyễn Thành Minh',
    class: '21ECE',
    faculty: 'FAST',
    year: 2021,
    gpa: 3.2,
    major: 'Electronic engineering',
    email: 'minh.nguyen@research.edu',
    skills: ['Signal Processing', 'MATLAB', 'Python'],
    bio: 'Focusing on filtering techniques and real-time data analysis in electronic devices.'
  },
  {
    id: 'S005',
    name: 'Hoàng Tuấn Anh',
    class: '20ECE',
    faculty: 'FAST',
    year: 2020,
    gpa: 3.8,
    major: 'Electronic engineering',
    email: 'anh.hoang@research.edu',
    skills: ['FPGA Programming (Verilog)', 'SystemVerilog', 'VLSI Design'],
    bio: 'Experienced in developing complex digital logic and ASIC design flows.'
  },
  {
    id: 'S006',
    name: 'Huỳnh Cao Đức',
    class: '20ECE',
    faculty: 'FAST',
    year: 2020,
    gpa: 3.1,
    major: 'Electronic engineering',
    email: 'duc.huynh@research.edu',
    skills: ['RF/Microwave Engineering', 'Antenna Design', 'Ansys HFSS'],
    bio: 'Passionate about wireless communication hardware and electromagnetic simulation.'
  },
  {
    id: 'S007',
    name: 'Trần Dĩ Kha',
    class: '20ECE',
    faculty: 'FAST',
    year: 2020,
    gpa: 2.9,
    major: 'Electronic engineering',
    email: 'kha.tran@research.edu',
    skills: ['Instrumentation', 'LabVIEW', 'Control Systems'],
    bio: 'Seeking projects involving industrial automation and precise measurement equipment.'
  },
    {
    id: 'S008',
    name: 'Đặng Minh Quân',
    class: '21ECE',
    faculty: 'FAST',
    year: 2021,
    gpa: 3.4,
    major: 'Communication engineering',
    email: 'quan.dang@research.edu',
    skills: ['5G/6G Networks', 'Network Protocols', 'C++'],
    bio: 'Deeply interested in next-generation mobile network architecture and optimization.'
  }
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
  {
    id: 'P002',
    name: 'Dr. Nguyễn Thị Anh Thư',
    faculty: 'FAST',
    field: 'Machine Learning & AI',
    achievements: 'Mentored 10+ student research groups, Published in top-tier conferences',
    email: 'thu.nguyen@research.edu',
    publications: 18,
    bio: 'Specialist in applying machine learning to real-world problems. Currently focusing on image processing and low-cost AI solutions.',
    researchInterests: ['Machine Learning', 'AI', 'Computer Vision', 'Data Mining']
  },
  {
    id: 'P003',
    name: 'Dr. Nguyễn Lê Hòa',
    faculty: 'FAST',
    field: 'Power Electronics & Automation',
    achievements: 'Awarded 3 national grants, Developed new energy-saving control systems',
    email: 'hoa.nguyen@research.edu',
    publications: 25,
    bio: 'Expert in high-efficiency power conversion and industrial automation. Passionate about applying control theory to smart grids.',
    researchInterests: ['Power Electronics', 'Automation', 'Control Systems', 'Renewable Energy']
  },
  {
    id: 'P004',
    name: 'Dr. Nguyễn Quang Như Quỳnh',
    faculty: 'FAST',
    field: 'Communication & Entrepreneurship',
    achievements: 'Successfully commercialized a telecommunication product, Lead a technology incubation program',
    email: 'quynh.nguyen@research.edu',
    publications: 12,
    bio: 'Focuses on the commercial viability of communication technologies and fostering innovation through start-ups. Also an expert in wireless signal quality.',
    researchInterests: ['Communication Systems', 'Start-up', 'Wireless Networks', 'Innovation & Tech Transfer']
  },
  {
    id: 'P005',
    name: 'Dr. Phạm Văn Tuấn',
    faculty: 'FAST',
    field: 'Deep Learning & Neural Networks',
    achievements: 'Recognized for pioneering work in deep neural network optimization, 20+ years of experience',
    email: 'tuan.pham@research.edu',
    publications: 40,
    bio: 'A veteran researcher in the core principles of AI, specializing in creating efficient and robust deep learning architectures for complex tasks.',
    researchInterests: ['Deep Learning', 'Neural Networks', 'Optimization Algorithms', 'Reinforcement Learning']
  },
  {
    id: 'P006',
    name: 'Dr. Lê Quốc Huy',
    faculty: 'FAST',
    field: 'Embedded Systems & EEE',
    achievements: 'Designed specialized microcontroller for industrial use, Senior member of the EEE society',
    email: 'huy.nguyen@research.edu',
    publications: 15,
    bio: 'Dedicated to the design and implementation of efficient embedded systems and IoT devices. Expertise in hardware-software co-design.',
    researchInterests: ['Embedded Systems', 'IoT', 'Microcontroller Programming', 'Electrical and Electronic Engineering']
  }
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
  {
    id: 'P002',
    name: 'Dr. Nguyễn Thị Anh Thư',
    faculty: 'FAST',
    field: 'Machine Learning & AI',
    achievements: 'Mentored 10+ student research groups, Published in top-tier conferences',
    email: 'thu.nguyen@research.edu',
    publications: 18,
    bio: 'Specialist in applying machine learning to real-world problems. Currently focusing on image processing and low-cost AI solutions.',
    researchInterests: ['Machine Learning', 'AI', 'Computer Vision', 'Data Mining']
  },
  {
    id: 'P003',
    name: 'Dr. Nguyễn Lê Hòa',
    faculty: 'FAST',
    field: 'Power Electronics & Automation',
    achievements: 'Awarded 3 national grants, Developed new energy-saving control systems',
    email: 'hoa.nguyen@research.edu',
    publications: 25,
    bio: 'Expert in high-efficiency power conversion and industrial automation. Passionate about applying control theory to smart grids.',
    researchInterests: ['Power Electronics', 'Automation', 'Control Systems', 'Renewable Energy']
  },
  {
    id: 'P004',
    name: 'Dr. Nguyễn Quang Như Quỳnh',
    faculty: 'FAST',
    field: 'Communication & Entrepreneurship',
    achievements: 'Successfully commercialized a telecommunication product, Lead a technology incubation program',
    email: 'quynh.nguyen@research.edu',
    publications: 12,
    bio: 'Focuses on the commercial viability of communication technologies and fostering innovation through start-ups. Also an expert in wireless signal quality.',
    researchInterests: ['Communication Systems', 'Start-up', 'Wireless Networks', 'Innovation & Tech Transfer']
  }
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
  {
    id: 'R002',
    groupName: 'FAST Chatbot Dev',
    faculty: 'FAST',
    year: 2023, 
    rank: 3, 
    members: 4, 
    topic: 'Research and development of chatbot for consulting students of FAST faculty', 
    leader: 'Đặng Minh Quân', 
    description: 'Building an intelligent chatbot using NLP to support consultation and answer common questions for students of the FAST Faculty.',
    teamMembers: [
      { studentId: 'S008', name: 'Đặng Minh Quân', role: 'Team Leader/NLP Engineer', gpa: 3.4, major: 'Communication engineering' },
      { studentId: 'S009', name: 'Trần Vũ Đạt', role: 'Backend Developer', gpa: 2.7, major: 'Communication engineering' },
      { studentId: 'S004', name: 'Nguyễn Thành Minh', role: 'Data Collector/Tester', gpa: 3.2, major: 'Electronic engineering' },
      { studentId: 'S011', name: 'Nguyễn Trọng Hiếu', role: 'Network/Security Admin', gpa: 3.0, major: 'Communication engineering' }
    ],
    professors: ['P004'], 
    paperPath: '/papers/fast-chatbot-dev.pdf', 
    abstract: 'This project focuses on developing a chatbot based on a Natural Language Processing (NLP) model to improve the academic and administrative consultation process for FAST Faculty students, achieving an 88% accuracy in answering queries.'
  },
    {
    id: 'R003',
    groupName: 'Aquatic Freshness Tech',
    faculty: 'FAST',
    year: 2024, 
    rank: 1, 
    members: 5, 
    topic: 'Effective low-cost features for fish freshness determination on extended self-build database', 
    leader: 'Lê Văn Đức', 
    description: 'Researching low-cost visual and electronic features for effective and automated assessment of aquatic product freshness.',
    teamMembers: [
      { studentId: 'S003', name: 'Lê Văn Đức', role: 'Team Leader/Hardware Integrator', gpa: 2.8, major: 'Electronic engineering' },
      { studentId: 'S002', name: 'Nguyễn Đình Sáng', role: 'Circuit Designer', gpa: 3.5, major: 'Electronic engineering' },
      { studentId: 'S010', name: 'Nguyễn Thị Quỳnh Anh', role: 'Signal Processing Analyst', gpa: 3.7, major: 'Communication engineering' },
      { studentId: 'S013', name: 'Lê Gia Vinh', role: 'IoT Sensor Specialist', gpa: 3.3, major: 'Embedded system' },
      { studentId: 'S015', name: 'Phạm Hữu Phước', role: 'Edge ML Developer', gpa: 3.1, major: 'Embedded system' }
    ],
    professors: ['P002'], 
    paperPath: '/papers/aquatic-freshness-determination.pdf', 
    abstract: 'We propose a low-cost system based on optical sensors and a lightweight machine learning algorithm to classify fish freshness levels. The results show high reliability, opening up potential for applications in the food supply chain.'
  },
  {
    id: 'R004',
    groupName: 'Mobile Optical Imaging',
    faculty: 'FAST',
    year: 2023, 
    rank: 4, 
    members: 3, 
    topic: 'Development Of A Smartphone Based Optical Imaging Application', 
    leader: 'Nguyễn Thị Quỳnh Anh', 
    description: 'Developing a mobile application that uses a smartphone camera to perform simple optical imaging measurements and on-site data analysis.',
    teamMembers: [
      { studentId: 'S010', name: 'Nguyễn Thị Quỳnh Anh', role: 'Team Leader/Algorithm Designer', gpa: 3.7, major: 'Communication engineering' },
      { studentId: 'S007', name: 'Trần Dĩ Kha', role: 'Instrumentation/Tester', gpa: 2.9, major: 'Electronic engineering' },
      { studentId: 'S016', name: 'Nguyễn Quang Thạc', role: 'App UI/UX Developer', gpa: 3.5, major: 'Embedded system' }
    ],
    professors: ['P003'], 
    paperPath: '/papers/smartphone-optical-imaging.pdf', 
    abstract: 'This application exploits the capabilities of the smartphone camera to collect and process optical images, allowing users to perform basic analyses without the need for specialized laboratory equipment.'
  },
  {
    id: 'R005',
    groupName: 'YOLO Electrical Management',
    faculty: 'FAST',
    year: 2022, 
    rank: 2, 
    members: 3, 
    topic: 'Application of Object Detection Algorithm "YOLO" in Electrical Device Management', 
    leader: 'Hoàng Tuấn Anh', 
    description: 'Applying the YOLO algorithm to automatically monitor, recognize, and manage electrical devices in industrial or home environments.',
    teamMembers: [
      { studentId: 'S005', name: 'Hoàng Tuấn Anh', role: 'Team Leader/FPGA Programmer', gpa: 3.8, major: 'Electronic engineering' },
      { studentId: 'S006', name: 'Huỳnh Cao Đức', role: 'System Integration Specialist', gpa: 3.1, major: 'Electronic engineering' },
      { studentId: 'S014', name: 'Trần Ngọc Hiệp', role: 'Data Labeler/Tester', gpa: 2.9, major: 'Embedded system' }
    ],
    professors: ['P005'], 
    paperPath: '/papers/yolo-electrical-management.pdf', 
    abstract: 'This research presents the deployment of YOLOv5 on an embedded platform to monitor the status and location of electrical devices. The system achieves a recognition speed of 40 FPS, making it suitable for real-time asset management applications.'
  },
    {
    id: 'R006',
    groupName: 'Smart IoT Eyewear',
    faculty: 'FAST',
    year: 2024, 
    rank: 5, 
    members: 6, 
    topic: 'Smart eye-wear device with the internet of things and artificial intelligence', 
    leader: 'Lê Quốc Duy', 
    description: 'Designing and developing smart eyewear integrated with IoT and AI for user assistance and environmental recognition applications.',
    teamMembers: [
      { studentId: 'S012', name: 'Lê Quốc Duy', role: 'Team Leader/RTOS Developer', gpa: 3.6, major: 'Embedded system' },
      { studentId: 'S013', name: 'Lê Gia Vinh', role: 'IoT Backend/Cloud', gpa: 3.3, major: 'Embedded system' },
      { studentId: 'S002', name: 'Nguyễn Đình Sáng', role: 'Digital Circuit Designer', gpa: 3.5, major: 'Electronic engineering' },
      { studentId: 'S008', name: 'Đặng Minh Quân', role: 'Communication Protocol Specialist', gpa: 3.4, major: 'Communication engineering' },
      { studentId: 'S015', name: 'Phạm Hữu Phước', role: 'Edge AI Model Optimizer', gpa: 3.1, major: 'Embedded system' },
      { studentId: 'S006', name: 'Huỳnh Cao Đức', role: 'RF/Antenna Specialist', gpa: 3.1, major: 'Electronic engineering' }
    ],
    professors: ['P006'], 
    paperPath: '/papers/smart-iot-eyewear.pdf', 
    abstract: 'We developed a low-power smart eyewear prototype, utilizing an ARM microcontroller and optimized AI models. The device is capable of performing basic object recognition and transmitting data via MQTT.'
  }
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
{
    id: 'R005',
    groupName: 'YOLO Electrical Management',
    faculty: 'FAST',
    year: 2022, 
    rank: 2, 
    members: 3, 
    topic: 'Application of Object Detection Algorithm "YOLO" in Electrical Device Management', 
    leader: 'Hoàng Tuấn Anh', 
    description: 'Applying the YOLO algorithm to automatically monitor, recognize, and manage electrical devices in industrial or home environments.',
    teamMembers: [
      { studentId: 'S005', name: 'Hoàng Tuấn Anh', role: 'Team Leader/FPGA Programmer', gpa: 3.8, major: 'Electronic engineering' },
      { studentId: 'S006', name: 'Huỳnh Cao Đức', role: 'System Integration Specialist', gpa: 3.1, major: 'Electronic engineering' },
      { studentId: 'S014', name: 'Trần Ngọc Hiệp', role: 'Data Labeler/Tester', gpa: 2.9, major: 'Embedded system' }
    ],
    professors: ['P005'], 
    paperPath: '/papers/yolo-electrical-management.pdf', 
    abstract: 'This research presents the deployment of YOLOv5 on an embedded platform to monitor the status and location of electrical devices. The system achieves a recognition speed of 40 FPS, making it suitable for real-time asset management applications.'
  },
    {
    id: 'R006',
    groupName: 'Smart IoT Eyewear',
    faculty: 'FAST',
    year: 2024, 
    rank: 5, 
    members: 6, 
    topic: 'Smart eye-wear device with the internet of things and artificial intelligence', 
    leader: 'Lê Quốc Duy', 
    description: 'Designing and developing smart eyewear integrated with IoT and AI for user assistance and environmental recognition applications.',
    teamMembers: [
      { studentId: 'S012', name: 'Lê Quốc Duy', role: 'Team Leader/RTOS Developer', gpa: 3.6, major: 'Embedded system' },
      { studentId: 'S013', name: 'Lê Gia Vinh', role: 'IoT Backend/Cloud', gpa: 3.3, major: 'Embedded system' },
      { studentId: 'S002', name: 'Nguyễn Đình Sáng', role: 'Digital Circuit Designer', gpa: 3.5, major: 'Electronic engineering' },
      { studentId: 'S008', name: 'Đặng Minh Quân', role: 'Communication Protocol Specialist', gpa: 3.4, major: 'Communication engineering' },
      { studentId: 'S015', name: 'Phạm Hữu Phước', role: 'Edge AI Model Optimizer', gpa: 3.1, major: 'Embedded system' },
      { studentId: 'S006', name: 'Huỳnh Cao Đức', role: 'RF/Antenna Specialist', gpa: 3.1, major: 'Electronic engineering' }
    ],
    professors: ['P006'], 
    paperPath: '/papers/smart-iot-eyewear.pdf', 
    abstract: 'We developed a low-power smart eyewear prototype, utilizing an ARM microcontroller and optimized AI models. The device is capable of performing basic object recognition and transmitting data via MQTT.'
  }
];

// Filter Options
export const faculties = ['all', 'Computer Science', 'Electrical Engineering', 'Mechanical Engineering'];
export const years = ['all', '2021', '2022', '2023', '2024'];