import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Search, Send, Image, Smile, MoreVertical, User, LogOut, Phone, Video, Bot, Menu, Home, Users, MessageCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

type User = {
  id: string;
  fullName: string;
  profilePicture?: string;
};

type Contact = {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
  isAI?: boolean;
};

type Message = {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  type: 'text' | 'image';
};

type ChatPageProps = {
  user: User;
  onNavigate: (page: any) => void;
  onLogout: () => void;
  chatParams?: { contactName?: string };
};

const defaultContacts: Contact[] = [
  {
    id: 'ai-assistant',
    name: 'ROOMEO AI Assistant',
    lastMessage: 'Hi! I can help you find rooms, match roommates, and answer questions!',
    timestamp: 'Now',
    unread: 0,
    online: true,
    isAI: true,
  },
  {
    id: '1',
    name: 'Alex Chen',
    lastMessage: 'I prefer separate rooms if possible. Maybe we can find a 2-bedroom apartment?',
    timestamp: '10:30 AM',
    unread: 0,
    online: true,
  },
  {
    id: '2',
    name: 'Sarah Lim',
    lastMessage: 'Thanks for the info!',
    timestamp: 'Yesterday',
    unread: 0,
    online: false,
  },
  {
    id: '3',
    name: 'Mike Tan',
    lastMessage: 'Is the room still available?',
    timestamp: 'Monday',
    unread: 0,
    online: true,
  },
  {
    id: '4',
    name: 'Emily Wong',
    lastMessage: 'Looking forward to it!',
    timestamp: 'Sunday',
    unread: 0,
    online: false,
  },
];

const defaultMessages: { [key: string]: Message[] } = {
  'ai-assistant': [
    {
      id: '1',
      senderId: 'ai-assistant',
      text: '👋 Hi! I\'m your ROOMEO AI Assistant. I can help you with:\n\n🏠 Finding the perfect room\n👥 Matching with compatible roommates\n💰 Price recommendations\n📍 Location suggestions\n\nHow can I assist you today?',
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      type: 'text',
    },
  ],
  '1': [
    {
      id: '1',
      senderId: 'me',
      text: 'Hi Alex! I saw your profile on the roommate finder. We have a 95% match!',
      timestamp: '10:20 AM',
      type: 'text',
    },
    {
      id: '2',
      senderId: '1',
      text: 'Hey! Yes, I noticed that too! Our preferences seem really compatible.',
      timestamp: '10:22 AM',
      type: 'text',
    },
    {
      id: '3',
      senderId: 'me',
      text: 'I\'m looking for a roommate around Pantai Dalam area. What about you?',
      timestamp: '10:25 AM',
      type: 'text',
    },
    {
      id: '4',
      senderId: '1',
      text: 'Perfect! I\'m also looking in that area. My budget is around RM 400-600. What\'s yours?',
      timestamp: '10:27 AM',
      type: 'text',
    },
    {
      id: '5',
      senderId: 'me',
      text: 'Same range! That works out great. Are you okay with splitting rent on a shared room or looking for separate rooms?',
      timestamp: '10:29 AM',
      type: 'text',
    },
    {
      id: '6',
      senderId: '1',
      text: 'I prefer separate rooms if possible. Maybe we can find a 2-bedroom apartment?',
      timestamp: '10:30 AM',
      type: 'text',
    },
  ],
};

