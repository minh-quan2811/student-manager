// frontend/src/app/student/utils/chatProcessor.ts
import type { Student, Group, Professor } from '../data/mockData';

type TabType = 'students' | 'groups' | 'professors';

interface ProcessCommandResult {
  response: string;
  students: Student[];
  groups: Group[];
  professors: Professor[];
  switchTab: TabType | null;
}

export function processCommand(
  message: string,
  allStudents: Student[],
  allGroups: Group[],
  allProfessors: Professor[]
): ProcessCommandResult {
  const lowerMsg = message.toLowerCase();

  let students = [...allStudents];
  let groups = [...allGroups];
  let professors = [...allProfessors];
  let response = '';
  let switchTab: TabType | null = null;

  // Student filtering
if (lowerMsg.includes('student')) {
  switchTab = 'students';

  if (lowerMsg.includes('gpa') && (lowerMsg.includes('3.8') || lowerMsg.includes('high') || lowerMsg.includes('above'))) {
    const threshold = lowerMsg.includes('3.8') ? 3.8 : lowerMsg.includes('3.9') ? 3.9 : 3.8;
    students = students.filter((s) => s.gpa >= threshold);
    response = `Found ${students.length} students with GPA ${threshold} or higher.`;
  } else if (lowerMsg.includes('python')) {
    students = students.filter((s) => s.skills.some((skill) => skill.toLowerCase().includes('python')));
    response = `Found ${students.length} students with Python skills.`;
  } else if (lowerMsg.includes('react')) {
    students = students.filter((s) => s.skills.some((skill) => skill.toLowerCase().includes('react')));
    response = `Found ${students.length} students with React skills.`;
  } else if (lowerMsg.includes('javascript') || lowerMsg.includes('js')) {
    students = students.filter((s) => s.skills.some((skill) => skill.toLowerCase().includes('javascript')));
    response = `Found ${students.length} students with JavaScript skills.`;
  } else if (lowerMsg.includes('java') && !lowerMsg.includes('javascript')) {
    students = students.filter((s) => s.skills.some((skill) => skill.toLowerCase() === 'java'));
    response = `Found ${students.length} students with Java skills.`;
  } else if (lowerMsg.includes('machine learning') || lowerMsg.includes('ml')) {
    students = students.filter((s) => s.skills.some((skill) => skill.toLowerCase().includes('machine learning')));
    response = `Found ${students.length} students with Machine Learning skills.`;
  } else if (lowerMsg.includes('data') && (lowerMsg.includes('science') || lowerMsg.includes('analysis'))) {
    students = students.filter((s) => s.major.toLowerCase().includes('data'));
    response = `Found ${students.length} students in Data Science.`;
  } else if (lowerMsg.includes('circuit') && lowerMsg.includes('design')) {
    students = students.filter((s) => s.major.toLowerCase().includes('circuit design'));
    response = `Found ${students.length} students in Circuit Design.`;
  } else if (lowerMsg.includes('matlab')) {
    students = students.filter((s) => s.skills.some((skill) => skill.toLowerCase().includes('matlab')));
    response = `Found ${students.length} students with MATLAB skills.`;
  } else if (lowerMsg.includes('signal') && lowerMsg.includes('processing')) {
    students = students.filter((s) => s.major.toLowerCase().includes('signal processing'));
    response = `Found ${students.length} students in Signal Processing.`;
  } else if (lowerMsg.includes('analog') || lowerMsg.includes('mixed signal')) {
    students = students.filter((s) => s.major.toLowerCase().includes('analog mixed signal'));
    response = `Found ${students.length} students in Analog Mixed Signal.`;
  } else if (lowerMsg.includes('antenna') && lowerMsg.includes('design')) {
    students = students.filter((s) => s.major.toLowerCase().includes('antenna design'));
    response = `Found ${students.length} students in Antenna Design.`;
  } else if (lowerMsg.includes('digital signal') || lowerMsg.includes('dsp')) {
    students = students.filter((s) => s.major.toLowerCase().includes('digital signal processing'));
    response = `Found ${students.length} students in Digital Signal Processing.`;
  } else if (lowerMsg.includes('optical') || lowerMsg.includes('fiber')) {
    students = students.filter((s) => s.major.toLowerCase().includes('optical fiber communication'));
    response = `Found ${students.length} students in Optical Fiber Communication.`;
  } else if (lowerMsg.includes('telecommunication') || lowerMsg.includes('telecom')) {
    students = students.filter((s) => s.major.toLowerCase().includes('telecommunication systems'));
    response = `Found ${students.length} students in Telecommunication Systems.`;
  } else if (lowerMsg.includes('network') && lowerMsg.includes('security')) {
    students = students.filter((s) => s.major.toLowerCase().includes('network security'));
    response = `Found ${students.length} students in Network Security.`;
  } else if (lowerMsg.includes('tensorflow') || lowerMsg.includes('tflite')) {
    students = students.filter((s) => s.skills.some((skill) => skill.toLowerCase().includes('tensorflow lite')));
    response = `Found ${students.length} students with TensorFlow Lite skills.`;
  } else if (lowerMsg.includes('looking for group') || lowerMsg.includes('looking')) {
    students = students.filter((s) => s.lookingForGroup);
    response = `Found ${students.length} students looking for a group.`;
  } else if (lowerMsg.includes('2020')) {
    students = students.filter((s) => s.year === '2020');
    response = `Found ${students.length} senior students.`;
  } else if (lowerMsg.includes('2021')) {
    students = students.filter((s) => s.year === '2021');
    response = `Found ${students.length} junior students.`;
  } else {
    response = `Showing all ${students.length} students.`;
  }
}

  // Group filtering
  else if (lowerMsg.includes('group')) {
    switchTab = 'groups';

    if (lowerMsg.includes('need') && lowerMsg.includes('react')) {
      groups = groups.filter((g) => g.neededSkills.some((skill) => skill.toLowerCase().includes('react')));
      response = `Found ${groups.length} groups looking for React developers.`;
    } else if (lowerMsg.includes('need') && lowerMsg.includes('python')) {
      groups = groups.filter((g) => g.neededSkills.some((skill) => skill.toLowerCase().includes('python')));
      response = `Found ${groups.length} groups looking for Python developers.`;
    } else if (lowerMsg.includes('need') && (lowerMsg.includes('node') || lowerMsg.includes('backend'))) {
      groups = groups.filter((g) => g.neededSkills.some((skill) => skill.toLowerCase().includes('node')));
      response = `Found ${groups.length} groups looking for backend developers.`;
    } else if (lowerMsg.includes('need') && (lowerMsg.includes('image') || lowerMsg.includes('vision') || lowerMsg.includes('processing'))) {
      groups = groups.filter((g) => g.neededSkills.some((skill) => skill.toLowerCase().includes('image processing') || skill.toLowerCase().includes('computer vision')));
      response = `Found ${groups.length} groups focusing on Image Processing or Computer Vision.`;
    } else if (lowerMsg.includes('need') && (lowerMsg.includes('mobile') || lowerMsg.includes('android') || lowerMsg.includes('ios'))) {
      groups = groups.filter((g) => g.neededSkills.some((skill) => skill.toLowerCase().includes('mobile') || skill.toLowerCase().includes('android') || skill.toLowerCase().includes('ios')));
      response = `Found ${groups.length} groups working on Mobile Development (Android/iOS).`;
    } else if (lowerMsg.includes('need') && (lowerMsg.includes('java') || lowerMsg.includes('kotlin'))) {
      groups = groups.filter((g) => g.neededSkills.some((skill) => skill.toLowerCase().includes('java') || skill.toLowerCase().includes('kotlin')));
      response = `Found ${groups.length} groups looking for Java/Kotlin developers.`;
    } else if (lowerMsg.includes('need') && lowerMsg.includes('signal')) {
      groups = groups.filter((g) => g.neededSkills.some((skill) => skill.toLowerCase().includes('signal processing')));
      response = `Found ${groups.length} groups focusing on Signal Processing.`;
    } else if (lowerMsg.includes('need') && (lowerMsg.includes('pytorch') || lowerMsg.includes('tensorflow'))) {
      groups = groups.filter((g) => g.neededSkills.some((skill) => skill.toLowerCase().includes('pytorch') || skill.toLowerCase().includes('tensorflow')));
      response = `Found ${groups.length} groups working with PyTorch/TensorFlow.`;
    } else if (lowerMsg.includes('need') && (lowerMsg.includes('embedded') || lowerMsg.includes('iot') || lowerMsg.includes('mqtt') || lowerMsg.includes('hardware'))) {
      groups = groups.filter((g) =>
        g.neededSkills.some(
          (skill) =>
            skill.toLowerCase().includes('embedded c') ||
            skill.toLowerCase().includes('iot') ||
            skill.toLowerCase().includes('mqtt') ||
            skill.toLowerCase().includes('low-power hardware')
        )
      );
      response = `Found ${groups.length} groups focusing on Embedded Systems, IoT, or Low-Power Hardware Design.`;
    } else if (lowerMsg.includes('need') && (lowerMsg.includes('nlp') || lowerMsg.includes('natural language'))) {
      groups = groups.filter((g) => g.neededSkills.some((skill) => skill.toLowerCase().includes('nlp')));
      response = `Found ${groups.length} groups working on NLP (Natural Language Processing).`;
    } else if (lowerMsg.includes('need') && lowerMsg.includes('matlab')) {
      groups = groups.filter((g) => g.neededSkills.some((skill) => skill.toLowerCase().includes('matlab')));
      response = `Found ${groups.length} groups using MATLAB.`;
    } else if (lowerMsg.includes('need') && (lowerMsg.includes('analog') || lowerMsg.includes('mixed'))) {
      groups = groups.filter((g) => g.neededSkills.some((skill) => skill.toLowerCase().includes('analog') || skill.toLowerCase().includes('mixed signal')));
      response = `Found ${groups.length} groups working on Analog or Mixed-Signal design.`;
    } else if (lowerMsg.includes('no mentor') || lowerMsg.includes('without mentor')) {
      groups = groups.filter((g) => !g.hasMentor);
      response = `Found ${groups.length} groups without a mentor.`;
    } else if (lowerMsg.includes('has mentor') || lowerMsg.includes('with mentor')) {
      groups = groups.filter((g) => g.hasMentor);
      response = `Found ${groups.length} groups with a mentor.`;
    } else if (lowerMsg.includes('available') || lowerMsg.includes('spots') || lowerMsg.includes('space')) {
      groups = groups.filter((g) => g.currentMembers < g.maxMembers);
      response = `Found ${groups.length} groups with available spots.`;
    } else if (lowerMsg.includes('full')) {
      groups = groups.filter((g) => g.currentMembers >= g.maxMembers);
      response = `Found ${groups.length} full groups.`;
    } else {
      response = `Showing all ${groups.length} groups.`;
    }
  }

  // Professor filtering
  else if (lowerMsg.includes('professor') || lowerMsg.includes('mentor') || lowerMsg.includes('prof')) {
    switchTab = 'professors';

    if (
      lowerMsg.includes('machine learning') ||
      lowerMsg.includes('ml') ||
      lowerMsg.includes('ai') ||
      lowerMsg.includes('computer vision') ||
      lowerMsg.includes('data mining')
    ) {
      professors = professors.filter((p) =>
        p.researchAreas.some((area) =>
          ['machine learning', 'ai', 'deep learning', 'computer vision', 'data mining']
            .some((kw) => area.toLowerCase().includes(kw))
        )
      );
      response = `Found ${professors.length} professors specializing in Machine Learning / AI / Computer Vision / Data Mining.`;
    } else if (
      lowerMsg.includes('power electronics') ||
      lowerMsg.includes('automation') ||
      lowerMsg.includes('control systems') ||
      lowerMsg.includes('renewable energy')
    ) {
      professors = professors.filter((p) =>
        p.researchAreas.some((area) =>
          ['power electronics', 'automation', 'control systems', 'renewable energy']
            .some((kw) => area.toLowerCase().includes(kw))
        )
      );
      response = `Found ${professors.length} professors specializing in Power Electronics / Automation / Control Systems / Renewable Energy.`;
    } else if (
      lowerMsg.includes('communication') ||
      lowerMsg.includes('wireless') ||
      lowerMsg.includes('startup') ||
      lowerMsg.includes('innovation')
    ) {
      professors = professors.filter((p) =>
        p.researchAreas.some((area) =>
          ['communication', 'wireless', 'startup', 'innovation', 'tech transfer']
            .some((kw) => area.toLowerCase().includes(kw))
        )
      );
      response = `Found ${professors.length} professors specializing in Communication Systems / Startups / Wireless Networks / Innovation & Tech Transfer.`;
    } else if (
      lowerMsg.includes('deep learning') ||
      lowerMsg.includes('neural network') ||
      lowerMsg.includes('optimization') ||
      lowerMsg.includes('reinforcement')
    ) {
      professors = professors.filter((p) =>
        p.researchAreas.some((area) =>
          ['deep learning', 'neural network', 'optimization', 'reinforcement']
            .some((kw) => area.toLowerCase().includes(kw))
        )
      );
      response = `Found ${professors.length} professors specializing in Deep Learning / Neural Networks / Optimization / Reinforcement Learning.`;
    } else if (
      lowerMsg.includes('embedded') ||
      lowerMsg.includes('iot') ||
      lowerMsg.includes('microcontroller') ||
      lowerMsg.includes('electrical')
    ) {
      professors = professors.filter((p) =>
        p.researchAreas.some((area) =>
          ['embedded', 'iot', 'microcontroller', 'electrical']
            .some((kw) => area.toLowerCase().includes(kw))
        )
      );
      response = `Found ${professors.length} professors specializing in Embedded Systems / IoT / Microcontroller Programming / Electrical Engineering.`;
    } else if (lowerMsg.includes('available') || lowerMsg.includes('slots')) {
      professors = professors.filter((p) => p.availableSlots > 0);
      response = `Found ${professors.length} professors with available slots.`;
    } else {
      response = `Showing all ${professors.length} professors.`;
    }
  }


  // General queries
  else if (lowerMsg.includes('show') || lowerMsg.includes('find') || lowerMsg.includes('get') || lowerMsg.includes('search')) {
    response =
      "I can help you find students, groups, or professors! Try being more specific, like 'show me students with Python skills' or 'find groups needing React developers'.";
  } else if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('hey')) {
    response = "Hello! I'm here to help you find students, groups, and professors. What are you looking for?";
  } else if (lowerMsg.includes('help')) {
    response =
      "I can filter students by skills, GPA, or year. I can find groups by needed skills or availability. I can search professors by research area. Try asking something like 'students with Python skills' or 'groups needing React developers'!";
  } else {
    response = "I'm not sure what you're looking for. Try asking about students, groups, or professors!";
  }

  return {
    response,
    students,
    groups,
    professors,
    switchTab
  };
}