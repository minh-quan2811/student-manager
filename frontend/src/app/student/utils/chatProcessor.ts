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
    } else if (lowerMsg.includes('looking for group') || lowerMsg.includes('looking')) {
      students = students.filter((s) => s.lookingForGroup);
      response = `Found ${students.length} students looking for a group.`;
    } else if (lowerMsg.includes('senior')) {
      students = students.filter((s) => s.year === 'Senior');
      response = `Found ${students.length} senior students.`;
    } else if (lowerMsg.includes('junior')) {
      students = students.filter((s) => s.year === 'Junior');
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

    if (lowerMsg.includes('machine learning') || lowerMsg.includes('ml') || lowerMsg.includes('ai')) {
      professors = professors.filter((p) =>
        p.researchAreas.some((area) => area.toLowerCase().includes('machine learning') || area.toLowerCase().includes('ai') || area.toLowerCase().includes('deep learning'))
      );
      response = `Found ${professors.length} professors specializing in AI/Machine Learning.`;
    } else if (lowerMsg.includes('data')) {
      professors = professors.filter((p) => p.researchAreas.some((area) => area.toLowerCase().includes('data')));
      response = `Found ${professors.length} professors specializing in Data Science.`;
    } else if (lowerMsg.includes('web') || lowerMsg.includes('cloud')) {
      professors = professors.filter((p) =>
        p.researchAreas.some((area) => area.toLowerCase().includes('web') || area.toLowerCase().includes('cloud'))
      );
      response = `Found ${professors.length} professors specializing in Web/Cloud technologies.`;
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