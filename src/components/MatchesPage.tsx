import { useState, useEffect } from 'react';
import { ArrowLeft, Heart, User, MessageCircle, Home, Search, Users, X } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

type User = {
  id: string;
  fullName: string;
  profilePicture?: string;
};

type Roommate = {
  id: string;
  name: string;
  age: number;
  gender: string;
  faculty: string;
  course: string;
  year: number;
  bio: string;
  budget: { min: number; max: number };
  cleanliness: string;
  lifestyle: string[];
  smokingPreference: string;
  sleepSchedule: string;
  photos: string[];
  matchPercentage: number;
};

type MatchesPageProps = {
  user: User;
  onNavigate: (page: any, params?: any) => void;
};

const mockRoommates: Roommate[] = [
  {
    id: '1',
    name: 'Alex Chen',
    age: 21,
    gender: 'Male',
    faculty: 'Engineering',
    course: 'Mechanical Engineering',
    year: 2,
    bio: 'Looking for a clean and quiet roommate. I enjoy studying and occasional gaming.',
    budget: { min: 400, max: 600 },
    cleanliness: 'Very Neat',
    lifestyle: ['Quiet', 'Non-Smoker', 'Early Bird'],
    smokingPreference: 'Non-smoker',
    sleepSchedule: 'Early Bird',
    photos: ['https://images.unsplash.com/photo-1729697967428-5b98d11486a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwc3R1ZGVudCUyMHBvcnRyYWl0JTIwbWFsZXxlbnwxfHx8fDE3NjQ2MDQxOTJ8MA&ixlib=rb-4.1.0&q=80&w=1080'],
    matchPercentage: 95,
  },
  {
    id: '2',
    name: 'Sarah Lim',
    age: 20,
    gender: 'Female',
    faculty: 'Science',
    course: 'Data Science',
    year: 3,
    bio: 'Friendly and organized. Love cooking and trying new restaurants!',
    budget: { min: 500, max: 700 },
    cleanliness: 'Neat',
    lifestyle: ['Social', 'Foodie', 'Non-Smoker'],
    smokingPreference: 'Non-smoker',
    sleepSchedule: 'Moderate',
    photos: ['https://images.unsplash.com/photo-1709811240710-cff5f04deb44?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwc3R1ZGVudCUyMHBvcnRyYWl0JTIwZmVtYWxlfGVufDF8fHx8MTc2NDYwNDE5Mnww&ixlib=rb-4.1.0&q=80&w=1080'],
    matchPercentage: 88,
  },
  {
    id: '3',
    name: 'Mike Tan',
    age: 22,
    gender: 'Male',
    faculty: 'Business',
    course: 'Business Administration',
    year: 4,
    bio: 'Final year student. Respectful and easy-going. Hit the gym regularly.',
    budget: { min: 450, max: 650 },
    cleanliness: 'Average',
    lifestyle: ['Fitness Enthusiast', 'Social', 'Night Owl'],
    smokingPreference: 'Non-smoker',
    sleepSchedule: 'Night Owl',
    photos: ['https://images.unsplash.com/photo-1530878131793-cc5cbcba9a47?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwc3R1ZGVudCUyMGFzaWFufGVufDF8fHx8MTc2NDYwNDE5M3ww&ixlib=rb-4.1.0&q=80&w=1080'],
    matchPercentage: 82,
  },
  {
    id: '4',
    name: 'Emily Wong',
    age: 19,
    gender: 'Female',
    faculty: 'Arts',
    course: 'Psychology',
    year: 1,
    bio: 'First year student looking for a friendly roommate. Love music and art.',
    budget: { min: 300, max: 500 },
    cleanliness: 'Very Neat',
    lifestyle: ['Quiet', 'Non-Smoker', 'Early Bird'],
    smokingPreference: 'Non-smoker',
    sleepSchedule: 'Early Bird',
    photos: ['https://images.unsplash.com/photo-1718179804654-7c3720b78e67?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NDU2MDQ2OHww&ixlib=rb-4.1.0&q=80&w=1080'],
    matchPercentage: 90,
  },
];

