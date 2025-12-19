import { useState } from 'react';
import { Send } from 'lucide-react';
import { matchingApi, type MatchingResult } from '../../../api/matching';
import { colors } from '../styles/styles';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatSidebarProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  onMatchingResult?: (result: MatchingResult) => void;
}

export default function ChatSidebar({ messages, onSendMessage, onMatchingResult }: ChatSidebarProps) {
  const [inputMessage, setInputMessage] = useState('');
  const [isMatchingLoading, setIsMatchingLoading] = useState(false);

  const handleSend = async () => {
    if (!inputMessage.trim()) return;
    
    const query = inputMessage.trim();
    onSendMessage(query);
    setInputMessage('');

    const matchingKeywords = ['find', 'match', 'recommend', 'suggest', 'looking for', 'need', 'want'];
    const shouldTryMatching = matchingKeywords.some(keyword =>
      query.toLowerCase().includes(keyword)
    );

    if (shouldTryMatching && onMatchingResult) {
      setIsMatchingLoading(true);
      try {
        const result = await matchingApi.findBestMatch(query);
        onMatchingResult(result);
      } catch (error) {
        console.error('Matching failed:', error);
      } finally {
        setIsMatchingLoading(false);
      }
    }
  };

  return (
    <div
      style={{
        width: '400px',
        background: 'white',
        borderLeft: '2px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-4px 0 20px rgba(0,0,0,0.08)'
      }}
    >
      <div
        style={{
          padding: '1.5rem',
          borderBottom: '2px solid #e5e7eb',
          background: colors.primary.gradient,
          color: 'white'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{ fontSize: '1.5rem' }}>A</span>
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 'bold' }}>AI Assistant</h3>
            <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.9 }}>Smart Matching</p>
          </div>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          background: '#f3f4f6'
        }}
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
            }}
          >
            <div
              style={{
                maxWidth: '85%',
                padding: '0.875rem 1.125rem',
                borderRadius: '16px',
                background:
                  msg.role === 'user'
                    ? colors.primary.gradient
                    : 'white',
                color: msg.role === 'user' ? 'white' : '#1f2937',
                fontSize: '0.875rem',
                lineHeight: '1.6',
                boxShadow: msg.role === 'user' 
                  ? `0 4px 12px ${colors.primary.shadow}`
                  : '0 2px 8px rgba(0,0,0,0.08)',
                border: msg.role === 'assistant' ? '2px solid #e5e7eb' : 'none'
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}
        
        {isMatchingLoading && (
          <div
            style={{
              padding: '1rem',
              textAlign: 'center',
              color: '#4b5563',
              fontSize: '0.875rem'
            }}
          >
            Analyzing candidates with AI...
          </div>
        )}
      </div>

      <div
        style={{
          padding: '1rem',
          borderTop: '2px solid #e5e7eb',
          background: 'white'
        }}
      >
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask for a match..."
            style={{
              flex: 1,
              padding: '0.875rem 1rem',
              border: '2px solid #e5e7eb',
              borderRadius: '12px',
              fontSize: '0.875rem',
              outline: 'none',
              transition: 'all 0.3s ease'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#667eea';
              e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e5e7eb';
              e.target.style.boxShadow = 'none';
            }}
          />
          <button
            onClick={handleSend}
            disabled={!inputMessage.trim()}
            style={{
              padding: '0.875rem 1.125rem',
              background: inputMessage.trim() 
                ? colors.primary.gradient
                : '#9ca3af',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: inputMessage.trim() ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              boxShadow: inputMessage.trim() ? `0 4px 12px ${colors.primary.shadow}` : 'none',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              if (inputMessage.trim()) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 6px 20px ${colors.primary.shadowHover}`;
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = inputMessage.trim() 
                ? `0 4px 12px ${colors.primary.shadow}`
                : 'none';
            }}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}