const getAIResponse = (userMessage: string): string => {
  const lowerMessage = userMessage.toLowerCase();
  
  // Advanced contextual responses
  
  // Room finding queries
  if (lowerMessage.includes('budget') && (lowerMessage.includes('room') || lowerMessage.includes('find'))) {
    if (lowerMessage.match(/\d+/)) {
      const budget = parseInt(lowerMessage.match(/\d+/)?.[0] || '500');
      if (budget < 400) {
        return `🏠 Great! For a budget of RM ${budget}, I recommend:\n\n✨ **Top Picks:**\n• Shared rooms in Pantai Dalam (RM 280-350)\n• Single rooms in Kerinchi (RM 300-380)\n\n💡 **Tip:** These areas are 1.5-2km from UM and have good public transport. Would you like me to show you rooms with specific facilities?`;
      } else if (budget < 600) {
        return `🏠 Perfect! For RM ${budget}, you have great options:\n\n✨ **Recommended:**\n• Studio apartments in Pantai Dalam (RM 450-550)\n• Single rooms with attached bath in Bangsar South (RM 500-600)\n\n🎯 All these are within 2.5km of UM. Want to see rooms with parking or gym facilities?`;
      } else {
        return `🏠 Excellent budget! For RM ${budget}+:\n\n✨ **Premium Options:**\n• Luxury studios in Bangsar (RM 650-800)\n• Master rooms in Mid Valley area (RM 700-900)\n\n🌟 These include premium amenities like pools, gyms, and 24/7 security. Check the Map View to see exact locations!`;
      }
    }
    return `🏠 I'd love to help you find a room! What's your budget range?\n\n📊 **Average Prices:**\n💵 Budget: RM 280-400\n💳 Mid-range: RM 400-600\n💎 Premium: RM 600-900\n\nLet me know your budget and I'll suggest the perfect matches!`;
  }
  
  if (lowerMessage.includes('near') || lowerMessage.includes('close') || lowerMessage.includes('walking')) {
    return `📍 Looking for rooms close to campus? Smart choice!\n\n🚶 **Walking Distance (<1.5km):**\n• Pantai Dalam - RM 350-550\n• Average 15-20 min walk to UM\n\n🚴 **Cycling Distance (1.5-3km):**\n• Bangsar South - RM 500-700\n• Kerinchi - RM 300-500\n\n🚗 **Short Drive (3-4km):**\n• Bangsar - RM 600-900\n• Mid Valley area - RM 550-800\n\nUse the Map View to see exact distances! 🗺️`;
  }
  
  if (lowerMessage.includes('facilities') || lowerMessage.includes('amenities') || lowerMessage.includes('gym') || lowerMessage.includes('pool')) {
    return `🎯 Facilities matter! Here's what's available:\n\n✅ **Common Facilities:**\n• Wi-Fi (90% of rooms)\n• Air-conditioning (75%)\n• Furniture (85%)\n\n🏋️ **Premium Facilities:**\n• Swimming Pool (RM 650+ range)\n• Gym (RM 600+ range)\n• Parking (RM 500+ range)\n• Study Room (RM 550+ range)\n\n💡 Use the Room Search filters to find rooms with specific facilities!`;
  }
  
  // Roommate matching queries
  if (lowerMessage.includes('roommate') || lowerMessage.includes('match')) {
    if (lowerMessage.includes('find') || lowerMessage.includes('looking')) {
      return `👥 Let's find you the perfect roommate!\n\n🎯 **Our Matching Algorithm considers:**\n✓ Lifestyle compatibility (Quiet vs Social)\n✓ Cleanliness habits (Very Neat, Neat, Average)\n✓ Sleep schedule (Early bird vs Night owl)\n✓ Budget alignment\n✓ Study preferences\n✓ Hobbies & interests\n\n💡 **Tip:** Complete your profile for better matches!\nCurrent top matches have 85-95% compatibility. Check Roommate Finder! 🔍`;
    }
    if (lowerMessage.includes('early bird') || lowerMessage.includes('morning')) {
      return `🌅 Early bird! I can help you find similar roommates:\n\n✨ **Top Matches:**\n• Alex Chen (95% match) - Engineering student, wakes at 6 AM\n• Emily Wong (90% match) - Arts student, morning routine\n\nBoth are non-smokers, keep neat spaces, and prefer quiet environments. Visit Roommate Finder to connect! 🤝`;
    }
    if (lowerMessage.includes('clean') || lowerMessage.includes('neat')) {
      return `✨ Cleanliness is important! I'll find roommates who match:\n\n🧹 **Very Neat Matches:**\n• Alex Chen (95% compatibility)\n• Emily Wong (90% compatibility)\n\nBoth maintain organized spaces and appreciate cleanliness. They also share your budget range and study preferences!`;
    }
    return `👥 Looking for a compatible roommate? I can help!\n\n🎯 **Our smart matching considers:**\n✓ Lifestyle preferences\n✓ Cleanliness habits\n✓ Budget range (RM 300-900)\n✓ Sleep & study schedule\n✓ Hobbies & personality\n\n📊 Average match rate: 82-95%\nCheck out the Roommate Finder to see your matches!`;
  }
  
  // Price and cost queries
  if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('expensive') || lowerMessage.includes('cheap') || lowerMessage.includes('affordable')) {
    return `💰 **Complete Price Guide for UM Area:**\n\n📍 **By Location:**\n• Pantai Dalam: RM 350-550 (1-2km)\n• Kerinchi: RM 300-500 (1.5-2.5km)\n• Bangsar South: RM 500-700 (2-3km)\n• Bangsar: RM 600-900 (3-4km)\n\n🏠 **By Room Type:**\n• Shared Room: RM 250-400\n• Single Room: RM 350-550\n• Master Room: RM 500-700\n• Studio: RM 450-800\n\n💡 **Money-Saving Tips:**\n✓ Shared rooms save 30-40%\n✓ Book early for discounts\n✓ Consider 2km+ from campus\n✓ Negotiate for longer leases\n\nWhat's your budget? I can show exact matches! 🎯`;
  }
  
  // Location queries
  if (lowerMessage.includes('location') || lowerMessage.includes('area') || lowerMessage.includes('where') || lowerMessage.includes('pantai') || lowerMessage.includes('bangsar') || lowerMessage.includes('kerinchi')) {
    return `📍 **Best Areas Near University of Malaya:**\n\n🌟 **Pantai Dalam** (Most Popular)\n• Distance: 1-2 km from UM\n• Price: RM 350-550\n• Vibe: Student-friendly, cafes, budget eats\n• Transport: Walking, Grab, buses\n\n🏢 **Bangsar South**\n• Distance: 2-3 km\n• Price: RM 500-700\n• Vibe: Modern, corporate, trendy\n• Transport: LRT, Grab\n\n💼 **Kerinchi**\n• Distance: 1.5-2.5 km\n• Price: RM 300-500\n• Vibe: Quiet, residential\n• Transport: Grab, buses\n\n🌆 **Bangsar**\n• Distance: 3-4 km\n• Price: RM 600-900\n• Vibe: Upscale, nightlife, expat area\n• Transport: Excellent connectivity\n\n🗺️ Use Map View to explore! What matters most to you - price, distance, or lifestyle?`;
  }
  
  // Transportation queries
  if (lowerMessage.includes('transport') || lowerMessage.includes('lrt') || lowerMessage.includes('bus') || lowerMessage.includes('grab')) {
    return `🚗 **Transportation Guide Around UM:**\n\n🚇 **Public Transport:**\n• Abdullah Hukum LRT (Bangsar South) - 15 min to UM\n• Universiti LRT - Direct campus access\n• RapidKL buses - Multiple routes\n\n🚖 **Grab/E-hailing:**\n• Pantai Dalam → UM: RM 6-8\n• Bangsar South → UM: RM 10-12\n• Kerinchi → UM: RM 7-10\n\n🚴 **Alternative:**\n• Bike-friendly areas: Pantai Dalam, Kerinchi\n• Walking distance (<1.5km): Limited options\n\n💡 Consider areas with LRT access for convenience!`;
  }
  
  // Safety and security queries
  if (lowerMessage.includes('safe') || lowerMessage.includes('security') || lowerMessage.includes('dangerous')) {
    return `🛡️ **Safety Information:**\n\n✅ **Generally Safe Areas:**\n• Pantai Dalam - Well-lit, many students\n• Bangsar South - Modern, security guards\n• Bangsar - Upscale, very safe\n\n🔒 **What to Look For:**\n✓ 24/7 security guards\n✓ CCTV in common areas\n✓ Secure access cards\n✓ Well-lit corridors & parking\n✓ Active neighborhood watch\n\n⚠️ **Safety Tips:**\n• Visit during day and evening\n• Check reviews from other students\n• Verify landlord credentials\n• Use ROOMEO's verified listings\n\nYour safety matters! Always trust your instincts. 🙏`;
  }
  
  // Contract and lease queries
  if (lowerMessage.includes('contract') || lowerMessage.includes('lease') || lowerMessage.includes('deposit') || lowerMessage.includes('agreement')) {
    return `📋 **Rental Contract Guide:**\n\n💰 **Standard Costs:**\n• Deposit: 1-2 months rent\n• Advance: 1 month rent\n• Utility deposit: RM 200-500\n• Agency fee: 0.5-1 month (if applicable)\n\n📝 **Contract Essentials:**\n✓ Rental period (usually 12 months)\n✓ Monthly rent amount\n✓ Included utilities/facilities\n✓ Maintenance responsibilities\n✓ Termination clause\n✓ House rules\n\n⚠️ **Red Flags:**\n❌ No written agreement\n❌ Excessive upfront payment\n❌ Unclear terms\n❌ Unregistered landlord\n\n💡 Always read carefully before signing!`;
  }
  
  // Viewing and schedule queries
  if (lowerMessage.includes('view') || lowerMessage.includes('visit') || lowerMessage.includes('schedule') || lowerMessage.includes('appointment')) {
    return `📅 **Room Viewing Tips:**\n\n✅ **What to Check:**\n• Water pressure & temperature\n• Air-conditioning functionality\n• Natural lighting\n• Noise levels (test at different times)\n• Storage space\n• Internet speed\n• Neighborhood walkability\n\n🕐 **Best Viewing Times:**\n• Morning: Check natural light\n• Evening: Check noise levels & parking\n• Weekend: See neighborhood vibe\n\n📋 **Questions to Ask:**\n1. What utilities are included?\n2. Maintenance response time?\n3. Can I make minor modifications?\n4. What's the move-in date?\n5. Are there any additional fees?\n\n💡 Contact landlords directly through ROOMEO messaging!`;
  }
  
  // Quick helper queries
  if (lowerMessage.includes('help') || lowerMessage.includes('assist') || lowerMessage.includes('can you')) {
    return `🤖 **ROOMEO AI Assistant - I can help you with:**\n\n🏠 **Room Search:**\n• Find rooms by budget, location, facilities\n• Compare prices across areas\n• Get personalized recommendations\n\n👥 **Roommate Matching:**\n• Find compatible roommates (85-95% match)\n• Filter by lifestyle & preferences\n• Connect with potential roommates\n\n💡 **Expert Advice:**\n• Price guides & market insights\n• Transportation options\n• Safety information\n• Contract guidance\n• Viewing tips\n\n📍 **Location Intel:**\n• Area comparisons\n• Distance calculations\n• Neighborhood insights\n\nWhat would you like to know? Just ask! 😊`;
  }
  
  // Greetings
  if (lowerMessage.includes('thank') || lowerMessage.includes('thanks') || lowerMessage.includes('tq')) {
    return `😊 You're very welcome! I'm always here to help you find your perfect home.\n\n💬 Feel free to ask me anything about:\n• Room searching\n• Roommate matching  \n• Prices & budgeting\n• Locations & transportation\n• Safety & contracts\n\nHappy house hunting! 🏠✨`;
  }
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return `👋 Hello! I'm your ROOMEO AI Assistant!\n\n🎯 I'm here to help you:\n✓ Find perfect rooms within your budget\n✓ Match with compatible roommates\n✓ Get area insights & price guides\n✓ Answer any housing questions\n\n💡 **Popular questions:**\n• "Show me budget rooms near UM"\n• "Find me a neat, early-bird roommate"\n• "What's the price range in Pantai Dalam?"\n• "Is Bangsar South safe?"\n\nWhat can I help you with today? 🏠`;
  }
  
  // Default intelligent response
  return `🤔 I understand you're asking about: "${userMessage}"\n\n💬 **I can help you with:**\n\n🏠 **Rooms:** "Find budget rooms" or "Show luxury studios"\n👥 **Roommates:** "Find clean roommates" or "Match night owls"\n💰 **Prices:** "Price guide" or "Cheapest areas"\n📍 **Locations:** "Best areas near UM" or "Walking distance"\n🚗 **Transport:** "LRT access" or "Grab costs"\n🛡️ **Safety:** "Safe neighborhoods" or "Security features"\n\n💡 **Try asking:**\n"I need a room under RM 500"\n"Find roommates who are early birds"\n"What's included in rental contracts?"\n\nHow can I assist you? 🙌`;
};

