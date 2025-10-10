// import { useState } from 'react';
// import { Upload, X, Edit, Trash2, Plus } from 'lucide-react';

// interface Professor {
//   id: string;
//   name: string;
//   faculty: string;
//   field: string;
//   achievements: string;
//   email: string;
//   publications: number;
// }

// const initialMockProfessors: Professor[] = [
//   { id: 'P001', name: 'Dr. Robert Chen', faculty: 'Computer Science', field: 'Machine Learning', achievements: 'Published 50+ papers, IEEE Fellow', email: 'robert.chen@research.edu', publications: 52 },
//   { id: 'P002', name: 'Dr. Emily Zhang', faculty: 'Electrical Engineering', field: 'Signal Processing', achievements: 'NSF Career Award, 30+ patents', email: 'emily.zhang@research.edu', publications: 45 },
//   { id: 'P003', name: 'Dr. James Wilson', faculty: 'Computer Science', field: 'Distributed Systems', achievements: 'ACM Distinguished Scientist', email: 'james.wilson@research.edu', publications: 38 },
//   { id: 'P004', name: 'Dr. Lisa Martinez', faculty: 'Mechanical Engineering', field: 'Robotics', achievements: 'Best Paper Award 2023', email: 'lisa.martinez@research.edu', publications: 41 },
//   { id: 'P005', name: 'Dr. Michael Brown', faculty: 'Computer Science', field: 'Cybersecurity', achievements: 'Google Faculty Research Award', email: 'michael.brown@research.edu', publications: 35 },
//   { id: 'P006', name: 'Dr. Sarah Johnson', faculty: 'Electrical Engineering', field: 'Power Systems', achievements: 'IEEE Outstanding Engineer Award', email: 'sarah.johnson@research.edu', publications: 48 },
// ];

// export default function ProfessorBoard() {
//   const [professors, setProfessors] = useState<Professor[]>(initialMockProfessors);
//   const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(null);
//   const [filterFaculty, setFilterFaculty] = useState('all');
//   const [editData, setEditData] = useState<Professor | null>(null);
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [newProfessor, setNewProfessor] = useState<Professor>({
//     id: '',
//     name: '',
//     faculty: 'Computer Science',
//     field: '',
//     achievements: '',
//     email: '',
//     publications: 0
//   });

//   const faculties = ['all', 'Computer Science', 'Electrical Engineering', 'Mechanical Engineering'];

//   const getFilteredProfessors = () => {
//     if (filterFaculty === 'all') return professors;
//     return professors.filter(p => p.faculty === filterFaculty);
//   };

//   const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const newMockProfessors: Professor[] = [
//         { id: 'P007', name: 'Dr. David Kim', faculty: 'Computer Science', field: 'Natural Language Processing', achievements: 'AAAI Fellow, 40+ papers', email: 'david.kim@research.edu', publications: 42 },
//         { id: 'P008', name: 'Dr. Anna White', faculty: 'Mechanical Engineering', field: 'Thermodynamics', achievements: 'ASME Medal, 35+ publications', email: 'anna.white@research.edu', publications: 37 },
//       ];
      
//       setProfessors([...professors, ...newMockProfessors]);
//       alert(`File "${file.name}" uploaded! Added ${newMockProfessors.length} new professors.`);
//       e.target.value = '';
//     }
//   };

//   const handleSave = () => {
//     if (editData) {
//       setProfessors(professors.map(p => p.id === editData.id ? editData : p));
//       setSelectedProfessor(null);
//       setEditData(null);
//       alert('Professor updated successfully!');
//     }
//   };

//   const handleDelete = () => {
//     if (selectedProfessor && confirm(`Delete ${selectedProfessor.name}?`)) {
//       setProfessors(professors.filter(p => p.id !== selectedProfessor.id));
//       setSelectedProfessor(null);
//       setEditData(null);
//       alert('Professor deleted successfully!');
//     }
//   };

//   const handleCreate = () => {
//     if (!newProfessor.name || !newProfessor.field || !newProfessor.email) {
//       alert('Please fill in all required fields!');
//       return;
//     }
    
//     const id = `P${String(professors.length + 1).padStart(3, '0')}`;
//     setProfessors([...professors, { ...newProfessor, id }]);
//     setShowCreateModal(false);
//     setNewProfessor({
//       id: '',
//       name: '',
//       faculty: 'Computer Science',
//       field: '',
//       achievements: '',
//       email: '',
//       publications: 0
//     });
//     alert('Professor created successfully!');
//   };

//   const openModal = (professor: Professor) => {
//     setSelectedProfessor(professor);
//     setEditData({...professor});
//   };

//   return (
//     <>
//       {/* Filters and Actions */}
//       <div style={{
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginBottom: '1.5rem',
//         flexWrap: 'wrap',
//         gap: '1rem'
//       }}>
//         <h2 style={{ 
//           fontSize: '1.5rem', 
//           fontWeight: 'bold', 
//           color: '#1f2937',
//           margin: 0
//         }}>
//           Professor Management ({getFilteredProfessors().length})
//         </h2>
        
//         <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
//           <select
//             value={filterFaculty}
//             onChange={(e) => setFilterFaculty(e.target.value)}
//             style={{
//               padding: '0.625rem 1rem',
//               border: '2px solid #e5e7eb',
//               borderRadius: '10px',
//               fontSize: '0.875rem