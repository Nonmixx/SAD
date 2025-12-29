import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, User, Search, Phone, Video, Image as ImageIcon, Smile, LogOut, Home, MessageCircle, Bell, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

type User = {
  id: string;
  fullName: string;
  profilePicture?: string;
};

type ChatMessage = {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  type: 'text' | 'image';
};

type Conversation = {
  id: string;
  studentId: string;
  studentName: string;
  listingId: string;
  listingTitle: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
  messages: ChatMessage[];
};

type LandlordChatPageProps = {
  user: User;
  onNavigate: (page: any) => void;
  onLogout: () => void;
  onShowAddModal?: () => void;
  onShowInquiries?: () => void;
  initialConversationId?: string;
  chatParams?: { studentName?: string };
};

const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    studentId: 'student-1',
    studentName: 'Alex Chen',
    listingId: '1',
    listingTitle: 'Cozy Studio Near UM',
    lastMessage: 'Sure! When can we meet to view the room?',
    timestamp: '10:30 AM',
    unread: 1,
    online: true,
    messages: [
      {
        id: 'm1',
        senderId: 'student-1',
        text: 'Hi! I\'m interested in this studio. Is it still available? Can I schedule a viewing this weekend?',
        timestamp: '10:25 AM',
        type: 'text',
      },
      {
        id: 'm2',
        senderId: 'landlord',
        text: 'Yes, it is still available! I can do viewings on Saturday or Sunday. What time works best for you?',
        timestamp: '10:28 AM',
        type: 'text',
      },
      {
        id: 'm3',
        senderId: 'student-1',
        text: 'Sure! When can we meet to view the room?',
        timestamp: '10:30 AM',
        type: 'text',
      },
    ],
  },
  {
    id: 'conv-2',
    studentId: 'student-2',
    studentName: 'Sarah Lim',
    listingId: '2',
    listingTitle: 'Spacious 2BR Apartment',
    lastMessage: 'Thanks for the detailed information!',
    timestamp: 'Yesterday',
    unread: 0,
    online: false,
    messages: [
      {
        id: 'm1',
        senderId: 'student-2',
        text: 'Hello! What utilities are included in the rent?',
        timestamp: 'Yesterday 3:45 PM',
        type: 'text',
      },
      {
        id: 'm2',
        senderId: 'landlord',
        text: 'Hi Sarah! Water and maintenance fees are included. Electricity and internet are separate.',
        timestamp: 'Yesterday 4:02 PM',
        type: 'text',
      },
      {
        id: 'm3',
        senderId: 'student-2',
        text: 'Thanks for the detailed information!',
        timestamp: 'Yesterday 4:10 PM',
        type: 'text',
      },
    ],
  },
  {
    id: 'conv-3',
    studentId: 'student-3',
    studentName: 'Mike Tan',
    listingId: '3',
    listingTitle: 'Modern Room with Parking',
    lastMessage: 'Is parking included?',
    timestamp: 'Monday',
    unread: 2,
    online: true,
    messages: [
      {
        id: 'm1',
        senderId: 'student-3',
        text: 'Hi! I saw your listing. Is parking included?',
        timestamp: 'Monday 2:15 PM',
        type: 'text',
      },
    ],
  },
];

