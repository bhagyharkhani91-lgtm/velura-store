import { useEffect } from 'react';
import { Mail, MailOpen, Trash2 } from 'lucide-react';
import { useMessagesStore } from '../../../stores/messagesStore';

export function AdminMessagesPage() {
  const { messages, fetchMessages, updateMessageStatus, deleteMessage, isLoading } = useMessagesStore();

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="heading-3xl">Contact Messages</h1>
      </div>

      <div className="bg-surface rounded-lg border border-border overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-secondary">Loading messages...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-secondary text-secondary text-sm border-b border-border">
                <th className="p-4 font-medium">Sender</th>
                <th className="p-4 font-medium">Subject & Message</th>
                <th className="p-4 font-medium w-32">Status</th>
                <th className="p-4 font-medium text-right w-24">Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((msg) => (
                <tr 
                  key={msg.id} 
                  className={`border-b border-border transition-colors ${msg.status === 'unread' ? 'bg-bg-hover font-medium' : 'hover:bg-bg-hover'}`}
                >
                  <td className="p-4 align-top">
                    <div className="text-primary">{msg.name}</div>
                    <div className="text-xs text-secondary mt-1">{msg.email}</div>
                  </td>
                  <td className="p-4 align-top">
                    <div className="text-sm text-primary mb-1">{msg.subject || 'No Subject'}</div>
                    <p className={`text-sm ${msg.status === 'unread' ? 'text-primary' : 'text-secondary'} whitespace-pre-wrap`}>
                      {msg.message}
                    </p>
                    <span className="text-xs text-secondary mt-2 block">
                      {new Date(msg.createdAt).toLocaleString()}
                    </span>
                  </td>
                  <td className="p-4 align-top">
                    <span className={`text-xs px-2 py-1 rounded capitalize ${msg.status === 'unread' ? 'bg-accent/20 text-accent' : 'bg-bg-secondary text-secondary'}`}>
                      {msg.status}
                    </span>
                  </td>
                  <td className="p-4 align-top">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => updateMessageStatus(msg.id, msg.status === 'unread' ? 'read' : 'unread')} 
                        className="text-secondary hover:text-primary transition-colors p-1"
                        title={msg.status === 'unread' ? 'Mark as Read' : 'Mark as Unread'}
                      >
                        {msg.status === 'unread' ? <MailOpen size={18} /> : <Mail size={18} />}
                      </button>
                      <div className="w-px h-4 bg-border self-center mx-1"></div>
                      <button 
                        onClick={() => {
                          if (window.confirm("Are you sure you want to permanently delete this message?")) {
                            deleteMessage(msg.id);
                          }
                        }} 
                        className="text-secondary hover:text-error transition-colors p-1"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {messages.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-secondary">
                    No messages found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
