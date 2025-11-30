import { useState, useEffect, useRef } from 'react';
import { X, Send, MessageSquare } from 'lucide-react';
import { colors, baseCard, primaryButton, baseInput } from '../styles/styles';
import { chatApi } from '../../../api/chat';
import type { ChatMessage } from '../../../api/chat';

interface GroupChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: number;
  groupName: string;
  currentUserName: string;
}

export default function GroupChatModal({
  isOpen,
  onClose,
  groupId,
  groupName,
  currentUserName
}: GroupChatModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
      // Mark all messages as read when opening chat
      chatApi.markAllAsRead(groupId).catch(console.error);
    }
  }, [isOpen, groupId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const data = await chatApi.getMessages(groupId);
      setMessages(data);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isSending) return;

    try {
      setIsSending(true);
      const sentMessage = await chatApi.sendMessage(groupId, newMessage.trim());
      setMessages([...messages, sentMessage]);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isCurrentUser = (message: ChatMessage) => {
    return message.sender_name === currentUserName;
  };

  if (!isOpen) return null;

  return (
    <>
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

      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: '800px',
          height: '85vh',
          maxHeight: '700px',
          ...baseCard,
          zIndex: 1001,
          padding: 0,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.5rem',
            borderBottom: `2px solid ${colors.neutral.gray200}`,
            background: colors.primary.gradient,
            color: 'white',
            borderRadius: '16px 16px 0 0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
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
              <MessageSquare size={24} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold' }}>
                {groupName}
              </h2>
              <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.9 }}>
                Group Chat
              </p>
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

        {/* Messages Area */}
        <div
          ref={messagesContainerRef}
          style={{
            flex: 1,
            overflow: 'auto',
            padding: '1.5rem',
            background: colors.neutral.gray50,
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}
        >
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: colors.neutral.gray600 }}>
              Loading messages...
            </div>
          ) : messages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: colors.neutral.gray600 }}>
              <MessageSquare size={48} style={{ opacity: 0.3, margin: '0 auto 1rem' }} />
              <p style={{ margin: 0, fontSize: '0.875rem' }}>No messages yet</p>
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.75rem' }}>
                Start the conversation!
              </p>
            </div>
          ) : (
            messages.map((message) => {
              const isOwn = isCurrentUser(message);
              return (
                <div
                  key={message.id}
                  style={{
                    display: 'flex',
                    justifyContent: isOwn ? 'flex-end' : 'flex-start'
                  }}
                >
                  <div
                    style={{
                      maxWidth: '70%',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.25rem'
                    }}
                  >
                    {!isOwn && (
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          color: colors.neutral.gray600,
                          marginLeft: '0.75rem'
                        }}
                      >
                        {message.sender_name}
                      </span>
                    )}
                    <div
                      style={{
                        padding: '0.875rem 1.125rem',
                        borderRadius: isOwn ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                        background: isOwn
                          ? colors.primary.gradient
                          : colors.neutral.white,
                        color: isOwn ? 'white' : colors.neutral.gray900,
                        boxShadow: isOwn
                          ? `0 4px 12px ${colors.primary.shadow}`
                          : '0 2px 8px rgba(0,0,0,0.08)',
                        border: isOwn ? 'none' : `2px solid ${colors.neutral.gray200}`,
                        wordWrap: 'break-word'
                      }}
                    >
                      <p style={{ margin: 0, fontSize: '0.875rem', lineHeight: '1.5' }}>
                        {message.message}
                      </p>
                      {message.edited_at && (
                        <p
                          style={{
                            margin: '0.25rem 0 0 0',
                            fontSize: '0.625rem',
                            opacity: 0.7,
                            fontStyle: 'italic'
                          }}
                        >
                          (edited)
                        </p>
                      )}
                    </div>
                    <span
                      style={{
                        fontSize: '0.625rem',
                        color: colors.neutral.gray600,
                        marginLeft: isOwn ? 'auto' : '0.75rem',
                        marginRight: isOwn ? '0.75rem' : 'auto'
                      }}
                    >
                      {formatTime(message.created_at)}
                    </span>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div
          style={{
            padding: '1rem 1.5rem',
            borderTop: `2px solid ${colors.neutral.gray200}`,
            background: colors.neutral.white,
            borderRadius: '0 0 16px 16px'
          }}
        >
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={isSending}
              rows={1}
              style={{
                ...baseInput,
                resize: 'none',
                minHeight: '44px',
                maxHeight: '120px',
                fontFamily: 'inherit',
                opacity: isSending ? 0.6 : 1
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = colors.neutral.gray200;
                e.target.style.boxShadow = 'none';
              }}
            />
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || isSending}
              style={{
                ...primaryButton,
                padding: '0.875rem 1.125rem',
                opacity: (!newMessage.trim() || isSending) ? 0.5 : 1,
                cursor: (!newMessage.trim() || isSending) ? 'not-allowed' : 'pointer',
                flexShrink: 0
              }}
              onMouseEnter={(e) => {
                if (newMessage.trim() && !isSending) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = `0 6px 20px ${colors.primary.shadowHover}`;
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = `0 4px 12px ${colors.primary.shadow}`;
              }}
            >
              <Send size={18} />
            </button>
          </div>
          <p style={{
            margin: '0.5rem 0 0 0',
            fontSize: '0.625rem',
            color: colors.neutral.gray600
          }}>
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </>
  );
}