export function ChatPage({ user, onNavigate, onLogout, chatParams }: ChatPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [contacts, setContacts] = useState<Contact[]>(defaultContacts);
  const [allMessages, setAllMessages] = useState<{ [key: string]: Message[] }>(defaultMessages);
  const [newMessage, setNewMessage] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load messages from localStorage
    const stored = localStorage.getItem('roomeo-messages');
    if (stored) {
      try {
        const storedMessages = JSON.parse(stored);
        // Check if Alex Chen conversation exists and update it with new format
        if (storedMessages['1'] && storedMessages['1'].length > 0) {
          // Only use stored messages if they're already the roommate-finding conversation
          const firstMessage = storedMessages['1'][0];
          if (firstMessage.text && firstMessage.text.includes('roommate finder')) {
            setAllMessages(storedMessages);
          } else {
            // Reset to new default conversation
            setAllMessages(defaultMessages);
          }
        } else {
          setAllMessages(storedMessages);
        }
      } catch (e) {
        console.error('Failed to load messages');
        setAllMessages(defaultMessages);
      }
    } else {
      setAllMessages(defaultMessages);
    }
    
    // Load contacts from localStorage
    const storedContacts = localStorage.getItem('roomeo-contacts');
    if (storedContacts) {
      try {
        setContacts(JSON.parse(storedContacts));
      } catch (e) {
        console.error('Failed to load contacts');
      }
    }
  }, []);

  useEffect(() => {
    // Save messages to localStorage whenever they change
    localStorage.setItem('roomeo-messages', JSON.stringify(allMessages));
  }, [allMessages]);

  useEffect(() => {
    // Save contacts to localStorage
    localStorage.setItem('roomeo-contacts', JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [allMessages, selectedContact]);

  useEffect(() => {
    // Auto-select contact if chatParams.contactName is provided
    if (chatParams?.contactName) {
      const contact = contacts.find(c => c.name === chatParams.contactName);
      if (contact) {
        setSelectedContact(contact);
        setShowSidebar(false);
      }
    }
  }, [chatParams, contacts]);

  const messages = selectedContact ? (allMessages[selectedContact.id] || []) : [];

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedContact) {
      const message: Message = {
        id: Date.now().toString(),
        senderId: 'me',
        text: newMessage,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        type: 'text',
      };
      
      const updatedMessages = [...(allMessages[selectedContact.id] || []), message];
      setAllMessages({ ...allMessages, [selectedContact.id]: updatedMessages });
      
      // Update contact's last message
      const updatedContacts = contacts.map(c => 
        c.id === selectedContact.id 
          ? { ...c, lastMessage: newMessage, timestamp: 'Just now' }
          : c
      );
      setContacts(updatedContacts);
      
      setNewMessage('');
      
      // AI auto-response
      if (selectedContact.isAI) {
        setTimeout(() => {
          const aiResponse: Message = {
            id: (Date.now() + 1).toString(),
            senderId: selectedContact.id,
            text: getAIResponse(newMessage),
            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            type: 'text',
          };
          
          setAllMessages(prev => ({
            ...prev,
            [selectedContact.id]: [...(prev[selectedContact.id] || []), aiResponse]
          }));
        }, 1000);
      }
    }
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-[#FAFAFA]">
      {/* Header - Show Back button when viewing conversation */}
      <header className="bg-white shadow-sm z-20">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (selectedContact) {
                  setSelectedContact(null);
                } else {
                  onNavigate('student-dashboard');
                }
              }}
              className="text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h2 className="text-base">
              {selectedContact ? selectedContact.name : 'Messages'}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {!selectedContact && (
              <>
                <button
                  onClick={() => onNavigate('student-profile')}
                  className="w-8 h-8 bg-[#81D9F7] rounded-full flex items-center justify-center text-white"
                >
                  <User className="h-4 w-4" />
                </button>
                <Button onClick={onLogout} variant="ghost" size="sm">
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            )}
            {selectedContact && !selectedContact.isAI && (
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
        {!selectedContact ? (
          /* Contacts List */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Search */}
            <div className="p-3 border-b bg-white">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search contacts..."
                  className="pl-9 rounded-lg h-10"
                />
              </div>
            </div>

            {/* Recent Contacts */}
            <div className="flex-1 overflow-y-auto pb-20">
              {filteredContacts.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => setSelectedContact(contact)}
                  className="w-full p-3 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b active:bg-gray-100"
                >
                  <div className="relative">
                    <div className={`w-12 h-12 ${contact.isAI ? 'bg-gradient-to-br from-purple-500 to-[#81D9F7]' : 'bg-[#81D9F7]'} rounded-full flex items-center justify-center text-white shrink-0`}>
                      {contact.isAI ? <Bot className="h-6 w-6" /> : <User className="h-6 w-6" />}
                    </div>
                    {contact.online && !contact.isAI && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                    )}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="truncate text-sm">{contact.name}</span>
                      <span className="text-xs text-gray-500 shrink-0 ml-2">{contact.timestamp}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-600 truncate">{contact.lastMessage}</p>
                      {contact.unread > 0 && (
                        <span className="ml-2 w-5 h-5 bg-[#81D9F7] text-white rounded-full flex items-center justify-center text-xs shrink-0">
                          {contact.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Chat View */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 pb-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-3 py-2 rounded-2xl ${
                      message.senderId === 'me'
                        ? 'bg-[#81D9F7] text-white rounded-br-sm'
                        : selectedContact.isAI
                        ? 'bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-bl-sm'
                        : 'bg-white rounded-bl-sm'
                    }`}
                  >
                    <p className="break-words whitespace-pre-wrap text-sm">{message.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.senderId === 'me' ? 'text-white/70' : 'text-gray-500'
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
                  <Image className="h-5 w-5 text-gray-600" />
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

      {/* Mobile Bottom Navigation - Only show when viewing contacts list */}
      {!selectedContact && (
        <nav className="bg-white border-t shadow-lg">
          <div className="flex items-center justify-around py-2">
            <button
              onClick={() => onNavigate('student-dashboard')}
              className="flex flex-col items-center gap-1 px-3 py-1"
            >
              <Home className="h-5 w-5 text-gray-600" />
              <span className="text-xs text-gray-600">Home</span>
            </button>
            <button
              onClick={() => onNavigate('room-search')}
              className="flex flex-col items-center gap-1 px-3 py-1"
            >
              <Search className="h-5 w-5 text-gray-600" />
              <span className="text-xs text-gray-600">Search</span>
            </button>
            <button
              onClick={() => onNavigate('roommate-finder')}
              className="flex flex-col items-center gap-1 px-3 py-1"
            >
              <Users className="h-5 w-5 text-gray-600" />
              <span className="text-xs text-gray-600">Find</span>
            </button>
            <button
              onClick={() => onNavigate('chat')}
              className="flex flex-col items-center gap-1 px-3 py-1"
            >
              <MessageCircle className="h-5 w-5 text-[#81D9F7]" />
              <span className="text-xs text-[#81D9F7]">Messages</span>
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}