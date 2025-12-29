import { useState, useRef, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { RoleSelectionPage } from './components/RoleSelectionPage';
import { ForgotPasswordPage } from './components/ForgotPasswordPage';
import { StudentDashboard } from './components/StudentDashboard';
import { LandlordDashboard } from './components/LandlordDashboard';
import { RoomSearchPage } from './components/RoomSearchPage';
import { RoommateFinder } from './components/RoommateFinder';
import { ChatPage } from './components/ChatPage';
import { MapView } from './components/MapView';
import { SavedRoomsPage } from './components/SavedRoomsPage';
import { MatchesPage } from './components/MatchesPage';
import { StudentProfile } from './components/StudentProfile';
import { LandlordProfile } from './components/LandlordProfile';
import { LandlordChatPage } from './components/LandlordChatPage';
import { AddListingModal } from './components/AddListingModal';
import { InquiriesModal } from './components/InquiriesModal';

type User = {
  id: string;
  email: string;
  fullName: string;
  userType: 'student' | 'landlord';
  phone: string;
  dateOfBirth: string;
  faculty?: string;
  course?: string;
  yearOfStudy?: number;
  profilePicture?: string;
  budget?: { min: number; max: number };
  cleanliness?: string;
  lifestyle?: string[];
};

type Listing = {
  id: string;
  title: string;
  price: number;
  location: string;
  distance: number;
  roomType: string;
  facilities: string[];
  photos: string[];
  description: string;
  inquiries?: number;
  views?: number;
};

type Inquiry = {
  id: string;
  studentName: string;
  listingId: string;
  listingTitle: string;
  message: string;
  timestamp: string;
  read: boolean;
};

type Page = 'login' | 'register' | 'role-selection' | 'forgot-password' | 'student-dashboard' | 'landlord-dashboard' | 
  'room-search' | 'roommate-finder' | 'chat' | 'map' | 'student-profile' | 'landlord-profile' | 'landlord-chat' | 'saved-rooms' | 'matches';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<'student' | 'landlord' | null>(null);
  
  // Refs to trigger modals in LandlordDashboard
  const landlordDashboardRef = useRef<{ openAddModal: () => void; openInquiries: () => void } | null>(null);
  
  // State for passing data between pages
  const [chatParams, setChatParams] = useState<{ studentName?: string; contactName?: string } | undefined>(undefined);
  const [roomSearchParams, setRoomSearchParams] = useState<{ showSavedOnly?: boolean }>({});
  const [roommateFinderParams, setRoommateFinderParams] = useState<{ showLikedOnly?: boolean }>({});
  
  // State for pending modal actions
  const [pendingAction, setPendingAction] = useState<'add-modal' | 'inquiries' | null>(null);
  
  // State to track navigation source for skipping animations
  const [skipChatAnimation, setSkipChatAnimation] = useState(false);
  
  // Landlord listings state - persisted across navigation
  const [listings, setListings] = useState<Listing[]>([
    {
      id: '1',
      title: 'Cozy Studio Near UM',
      price: 450,
      location: 'Pantai Dalam',
      distance: 1.2,
      roomType: 'Studio',
      facilities: ['Wi-Fi', 'Aircon', 'Furniture'],
      photos: ['https://images.unsplash.com/photo-1633505765486-e404bbbec654?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzdHVkaW8lMjBhcGFydG1lbnR8ZW58MXx8fHwxNzY0NjU1NTU2fDA&ixlib=rb-4.1.0&q=80&w=1080'],
      description: 'A comfortable studio apartment perfect for students',
      inquiries: 5,
      views: 87,
    },
    {
      id: '2',
      title: 'Spacious Master Room',
      price: 600,
      location: 'Bangsar South',
      distance: 2.5,
      roomType: 'Master',
      facilities: ['Wi-Fi', 'Aircon', 'Furniture', 'Parking'],
      photos: ['https://images.unsplash.com/photo-1638284556849-1848ec7beb4a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBtYXN0ZXIlMjBiZWRyb29tfGVufDF8fHx8MTc2NDc0NjY3MHww&ixlib=rb-4.1.0&q=80&w=1080'],
      description: 'Large master room with attached bathroom',
      inquiries: 3,
      views: 147,
    },
    {
      id: '3',
      title: 'Modern Shared Living',
      price: 350,
      location: 'Kerinchi',
      distance: 1.8,
      roomType: 'Shared',
      facilities: ['Wi-Fi', 'Aircon', 'Study Desk'],
      photos: ['https://images.unsplash.com/photo-1761818645928-47e5dad8ec76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzaGFyZWQlMjByb29tfGVufDF8fHx8MTc2NDc0NjY3MXww&ixlib=rb-4.1.0&q=80&w=1080'],
      description: 'Shared room with modern amenities for budget-conscious students',
      inquiries: 2,
      views: 56,
    },
  ]);
  
  // Add Listing Modal state - managed at App level
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  
  // Inquiries Modal state - managed at App level
  const [showInquiries, setShowInquiries] = useState(false);
  const [inquiries, setInquiries] = useState<Inquiry[]>([
    {
      id: '1',
      studentName: 'Alex Chen',
      listingId: '1',
      listingTitle: 'Cozy Studio Near UM',
      message: 'Hi! I\'m interested in this studio. Is it still available? Can I schedule a viewing this weekend?',
      timestamp: '2 hours ago',
      read: false,
    },
    {
      id: '2',
      studentName: 'Sarah Lim',
      listingId: '2',
      listingTitle: 'Spacious Master Room',
      message: 'Hello! Does the master room include utilities? What\'s the deposit requirement?',
      timestamp: '5 hours ago',
      read: false,
    },
    {
      id: '3',
      studentName: 'Mike Tan',
      listingId: '1',
      listingTitle: 'Cozy Studio Near UM',
      message: 'Is parking included? I have a motorcycle.',
      timestamp: 'Yesterday',
      read: true,
    },
    {
      id: '4',
      studentName: 'Emily Wong',
      listingId: '3',
      listingTitle: 'Modern Shared Living',
      message: 'Can I know more about the roommate? Are they also students?',
      timestamp: '2 days ago',
      read: true,
    },
  ]);

  // Load saved session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        setCurrentPage(user.userType === 'landlord' ? 'landlord-dashboard' : 'student-dashboard');
      } catch (e) {
        console.error('Failed to load user session');
      }
    }
  }, []);

  const handleLogin = (email: string, password: string) => {
    // Get registered users from localStorage
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    
    // Find user by email and password
    const foundUser = registeredUsers.find(
      (u: any) => u.email === email && u.password === password
    );

    if (foundUser) {
      // Create user object without password
      const { password: _, ...userWithoutPassword } = foundUser;
      const user: User = userWithoutPassword as User;
      
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      if (user.userType === 'landlord') {
        setCurrentPage('landlord-dashboard');
      } else {
        setCurrentPage('student-dashboard');
      }
    } else {
      // Fallback to demo accounts
      if (email.includes('landlord')) {
        const user: User = {
          id: '1',
          email,
          fullName: 'John Landlord',
          userType: 'landlord',
          phone: '0123456789',
          dateOfBirth: '1980-01-01',
        };
        setCurrentUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        setCurrentPage('landlord-dashboard');
      } else {
        const user: User = {
          id: '2',
          email,
          fullName: 'Sarah Student',
          userType: 'student',
          phone: '0123456789',
          dateOfBirth: '2002-05-15',
          faculty: 'Engineering',
          course: 'Computer Science',
          yearOfStudy: 2,
          budget: { min: 300, max: 600 },
          cleanliness: 'neat',
          lifestyle: ['quiet', 'non-smoker'],
        };
        setCurrentUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        setCurrentPage('student-dashboard');
      }
    }
  };

  const handleRegister = (userData: any) => {
    // Save user to localStorage
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    
    // Create new user with unique ID
    const newUser = {
      ...userData,
      id: Date.now().toString(),
    };
    
    // Add to registered users
    registeredUsers.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    
    // Navigate to login
    setCurrentPage('login');
    setSelectedRole(null);
  };

  const handleRoleSelection = (role: 'student' | 'landlord') => {
    setSelectedRole(role);
    setCurrentPage('register');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('login');
    localStorage.removeItem('currentUser');
  };

  const navigateTo = (page: Page, params?: any) => {
    // Track when navigating from landlord dashboard to chat
    if (page === 'landlord-chat' && currentPage === 'landlord-dashboard') {
      setSkipChatAnimation(true);
    } else {
      setSkipChatAnimation(false);
    }
    
    // Reset modals when navigating away
    if (page !== currentPage) {
      setShowInquiries(false);
      setShowAddModal(false);
    }
    
    setCurrentPage(page);
    
    // Handle different page-specific params
    if ((page === 'landlord-chat' || page === 'chat') && params) {
      setChatParams(params);
    } else {
      setChatParams(undefined);
    }
    
    if (page === 'room-search' && params) {
      setRoomSearchParams(params);
    } else if (page === 'room-search') {
      setRoomSearchParams({});
    }
    
    if (page === 'roommate-finder' && params) {
      setRoommateFinderParams(params);
    } else if (page === 'roommate-finder') {
      setRoommateFinderParams({});
    }
  };

  // Handle pending actions when landlord dashboard is ready
  useEffect(() => {
    if (currentPage === 'landlord-dashboard' && pendingAction) {
      // Immediate execution to prevent showing dashboard content
      if (pendingAction === 'add-modal') {
        landlordDashboardRef.current?.openAddModal();
      } else if (pendingAction === 'inquiries') {
        landlordDashboardRef.current?.openInquiries();
      }
      setPendingAction(null);
    }
  }, [currentPage, pendingAction]);

  // Handlers for Add Listing Modal
  const handleAddListing = (listing: any) => {
    const newListing: Listing = {
      ...listing,
      id: Date.now().toString(),
    };
    setListings([...listings, newListing]);
    setShowAddModal(false);
    setEditingListing(null);
  };

  const handleEditListing = (listing: any) => {
    setListings(listings.map(l => l.id === listing.id ? listing : l));
    setShowAddModal(false);
    setEditingListing(null);
  };

  const handleDeleteListing = (id: string) => {
    if (confirm('Are you sure you want to delete this listing?')) {
      setListings(listings.filter(l => l.id !== id));
    }
  };

  // Handler for replying to inquiry
  const handleReplyToInquiry = (inquiry: Inquiry) => {
    // Mark as read
    setInquiries(inquiries.map(inq => 
      inq.id === inquiry.id ? { ...inq, read: true } : inq
    ));
    
    // Close inquiries modal and navigate to chat with student info
    setShowInquiries(false);
    navigateTo('landlord-chat', { studentName: inquiry.studentName });
  };

  return (
    <div className="min-h-screen bg-[#E5E5E5] flex items-center justify-center p-4">
      {/* Fixed mobile container - Full viewport height */}
      <div className="w-[390px] h-[100vh] max-h-[844px] bg-[#FAFAFA] overflow-hidden relative shadow-2xl rounded-lg flex flex-col transition-all duration-300">
        {currentPage === 'login' && (
          <div className="animate-fade-in">
            <LoginPage 
              onLogin={handleLogin}
              onNavigateToRegister={() => setCurrentPage('role-selection')}
              onNavigateToForgotPassword={() => setCurrentPage('forgot-password')}
            />
          </div>
        )}
        {currentPage === 'role-selection' && (
          <div className="animate-fade-in">
            <RoleSelectionPage 
              onSelectRole={handleRoleSelection}
              onBack={() => setCurrentPage('login')}
            />
          </div>
        )}
        {currentPage === 'register' && (
          <div className="animate-fade-in">
            <RegisterPage 
              onRegister={handleRegister}
              onNavigateToLogin={() => {
                setCurrentPage('login');
                setSelectedRole(null);
              }}
              userType={selectedRole || 'student'}
            />
          </div>
        )}
        {currentPage === 'forgot-password' && (
          <div className="animate-fade-in">
            <ForgotPasswordPage 
              onNavigateToLogin={() => setCurrentPage('login')}
            />
          </div>
        )}
        {currentPage === 'student-dashboard' && currentUser && (
          <div className="h-full">
            <StudentDashboard 
              user={currentUser}
              onNavigate={navigateTo}
              onLogout={handleLogout}
            />
          </div>
        )}
        {currentPage === 'landlord-dashboard' && currentUser && (
          <div className={`h-full ${pendingAction ? '' : 'animate-fade-in'}`}>
            <LandlordDashboard 
              user={currentUser}
              onNavigate={navigateTo}
              onLogout={handleLogout}
              ref={landlordDashboardRef}
              skipAnimation={!!pendingAction}
              listings={listings}
              setListings={setListings}
              showAddModal={showAddModal}
              setShowAddModal={setShowAddModal}
              editingListing={editingListing}
              setEditingListing={setEditingListing}
              onAddListing={handleAddListing}
              onEditListing={handleEditListing}
              onDeleteListing={handleDeleteListing}
              showInquiries={showInquiries}
              setShowInquiries={setShowInquiries}
              inquiries={inquiries}
            />
          </div>
        )}
        {currentPage === 'room-search' && currentUser && (
          <div className="animate-fade-in">
            <RoomSearchPage 
              user={currentUser}
              onNavigate={navigateTo}
              onLogout={handleLogout}
              showSavedOnly={roomSearchParams.showSavedOnly}
            />
          </div>
        )}
        {currentPage === 'roommate-finder' && currentUser && (
          <div className="animate-fade-in">
            <RoommateFinder 
              user={currentUser}
              onNavigate={navigateTo}
              onLogout={handleLogout}
              showLikedOnly={roommateFinderParams.showLikedOnly}
            />
          </div>
        )}
        {currentPage === 'chat' && currentUser && (
          <div className="animate-fade-in">
            <ChatPage 
              user={currentUser}
              onNavigate={navigateTo}
              onLogout={handleLogout}
              chatParams={chatParams}
              skipAnimation={skipChatAnimation}
            />
          </div>
        )}
        {currentPage === 'map' && currentUser && (
          <div className="animate-fade-in">
            <MapView 
              user={currentUser}
              onNavigate={navigateTo}
              onLogout={handleLogout}
            />
          </div>
        )}
        {currentPage === 'student-profile' && currentUser && (
          <div className="animate-fade-in">
            <StudentProfile 
              user={currentUser}
              onNavigate={navigateTo}
              onLogout={handleLogout}
              onUpdateUser={setCurrentUser}
            />
          </div>
        )}
        {currentPage === 'landlord-profile' && currentUser && (
          <div className="animate-fade-in">
            <LandlordProfile 
              user={currentUser}
              onNavigate={navigateTo}
              onLogout={handleLogout}
              onUpdateUser={setCurrentUser}
            />
          </div>
        )}
        {currentPage === 'landlord-chat' && currentUser && (
          <div className={`h-full ${skipChatAnimation ? '' : 'animate-fade-in'}`}>
            <LandlordChatPage 
              user={currentUser}
              onNavigate={navigateTo}
              onLogout={handleLogout}
              chatParams={chatParams}
              onShowAddModal={() => {
                setEditingListing(null);
                setShowAddModal(true);
              }}
              onShowInquiries={() => setShowInquiries(true)}
            />
          </div>
        )}
        {currentPage === 'saved-rooms' && currentUser && (
          <div className="animate-fade-in">
            <SavedRoomsPage 
              user={currentUser}
              onNavigate={navigateTo}
            />
          </div>
        )}
        {currentPage === 'matches' && currentUser && (
          <div className="animate-fade-in">
            <MatchesPage 
              user={currentUser}
              onNavigate={navigateTo}
            />
          </div>
        )}
        
        {/* Global Add Listing Modal - Renders over any page when landlord is logged in */}
        {currentUser?.userType === 'landlord' && showAddModal && (
          <AddListingModal
            listing={editingListing}
            onClose={() => {
              setShowAddModal(false);
              setEditingListing(null);
            }}
            onSave={editingListing ? handleEditListing : handleAddListing}
            skipAnimation={true}
          />
        )}
        
        {/* Global Inquiries Modal - Renders over any page when landlord is logged in */}
        {currentUser?.userType === 'landlord' && showInquiries && (
          <InquiriesModal
            inquiries={inquiries}
            onClose={() => setShowInquiries(false)}
            onReplyToInquiry={handleReplyToInquiry}
            onNavigateHome={() => {
              setShowInquiries(false);
              navigateTo('landlord-dashboard');
            }}
            onShowAddModal={() => {
              setShowInquiries(false);
              setEditingListing(null);
              setShowAddModal(true);
            }}
            onNavigateMessages={() => {
              setShowInquiries(false);
              navigateTo('landlord-chat');
            }}
          />
        )}
      </div>
    </div>
  );
}