export function LandlordChatPage({ user, onNavigate, onLogout, onShowAddModal, onShowInquiries, initialConversationId, chatParams }: LandlordChatPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConversation]);

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConversation) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        senderId: 'landlord',
        text: newMessage,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        type: 'text',
      };

      // Update messages in the selected conversation
      const updatedConversations = conversations.map(conv => {
        if (conv.id === selectedConversation.id) {
          return {
            ...conv,
            messages: [...conv.messages, message],
            lastMessage: newMessage,
            timestamp: 'Just now',
          };
        }
        return conv;
      });

      setConversations(updatedConversations);
      
      // Update selected conversation
      const updated = updatedConversations.find(c => c.id === selectedConversation.id);
      if (updated) {
        setSelectedConversation(updated);
      }

      setNewMessage('');
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.listingTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unread, 0);

  useEffect(() => {
    if (initialConversationId) {
      const initialConversation = conversations.find(c => c.id === initialConversationId);
      if (initialConversation) {
        setSelectedConversation(initialConversation);
      }
    }
  }, [initialConversationId, conversations]);

  // Auto-select conversation when coming from inquiries
  useEffect(() => {
    if (chatParams?.studentName) {
      const targetConversation = conversations.find(
        c => c.studentName === chatParams.studentName
      );
      if (targetConversation) {
        // Mark conversation as read
        const updatedConversations = conversations.map(conv =>
          conv.id === targetConversation.id ? { ...conv, unread: 0 } : conv
        );
        setConversations(updatedConversations);
        
        // Select the conversation
        const updated = updatedConversations.find(c => c.id === targetConversation.id);
        if (updated) {
          setSelectedConversation(updated);
        }
      }
    }
  }, [chatParams]);

  return (
    <div className="h-full flex flex-col bg-[#FAFAFA]">
      {/* Header */}
      <header className="bg-white shadow-sm z-20">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (selectedConversation) {
                  setSelectedConversation(null);
                } else {
                  onNavigate('landlord-dashboard');
                }
              }}
              className="text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h2 className="text-base">
              {selectedConversation ? selectedConversation.studentName : 'Messages'}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {!selectedConversation && (
              <>
                <button
                  onClick={() => onNavigate('landlord-profile')}
                  className="w-8 h-8 bg-[#81D9F7] rounded-full flex items-center justify-center text-white"
                >
                  <User className="h-4 w-4" />
                </button>
                <Button onClick={onLogout} variant="ghost" size="sm">
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            )}
            {selectedConversation && (
              <div className="flex items-center gap-1">
                <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
                  <Phone className="h-4 w-4 text-gray-600" />
                </button>
                <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
                  <Video className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {!selectedConversation ? (
          /* Conversations List */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Search */}
            <div className="p-3 border-b bg-white">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search conversations..."
                  className="pl-9 rounded-lg h-10"
                />
              </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation)}
                  className="w-full p-3 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b active:bg-gray-100"
                >
                  <div className="relative">
                    <div className="w-12 h-12 bg-[#81D9F7] rounded-full flex items-center justify-center text-white shrink-0">
                      <User className="h-6 w-6" />
                    </div>
                    {conversation.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                    )}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="truncate text-sm">{conversation.studentName}</span>
                      <span className="text-xs text-gray-500 shrink-0 ml-2">{conversation.timestamp}</span>
                    </div>
                    <p className="text-xs text-gray-500 truncate mb-1">{conversation.listingTitle}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-600 truncate">{conversation.lastMessage}</p>
                      {conversation.unread > 0 && (
                        <span className="ml-2 w-5 h-5 bg-[#81D9F7] text-white rounded-full flex items-center justify-center text-xs shrink-0">
                          {conversation.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}

              {filteredConversations.length === 0 && (
                <div className="p-8 text-center">
                  <p className="text-gray-500 text-sm">No conversations found</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Chat View */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedConversation.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === 'landlord' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                      message.senderId === 'landlord'
                        ? 'bg-[#81D9F7] text-white rounded-br-sm'
                        : 'bg-white rounded-bl-sm shadow-sm'
                    }`}
                  >
                    <p className="break-words whitespace-pre-wrap text-sm">{message.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.senderId === 'landlord' ? 'text-white/70' : 'text-gray-500'
                      }`}
                    >
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="bg-white border-t p-3">
              <div className="flex items-center gap-2">
                <button className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shrink-0">
                  <ImageIcon className="h-5 w-5 text-gray-600" />
                </button>
                <button className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shrink-0">
                  <Smile className="h-5 w-5 text-gray-600" />
                </button>
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 rounded-full"
                />
                <Button
                  onClick={handleSendMessage}
                  className="rounded-full w-9 h-9 p-0 bg-[#81D9F7] hover:bg-[#6BC5E0] shrink-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation - Only show when viewing conversations list */}
      {!selectedConversation && (
        <nav className="bg-white border-t shadow-lg">
          <div className="flex items-center justify-around py-2">
            <button
              onClick={() => onNavigate('landlord-dashboard')}
              className="flex flex-col items-center gap-1 px-3 py-1"
            >
              <Home className="h-5 w-5 text-gray-600" />
              <span className="text-xs text-gray-600">Home</span>
            </button>
            <button
              onClick={onShowAddModal}
              className="flex flex-col items-center gap-1 px-3 py-1"
            >
              <Plus className="h-5 w-5 text-gray-600" />
              <span className="text-xs text-gray-600">Add</span>
            </button>
            <button
              onClick={() => onNavigate('landlord-chat')}
              className="flex flex-col items-center gap-1 px-3 py-1 relative"
            >
              <MessageCircle className="h-5 w-5 text-[#81D9F7]" />
              <span className="text-xs text-[#81D9F7]">Messages</span>
              {totalUnread > 0 && (
                <span className="absolute top-0 right-2 w-4 h-4 bg-red-500 text-white rounded-full text-[9px] flex items-center justify-center">
                  {totalUnread}
                </span>
              )}
            </button>
            <button
              onClick={onShowInquiries}
              className="flex flex-col items-center gap-1 px-3 py-1"
            >
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="text-xs text-gray-600">Inquiries</span>
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}