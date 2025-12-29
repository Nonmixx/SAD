import { Home, Search, Users, MessageCircle, Map, User, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';

type User = {
  id: string;
  email: string;
  fullName: string;
  userType: 'student' | 'landlord';
  profilePicture?: string;
};

type StudentDashboardProps = {
  user: User;
  onNavigate: (page: any, params?: any) => void;
  onLogout: () => void;
};

export function StudentDashboard({ user, onNavigate, onLogout }: StudentDashboardProps) {
  const [savedRoomsCount, setSavedRoomsCount] = useState(0);
  const [matchesCount, setMatchesCount] = useState(0);

  useEffect(() => {
    // Load counts from localStorage
    const likedRooms = JSON.parse(localStorage.getItem('likedRooms') || '[]');
    const likedRoommates = JSON.parse(localStorage.getItem('likedRoommates') || '[]');
    setSavedRoomsCount(likedRooms.length);
    setMatchesCount(likedRoommates.length);
  }, []);

  const menuItems = [
    { icon: Search, label: 'Room Search', page: 'room-search', color: 'bg-blue-500', navLabel: 'Search' },
    { icon: Users, label: 'Find Roommate', page: 'roommate-finder', color: 'bg-purple-500', navLabel: 'Roommate' },
    { icon: MessageCircle, label: 'Messages', page: 'chat', color: 'bg-green-500', navLabel: 'Messages' },
    { icon: Map, label: 'Map View', page: 'map', color: 'bg-red-500', navLabel: 'Map' },
  ];

  const stats = [
    { label: 'Saved Rooms', value: savedRoomsCount.toString() },
    { label: 'Messages', value: '5' },
    { label: 'Matches', value: matchesCount.toString() },
  ];

  return (
    <div className="h-full flex flex-col bg-[#FAFAFA]">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="px-4 py-3 flex items-center justify-between">
          <h1 className="text-[#81D9F7] text-2xl font-bold">ROOMEO</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('student-profile')}
              className="flex items-center gap-2 hover:bg-gray-50 px-2 py-2 rounded-lg"
            >
              <div className="w-8 h-8 bg-[#81D9F7] rounded-full flex items-center justify-center text-white">
                {user.profilePicture ? (
                  <img src={user.profilePicture} alt="" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User className="h-4 w-4" />
                )}
              </div>
            </button>
            <Button
              onClick={onLogout}
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-800"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto px-4 py-4 pb-20">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-[#81D9F7] to-[#6BC5E0] rounded-2xl p-5 mb-5 text-white">
          <h2 className="text-lg mb-1">Welcome back, {user.fullName.split(' ')[0]}! 👋</h2>
          <p className="opacity-90 text-sm">Find your perfect room and roommate today</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <button
            onClick={() => onNavigate('saved-rooms')}
            className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md active:scale-95"
          >
            <p className="text-gray-600 text-xs mb-1">Saved Rooms</p>
            <p className="text-[#81D9F7] text-xl">{savedRoomsCount}</p>
          </button>
          <button
            onClick={() => onNavigate('matches')}
            className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md active:scale-95"
          >
            <p className="text-gray-600 text-xs mb-1">Matches</p>
            <p className="text-[#81D9F7] text-xl">{matchesCount}</p>
          </button>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="mb-3 text-base">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => onNavigate(item.page)}
                className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md group"
              >
                <div className={`${item.color} w-12 h-12 rounded-lg flex items-center justify-center mb-3`}>
                  <item.icon className="h-6 w-6 text-white" />
                </div>
                <p className="text-gray-800 text-sm">{item.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-5">
          <h3 className="mb-3 text-base">Recent Activity</h3>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-3 border-b flex items-center gap-3 active:bg-gray-50">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                <Search className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">You searched for rooms near UM</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="p-3 border-b flex items-center gap-3 active:bg-gray-50">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                <MessageCircle className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">New message from Alex Chen</p>
                <p className="text-xs text-gray-500">5 hours ago</p>
              </div>
            </div>
            <div className="p-3 flex items-center gap-3 active:bg-gray-50">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center shrink-0">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">3 new roommate matches found</p>
                <p className="text-xs text-gray-500">1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="bg-white border-t shadow-lg">
        <div className="flex items-center justify-around py-2">
          <button
            onClick={() => onNavigate('student-dashboard')}
            className="flex flex-col items-center gap-1 px-3 py-1"
          >
            <Home className="h-5 w-5 text-[#81D9F7]" />
            <span className="text-xs text-[#81D9F7]">Home</span>
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
            <MessageCircle className="h-5 w-5 text-gray-600" />
            <span className="text-xs text-gray-600">Messages</span>
          </button>
        </div>
      </nav>
    </div>
  );
}