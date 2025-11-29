import { X, Users, Crown, Award, User, Calendar, Mail } from 'lucide-react';
import { colors, baseCard, badge } from '../styles/styles';
import type { Group } from '../../../api/types';
import type { GroupMember } from '../../../api/groups';
import type { StudentWithUser, ProfessorWithUser } from '../../../api/types';

interface GroupDetailModalProps {
  isOpen: boolean;
  group: Group | null;
  members?: GroupMember[];
  onClose: () => void;
  onMemberClick?: (studentId: number) => void;
  onMentorClick?: (professorId: number) => void;
  students: StudentWithUser[];
  professors: ProfessorWithUser[];
}

export default function GroupDetailModal({
  isOpen,
  group,
  members = [],
  onClose,
  onMemberClick,
  onMentorClick,
  students,
  professors
}: GroupDetailModalProps) {
  if (!isOpen || !group) return null;

  // Find leader and regular members
  const leaderMember = members.find(m => m.role === 'leader');
  const regularMembers = members.filter(m => m.role === 'member');

  // Get student data
  const leaderStudent = leaderMember ? students.find(s => s.id === leaderMember.student_id) : null;
  const mentor = group.mentor_id ? professors.find(p => p.id === group.mentor_id) : null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
          backdropFilter: 'blur(4px)'
        }}
      />
      
      {/* Modal */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          ...baseCard,
          maxWidth: '700px',
          width: '90%',
          maxHeight: '90vh',
          overflow: 'auto',
          zIndex: 1001,
          padding: 0
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.5rem',
            borderBottom: `2px solid ${colors.neutral.gray200}`,
            background: colors.primary.gradient,
            color: 'white',
            borderRadius: '16px 16px 0 0'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Users size={24} />
                </div>
                <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>
                  {group.name}
                </h2>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.875rem', opacity: 0.9 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <User size={14} />
                  {group.current_members}/{group.max_members} Members
                </span>
                {group.created_at && (
                  <>
                    <span>•</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Calendar size={14} />
                      Created {formatDate(group.created_at)}
                    </span>
                  </>
                )}
              </div>
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
                color: 'white',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div style={{ padding: '1.5rem' }}>
          {/* Description */}
          <div style={{ marginBottom: '1.5rem' }}>
            <p
              style={{
                fontSize: '0.75rem',
                fontWeight: '600',
                color: colors.neutral.gray900,
                marginBottom: '0.5rem',
                letterSpacing: '0.5px'
              }}
            >
              DESCRIPTION
            </p>
            <p
              style={{
                margin: 0,
                fontSize: '0.875rem',
                color: colors.neutral.gray600,
                lineHeight: '1.6'
              }}
            >
              {group.description}
            </p>
          </div>

          {/* Needed Skills */}
          <div style={{ marginBottom: '1.5rem' }}>
            <p
              style={{
                fontSize: '0.75rem',
                fontWeight: '600',
                color: colors.neutral.gray900,
                marginBottom: '0.5rem',
                letterSpacing: '0.5px'
              }}
            >
              NEEDED SKILLS
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {group.needed_skills.map((skill) => (
                <span
                  key={skill}
                  style={{
                    ...badge,
                    background: colors.warning.gradient,
                    color: colors.warning.text,
                    border: `2px solid ${colors.warning.border}`
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Mentor Section */}
          {group.has_mentor && mentor && (
            <div style={{ marginBottom: '1.5rem' }}>
              <p
                style={{
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: colors.neutral.gray900,
                  marginBottom: '0.75rem',
                  letterSpacing: '0.5px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}
              >
                <Award size={14} />
                MENTOR
              </p>
              <div
                onClick={() => onMentorClick?.(mentor.id)}
                style={{
                  padding: '1rem',
                  background: colors.success.light,
                  borderRadius: '12px',
                  border: `2px solid ${colors.success.border}`,
                  cursor: onMemberClick ? 'pointer' : 'default',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  if (onMentorClick) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = `0 4px 12px ${colors.success.shadow}`;
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: colors.secondary.gradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '1.125rem',
                      boxShadow: `0 2px 8px ${colors.secondary.shadow}`
                    }}
                  >
                    {mentor.name.split(' ')[1]?.[0] || mentor.name[0]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 'bold', color: colors.neutral.gray900 }}>
                      {mentor.name}
                    </h4>
                    <p style={{ margin: '0.125rem 0 0 0', fontSize: '0.75rem', color: colors.neutral.gray600 }}>
                      {mentor.department}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                  {mentor.research_areas.slice(0, 3).map((area) => (
                    <span
                      key={area}
                      style={{
                        padding: '0.25rem 0.625rem',
                        background: colors.neutral.gray100,
                        color: colors.neutral.gray600,
                        borderRadius: '6px',
                        fontSize: '0.625rem',
                        fontWeight: '600'
                      }}
                    >
                      {area}
                    </span>
                  ))}
                  {mentor.research_areas.length > 3 && (
                    <span
                      style={{
                        padding: '0.25rem 0.625rem',
                        background: colors.neutral.gray100,
                        color: colors.neutral.gray600,
                        borderRadius: '6px',
                        fontSize: '0.625rem',
                        fontWeight: '600'
                      }}
                    >
                      +{mentor.research_areas.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Members Section */}
          <div>
            <p
              style={{
                fontSize: '0.75rem',
                fontWeight: '600',
                color: colors.neutral.gray900,
                marginBottom: '0.75rem',
                letterSpacing: '0.5px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
            >
              <Users size={14} />
              MEMBERS ({members.length})
            </p>

            {/* Group Leader */}
            {leaderStudent && leaderMember && (
              <div style={{ marginBottom: '1rem' }}>
                <p
                  style={{
                    fontSize: '0.625rem',
                    fontWeight: '600',
                    color: colors.neutral.gray600,
                    marginBottom: '0.5rem',
                    letterSpacing: '0.5px'
                  }}
                >
                  GROUP LEADER
                </p>
                <div
                  onClick={() => onMemberClick?.(leaderStudent.id)}
                  style={{
                    padding: '1rem',
                    background: 'linear-gradient(135deg, #ede9fe 0%, #faf5ff 100%)',
                    borderRadius: '12px',
                    border: `2px solid rgba(102, 126, 234, 0.2)`,
                    cursor: onMemberClick ? 'pointer' : 'default',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (onMemberClick) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: colors.primary.gradient,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '1.125rem',
                        boxShadow: `0 2px 8px ${colors.primary.shadow}`
                      }}
                    >
                      {leaderStudent.name[0]}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <h4 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 'bold', color: colors.neutral.gray900 }}>
                          {leaderStudent.name}
                        </h4>
                        <Crown size={14} style={{ color: colors.warning.text }} />
                      </div>
                      <p style={{ margin: '0.125rem 0 0 0', fontSize: '0.75rem', color: colors.neutral.gray600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Mail size={12} />
                        {leaderStudent.email}
                      </p>
                      <p style={{ margin: '0.125rem 0 0 0', fontSize: '0.75rem', color: colors.neutral.gray600 }}>
                        {leaderStudent.major} • GPA: {leaderStudent.gpa.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  {leaderStudent.skills && leaderStudent.skills.length > 0 && (
                    <div style={{ marginTop: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                      {leaderStudent.skills.slice(0, 4).map((skill: string) => (
                        <span
                          key={skill}
                          style={{
                            padding: '0.25rem 0.625rem',
                            background: 'rgba(102, 126, 234, 0.1)',
                            color: colors.neutral.gray900,
                            borderRadius: '6px',
                            fontSize: '0.625rem',
                            fontWeight: '600'
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                      {leaderStudent.skills.length > 4 && (
                        <span
                          style={{
                            padding: '0.25rem 0.625rem',
                            background: 'rgba(102, 126, 234, 0.1)',
                            color: colors.neutral.gray900,
                            borderRadius: '6px',
                            fontSize: '0.625rem',
                            fontWeight: '600'
                          }}
                        >
                          +{leaderStudent.skills.length - 4}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Regular Members */}
            {regularMembers.length > 0 && (
              <div>
                <p
                  style={{
                    fontSize: '0.625rem',
                    fontWeight: '600',
                    color: colors.neutral.gray600,
                    marginBottom: '0.5rem',
                    letterSpacing: '0.5px'
                  }}
                >
                  TEAM MEMBERS
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {regularMembers.map((memberData) => {
                    const member = students.find(s => s.id === memberData.student_id);
                    if (!member) return null;

                    return (
                      <div
                        key={member.id}
                        onClick={() => onMemberClick?.(member.id)}
                        style={{
                          padding: '0.875rem',
                          background: colors.neutral.gray50,
                          borderRadius: '10px',
                          border: `2px solid ${colors.neutral.gray200}`,
                          cursor: onMemberClick ? 'pointer' : 'default',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          if (onMemberClick) {
                            e.currentTarget.style.background = colors.neutral.gray100;
                            e.currentTarget.style.borderColor = colors.neutral.gray400;
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = colors.neutral.gray50;
                          e.currentTarget.style.borderColor = colors.neutral.gray200;
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '8px',
                              background: colors.success.gradient,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontWeight: 'bold',
                              fontSize: '1rem',
                              boxShadow: `0 2px 8px ${colors.success.shadow}`
                            }}
                          >
                            {member.name[0]}
                          </div>
                          <div style={{ flex: 1 }}>
                            <h5 style={{ margin: 0, fontSize: '0.875rem', fontWeight: '600', color: colors.neutral.gray900 }}>
                              {member.name}
                            </h5>
                            <p style={{ margin: '0.125rem 0 0 0', fontSize: '0.6875rem', color: colors.neutral.gray600 }}>
                              {member.email}
                            </p>
                            <p style={{ margin: '0.125rem 0 0 0', fontSize: '0.6875rem', color: colors.neutral.gray600 }}>
                              Joined {formatDate(memberData.joined_at)}
                            </p>
                          </div>
                        </div>
                        {member.skills && member.skills.length > 0 && (
                          <div style={{ marginTop: '0.625rem', display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                            {member.skills.slice(0, 3).map((skill) => (
                              <span
                                key={skill}
                                style={{
                                  padding: '0.25rem 0.5rem',
                                  background: colors.neutral.gray100,
                                  color: colors.neutral.gray600,
                                  borderRadius: '6px',
                                  fontSize: '0.625rem',
                                  fontWeight: '600'
                                }}
                              >
                                {skill}
                              </span>
                            ))}
                            {member.skills.length > 3 && (
                              <span
                                style={{
                                  padding: '0.25rem 0.5rem',
                                  background: colors.neutral.gray100,
                                  color: colors.neutral.gray600,
                                  borderRadius: '6px',
                                  fontSize: '0.625rem',
                                  fontWeight: '600'
                                }}
                              >
                                +{member.skills.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {members.length === 0 && (
              <div style={{
                padding: '2rem',
                textAlign: 'center',
                color: colors.neutral.gray600,
                background: colors.neutral.gray50,
                borderRadius: '10px'
              }}>
                <Users size={32} style={{ opacity: 0.3, margin: '0 auto 0.5rem' }} />
                <p style={{ margin: 0, fontSize: '0.875rem' }}>No members yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
