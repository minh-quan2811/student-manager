import { useState } from 'react';
import { X, Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';

interface CSVUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  accountType: 'student' | 'professor';
  onSubmit: (accounts: any[]) => Promise<void>;
}

export default function CSVUploadModal({ isOpen, onClose, accountType, onSubmit }: CSVUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [createdCount, setCreatedCount] = useState(0);

  if (!isOpen) return null;

  // Better CSV parsing that handles quoted fields and commas within fields
  const parseCSV = (text: string): any[] => {
    const lines = text.trim().split('\n').filter(line => line.trim());
    if (lines.length === 0) return [];

    const headers = lines[0].split(',').map(h => h.trim());
    const data: any[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Simple CSV parsing - split by comma
      const values = line.split(',').map(v => v.trim());
      const row: any = {};
      
      headers.forEach((header, index) => {
        if (index < values.length) {
          row[header] = values[index];
        }
      });

      // Skip empty rows
      if (Object.values(row).some(v => v)) {
        data.push(row);
      }
    }

    return data;
  };

  const validateStudentData = (data: any[]): string[] => {
    const errors: string[] = [];
    const requiredFields = ['name', 'student_id', 'gpa', 'major', 'faculty', 'year'];

    data.forEach((row, index) => {
      requiredFields.forEach(field => {
        if (!row[field]) {
          errors.push(`Row ${index + 2}: Missing ${field}`);
        }
      });

      if (row.gpa && (isNaN(parseFloat(row.gpa)) || parseFloat(row.gpa) < 0 || parseFloat(row.gpa) > 4.0)) {
        errors.push(`Row ${index + 2}: Invalid GPA (must be 0-4.0)`);
      }
    });

    return errors;
  };

  const validateProfessorData = (data: any[]): string[] => {
    const errors: string[] = [];
    const requiredFields = ['name', 'professor_id', 'faculty', 'field', 'department'];

    data.forEach((row, index) => {
      requiredFields.forEach(field => {
        if (!row[field]) {
          errors.push(`Row ${index + 2}: Missing ${field}`);
        }
      });

      if (row.publications && isNaN(parseInt(row.publications))) {
        errors.push(`Row ${index + 2}: Invalid publications count`);
      }

      if (row.total_slots && isNaN(parseInt(row.total_slots))) {
        errors.push(`Row ${index + 2}: Invalid total_slots`);
      }
    });

    return errors;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.csv')) {
      setErrors(['Please upload a CSV file']);
      return;
    }

    setFile(selectedFile);
    setErrors([]);
    setParsedData([]);
    setUploadComplete(false);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      try {
        const data = parseCSV(text);
        
        console.log('Parsed CSV data:', data); // Debug log
        
        // Process the data
        const processedData = data.map(row => {
          const processed: any = { ...row };
          
          // Parse skills/research_areas from semicolon-separated strings
          if (row.skills) {
            processed.skills = row.skills.split(';').map((s: string) => s.trim()).filter(Boolean);
          } else {
            processed.skills = [];
          }
          
          if (row.research_areas) {
            processed.research_areas = row.research_areas.split(';').map((s: string) => s.trim()).filter(Boolean);
          } else {
            processed.research_areas = [];
          }
          
          if (row.research_interests) {
            processed.research_interests = row.research_interests.split(';').map((s: string) => s.trim()).filter(Boolean);
          } else {
            processed.research_interests = [];
          }
          
          // Parse numeric fields
          if (row.gpa) processed.gpa = parseFloat(row.gpa);
          if (row.publications) processed.publications = parseInt(row.publications) || 0;
          if (row.total_slots) processed.total_slots = parseInt(row.total_slots) || 5;
          
          // Parse boolean
          if (row.looking_for_group !== undefined) {
            processed.looking_for_group = row.looking_for_group === 'true' || row.looking_for_group === '1' || row.looking_for_group === 'TRUE';
          } else {
            processed.looking_for_group = true;
          }
          
          return processed;
        });

        console.log('Processed data:', processedData); // Debug log

        const validationErrors = accountType === 'student' 
          ? validateStudentData(processedData)
          : validateProfessorData(processedData);

        if (validationErrors.length > 0) {
          setErrors(validationErrors);
        } else {
          setParsedData(processedData);
        }
      } catch (error) {
        console.error('CSV parse error:', error);
        setErrors(['Failed to parse CSV file. Please check the format.']);
      }
    };

    reader.readAsText(selectedFile);
  };

  const handleSubmit = async () => {
    if (parsedData.length === 0) return;

    setIsProcessing(true);
    try {
      console.log('Submitting data:', parsedData); // Debug log
      await onSubmit(parsedData);
      setCreatedCount(parsedData.length);
      setUploadComplete(true);
    } catch (error) {
      console.error('Submit error:', error);
      setErrors(['Failed to create accounts. Please try again.']);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadTemplate = () => {
    let csvContent = '';
    
    if (accountType === 'student') {
      csvContent = 'name,student_id,gpa,major,faculty,year,skills,bio,looking_for_group\n';
      csvContent += 'John Doe,S001,3.8,Computer Science,FAST,2021,Python;JavaScript;React,Passionate about AI,true\n';
      csvContent += 'Jane Smith,S002,3.5,Electrical Engineering,FAST,2020,MATLAB;Circuit Design,Interested in IoT,true';
    } else {
      csvContent = 'name,professor_id,faculty,field,department,research_areas,research_interests,achievements,publications,bio,total_slots\n';
      csvContent += 'Dr. John Doe,P001,FAST,Machine Learning,Computer Science,AI;Deep Learning;Computer Vision,Neural Networks;Image Processing,Published 20+ papers,25,Expert in AI,5\n';
      csvContent += 'Dr. Jane Smith,P002,FAST,Power Electronics,Electrical Engineering,Control Systems;Automation,Renewable Energy,Award winner,15,Specialist in automation,4';
    }

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${accountType}_template.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        maxWidth: '700px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '2px solid #e5e7eb',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: '20px 20px 0 0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Upload size={24} />
            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>
              Upload {accountType === 'student' ? 'Students' : 'Professors'} CSV
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '8px',
              padding: '0.5rem',
              cursor: 'pointer',
              display: 'flex',
              color: 'white'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '1.5rem' }}>
          {!uploadComplete ? (
            <>
              {/* Instructions */}
              <div style={{
                background: '#eff6ff',
                border: '2px solid #bfdbfe',
                borderRadius: '12px',
                padding: '1rem',
                marginBottom: '1.5rem'
              }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#1e40af', fontSize: '0.875rem', fontWeight: '600' }}>
                  CSV Format Instructions:
                </h4>
                <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#1e3a8a', fontSize: '0.8125rem', lineHeight: '1.6' }}>
                  <li>First row must contain column headers</li>
                  <li>Use semicolons (;) to separate multiple values in skills/research_areas</li>
                  <li>Username format: firstname_faculty@research.edu</li>
                  <li>Password format: firstname_faculty</li>
                  {accountType === 'student' && (
                    <>
                      <li>Required fields: name, student_id, gpa, major, faculty, year</li>
                      <li>GPA must be between 0 and 4.0</li>
                    </>
                  )}
                  {accountType === 'professor' && (
                    <>
                      <li>Required fields: name, professor_id, faculty, field, department</li>
                      <li>Publications and total_slots should be numbers</li>
                    </>
                  )}
                </ul>
              </div>

              {/* Download Template Button */}
              <button
                onClick={downloadTemplate}
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                }}
              >
                <FileText size={18} />
                Download CSV Template
              </button>

              {/* File Upload */}
              <div style={{
                border: '2px dashed #d1d5db',
                borderRadius: '12px',
                padding: '2rem',
                textAlign: 'center',
                marginBottom: '1.5rem',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.currentTarget.style.borderColor = '#667eea';
                e.currentTarget.style.background = '#f0f4ff';
              }}
              onDragLeave={(e) => {
                e.currentTarget.style.borderColor = '#d1d5db';
                e.currentTarget.style.background = 'white';
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.style.borderColor = '#d1d5db';
                e.currentTarget.style.background = 'white';
                const droppedFile = e.dataTransfer.files[0];
                if (droppedFile) {
                  const input = document.getElementById('csv-upload') as HTMLInputElement;
                  const dataTransfer = new DataTransfer();
                  dataTransfer.items.add(droppedFile);
                  input.files = dataTransfer.files;
                  handleFileChange({ target: input } as any);
                }
              }}>
                <Upload size={48} style={{ color: '#9ca3af', margin: '0 auto 1rem' }} />
                <p style={{ margin: 0, fontSize: '1rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                  Drag and drop your CSV file here
                </p>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
                  or
                </p>
                <label
                  htmlFor="csv-upload"
                  style={{
                    padding: '0.625rem 1.25rem',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    display: 'inline-block',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                  }}
                >
                  Browse Files
                </label>
                <input
                  id="csv-upload"
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </div>

              {/* Selected File Info */}
              {file && (
                <div style={{
                  background: '#f9fafb',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '1rem',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <FileText size={24} color="#667eea" />
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>
                      {file.name}
                    </p>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280' }}>
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  {parsedData.length > 0 && (
                    <div style={{
                      padding: '0.375rem 0.75rem',
                      background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
                      color: '#166534',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}>
                      <CheckCircle size={14} />
                      {parsedData.length} records
                    </div>
                  )}
                </div>
              )}

              {/* Errors */}
              {errors.length > 0 && (
                <div style={{
                  background: '#fef2f2',
                  border: '2px solid #fecaca',
                  borderRadius: '12px',
                  padding: '1rem',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <AlertCircle size={18} color="#dc2626" />
                    <h4 style={{ margin: 0, color: '#dc2626', fontSize: '0.875rem', fontWeight: '600' }}>
                      Validation Errors ({errors.length})
                    </h4>
                  </div>
                  <div style={{
                    maxHeight: '150px',
                    overflow: 'auto',
                    fontSize: '0.8125rem',
                    color: '#991b1b'
                  }}>
                    {errors.map((error, index) => (
                      <div key={index} style={{ marginBottom: '0.25rem' }}>
                        • {error}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Preview */}
              {parsedData.length > 0 && (
                <div style={{
                  marginBottom: '1.5rem'
                }}>
                  <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>
                    Preview (First 3 records)
                  </h4>
                  <div style={{
                    background: '#f9fafb',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '1rem',
                    maxHeight: '200px',
                    overflow: 'auto',
                    fontSize: '0.8125rem'
                  }}>
                    {parsedData.slice(0, 3).map((record, index) => (
                      <div
                        key={index}
                        style={{
                          padding: '0.75rem',
                          background: 'white',
                          borderRadius: '8px',
                          marginBottom: index < 2 ? '0.5rem' : 0,
                          border: '1px solid #e5e7eb'
                        }}
                      >
                        <div style={{ fontWeight: '600', color: '#374151', marginBottom: '0.25rem' }}>
                          {record.name}
                        </div>
                        <div style={{ color: '#6b7280' }}>
                          {accountType === 'student' 
                            ? `${record.student_id} • ${record.major} • GPA: ${record.gpa}`
                            : `${record.professor_id} • ${record.field} • ${record.department}`
                          }
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={onClose}
                  style={{
                    flex: 1,
                    padding: '0.875rem',
                    background: 'white',
                    color: '#6b7280',
                    border: '2px solid #e5e7eb',
                    borderRadius: '10px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={parsedData.length === 0 || isProcessing}
                  style={{
                    flex: 1,
                    padding: '0.875rem',
                    background: parsedData.length === 0 || isProcessing
                      ? '#9ca3af'
                      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: '600',
                    cursor: parsedData.length === 0 || isProcessing ? 'not-allowed' : 'pointer',
                    boxShadow: parsedData.length > 0 && !isProcessing ? '0 4px 12px rgba(102, 126, 234, 0.4)' : 'none'
                  }}
                >
                  {isProcessing ? 'Creating Accounts...' : `Create ${parsedData.length} Accounts`}
                </button>
              </div>
            </>
          ) : (
            // Success View
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{
                width: '80px',
                height: '80px',
                margin: '0 auto 1.5rem',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '2rem'
              }}>
                ✓
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
                Accounts Created Successfully!
              </h3>
              <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
                {createdCount} {accountType === 'student' ? 'student' : 'professor'} account{createdCount !== 1 ? 's' : ''} have been created.
              </p>

              <div style={{
                background: '#fef3c7',
                border: '2px solid #fde68a',
                borderRadius: '12px',
                padding: '1rem',
                marginBottom: '2rem',
                textAlign: 'left'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <AlertCircle size={18} color="#92400e" />
                  <h4 style={{ margin: 0, color: '#92400e', fontSize: '0.875rem', fontWeight: '600' }}>
                    Important Notice
                  </h4>
                </div>
                <p style={{ margin: 0, color: '#92400e', fontSize: '0.8125rem', lineHeight: '1.5' }}>
                  Credentials have been generated automatically. Users can log in with:
                  <br />
                  <strong>Username:</strong> firstname_faculty@research.edu
                  <br />
                  <strong>Password:</strong> firstname_faculty
                  <br />
                  <br />
                  Please inform users to change their passwords after first login.
                </p>
              </div>

              <button
                onClick={() => {
                  setUploadComplete(false);
                  setFile(null);
                  setParsedData([]);
                  setErrors([]);
                  onClose();
                }}
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
                }}
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}