export function MatchesPage({ user, onNavigate }: MatchesPageProps) {
  const [likedRoommates, setLikedRoommates] = useState<string[]>([]);
  const [selectedRoommate, setSelectedRoommate] = useState<Roommate | null>(null);

  // Load liked roommates from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('likedRoommates');
    if (saved) {
      setLikedRoommates(JSON.parse(saved));
    }
  }, []);

  const toggleLike = (roommateId: string) => {
    const newLikedRoommates = likedRoommates.includes(roommateId)
      ? likedRoommates.filter(id => id !== roommateId)
      : [...likedRoommates, roommateId];
    
    setLikedRoommates(newLikedRoommates);
    localStorage.setItem('likedRoommates', JSON.stringify(newLikedRoommates));
  };

  // Filter to show only liked roommates
  const likedMatches = mockRoommates.filter(roommate => likedRoommates.includes(roommate.id));

  return (
    <div className="flex flex-col h-full bg-[#FAFAFA]">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center gap-3 shadow-sm">
        <button
          onClick={() => onNavigate('student-dashboard')}
          className="p-2 hover:bg-gray-100 rounded-lg -ml-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="flex-1">Matches</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {likedMatches.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No matches yet</p>
            <p className="text-sm text-gray-400 mt-2">
              Start liking roommates to see your matches
            </p>
          </div>
        ) : (
          <div className="space-y-3 pb-20">
            {likedMatches.map((roommate) => (
              <div
                key={roommate.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
                onClick={() => setSelectedRoommate(roommate)}
              >
                <div className="p-4">
                  {/* Header */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="relative shrink-0">
                      {roommate.photos.length > 0 ? (
                        <ImageWithFallback
                          src={roommate.photos[0]}
                          alt={roommate.name}
                          className="w-14 h-14 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-14 h-14 bg-[#81D9F7] rounded-full flex items-center justify-center text-white">
                          <User className="h-7 w-7" />
                        </div>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike(roommate.id);
                        }}
                        className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md"
                      >
                        <Heart
                          className={`h-3 w-3 ${
                            likedRoommates.includes(roommate.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'
                          }`}
                        />
                      </button>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base truncate">{roommate.name}</h3>
                          <p className="text-xs text-gray-600">
                            {roommate.age} • {roommate.gender} • Year {roommate.year}
                          </p>
                        </div>
                        <div className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs shrink-0 ml-2">
                          {roommate.matchPercentage}%
                        </div>
                      </div>
                      <p className="text-xs text-gray-600">{roommate.faculty}</p>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-sm text-gray-700 mb-3 line-clamp-2">{roommate.bio}</p>

                  {/* Budget and Lifestyle */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                      RM{roommate.budget.min}-{roommate.budget.max}
                    </span>
                    <span className="px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs capitalize">
                      {roommate.cleanliness}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {roommate.lifestyle.slice(0, 3).map((trait, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
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
            <Users className="h-5 w-5 text-[#81D9F7]" />
            <span className="text-xs text-[#81D9F7]">Find</span>
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

      {/* Roommate Details Modal */}
      {selectedRoommate && (
        <div className="absolute inset-0 bg-white z-50 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-center px-4 py-3 border-b shrink-0 relative">
            <h2 className="text-base">Profile Details</h2>
            <button
              onClick={() => setSelectedRoommate(null)}
              className="text-gray-500 hover:text-gray-700 absolute right-4"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {/* Profile Header */}
            <div className="flex items-start gap-3">
              {selectedRoommate.photos.length > 0 ? (
                <ImageWithFallback
                  src={selectedRoommate.photos[0]}
                  alt={selectedRoommate.name}
                  className="w-16 h-16 rounded-full object-cover shrink-0"
                />
              ) : (
                <div className="w-16 h-16 bg-[#81D9F7] rounded-full flex items-center justify-center text-white shrink-0">
                  <User className="h-8 w-8" />
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-base mb-1">{selectedRoommate.name}</h3>
                <p className="text-sm text-gray-600">
                  {selectedRoommate.age} years old • {selectedRoommate.gender}
                </p>
                <p className="text-sm text-gray-600">
                  {selectedRoommate.course} • Year {selectedRoommate.year}
                </p>
                <div className="mt-1 inline-block bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                  {selectedRoommate.matchPercentage}% match
                </div>
              </div>
            </div>

            {/* About Me */}
            <div>
              <h4 className="text-sm mb-1">About Me</h4>
              <p className="text-sm text-gray-600">{selectedRoommate.bio}</p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Budget</p>
                <p className="text-sm">RM {selectedRoommate.budget.min}-{selectedRoommate.budget.max}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Cleanliness</p>
                <p className="text-sm">{selectedRoommate.cleanliness}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Smoking</p>
                <p className="text-sm">{selectedRoommate.smokingPreference}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Sleep Schedule</p>
                <p className="text-sm">{selectedRoommate.sleepSchedule}</p>
              </div>
            </div>

            {/* Lifestyle */}
            <div>
              <h4 className="text-sm mb-1">Lifestyle</h4>
              <div className="flex flex-wrap gap-2">
                {selectedRoommate.lifestyle.map((trait, i) => (
                  <span key={i} className="px-2 py-1 bg-[#81D9F7]/10 text-[#81D9F7] rounded-full text-xs">
                    {trait}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t shrink-0">
            <button
              onClick={() => {
                setSelectedRoommate(null);
                onNavigate('chat');
              }}
              className="w-full bg-[#81D9F7] hover:bg-[#6BC5E0] rounded-lg h-11 flex items-center justify-center gap-2 text-white"
            >
              <MessageCircle className="h-4 w-4" />
              Send Message
            </button>
          </div>
        </div>
      )}
    </div>
  );
}