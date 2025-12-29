import { useState, useEffect } from 'react';
import { ArrowLeft, User, LogOut, MessageCircle, UserPlus, SlidersHorizontal, X, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Home, Search, Users } from 'lucide-react';

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

type RoommateFinderProps = {
  user: User;
  onNavigate: (page: any, params?: any) => void;
  onLogout: () => void;
  showLikedOnly?: boolean;
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

export function RoommateFinder({ user, onNavigate, onLogout, showLikedOnly }: RoommateFinderProps) {
  const [roommates] = useState<Roommate[]>(mockRoommates);
  const [selectedRoommate, setSelectedRoommate] = useState<Roommate | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'match' | 'age' | 'budget'>('match');
  const [likedRoommates, setLikedRoommates] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    gender: 'any',
    faculty: 'any',
    year: 'any',
    cleanliness: 'any',
    smokingPreference: 'any',
    sleepSchedule: 'any',
    budgetRange: [0, 2000] as [number, number],
    lifestyle: [] as string[],
  });

  const lifestyleOptions = ['Quiet', 'Social', 'Non-Smoker', 'Early Bird', 'Night Owl', 'Fitness Enthusiast', 'Foodie'];

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

  const toggleLifestyle = (option: string) => {
    const updated = filters.lifestyle.includes(option)
      ? filters.lifestyle.filter(l => l !== option)
      : [...filters.lifestyle, option];
    setFilters(prev => ({ ...prev, lifestyle: updated }));
  };

  // Filter and sort roommates
  const filteredRoommates = roommates
    .filter((roommate) => {
      // Liked roommates filter (if showLikedOnly is true)
      if (showLikedOnly && !likedRoommates.includes(roommate.id)) {
        return false;
      }

      // Gender filter
      if (filters.gender !== 'any' && roommate.gender.toLowerCase() !== filters.gender.toLowerCase()) {
        return false;
      }

      // Faculty filter
      if (filters.faculty !== 'any' && roommate.faculty.toLowerCase() !== filters.faculty.toLowerCase()) {
        return false;
      }

      // Year filter
      if (filters.year !== 'any' && roommate.year.toString() !== filters.year) {
        return false;
      }

      // Cleanliness filter
      if (filters.cleanliness !== 'any') {
        const cleanlinessMap: { [key: string]: string } = {
          'very-neat': 'Very Neat',
          'neat': 'Neat',
          'average': 'Average'
        };
        if (roommate.cleanliness !== cleanlinessMap[filters.cleanliness]) {
          return false;
        }
      }

      // Smoking preference filter
      if (filters.smokingPreference !== 'any' && 
          roommate.smokingPreference.toLowerCase() !== filters.smokingPreference.toLowerCase()) {
        return false;
      }

      // Sleep schedule filter
      if (filters.sleepSchedule !== 'any' && 
          roommate.sleepSchedule.toLowerCase().replace(' ', '-') !== filters.sleepSchedule.toLowerCase()) {
        return false;
      }

      // Budget filter - check if budgets overlap
      const budgetOverlaps = !(
        roommate.budget.max < filters.budgetRange[0] || 
        roommate.budget.min > filters.budgetRange[1]
      );
      if (!budgetOverlaps) {
        return false;
      }

      // Lifestyle filter - roommate must have ALL selected lifestyle traits
      if (filters.lifestyle.length > 0) {
        const hasAllLifestyles = filters.lifestyle.every(lifestyle => 
          roommate.lifestyle.includes(lifestyle)
        );
        if (!hasAllLifestyles) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'match') {
        return b.matchPercentage - a.matchPercentage;
      } else if (sortBy === 'age') {
        return a.age - b.age;
      } else if (sortBy === 'budget') {
        return a.budget.min - b.budget.min;
      }
      return 0;
    });

  // Count active filters
  const activeFilterCount = 
    (filters.gender !== 'any' ? 1 : 0) +
    (filters.faculty !== 'any' ? 1 : 0) +
    (filters.year !== 'any' ? 1 : 0) +
    (filters.cleanliness !== 'any' ? 1 : 0) +
    (filters.smokingPreference !== 'any' ? 1 : 0) +
    (filters.sleepSchedule !== 'any' ? 1 : 0) +
    (filters.budgetRange[0] !== 0 || filters.budgetRange[1] !== 2000 ? 1 : 0) +
    filters.lifestyle.length;

  // Clear a specific filter
  const clearFilter = (filterType: string) => {
    if (filterType === 'gender') setFilters(prev => ({ ...prev, gender: 'any' }));
    else if (filterType === 'faculty') setFilters(prev => ({ ...prev, faculty: 'any' }));
    else if (filterType === 'year') setFilters(prev => ({ ...prev, year: 'any' }));
    else if (filterType === 'cleanliness') setFilters(prev => ({ ...prev, cleanliness: 'any' }));
    else if (filterType === 'smokingPreference') setFilters(prev => ({ ...prev, smokingPreference: 'any' }));
    else if (filterType === 'sleepSchedule') setFilters(prev => ({ ...prev, sleepSchedule: 'any' }));
    else if (filterType === 'budget') setFilters(prev => ({ ...prev, budgetRange: [0, 2000] }));
    else if (filterType.startsWith('lifestyle-')) {
      const lifestyle = filterType.replace('lifestyle-', '');
      setFilters(prev => ({ ...prev, lifestyle: prev.lifestyle.filter(l => l !== lifestyle) }));
    }
  };

  // Reset all filters
  const resetAllFilters = () => {
    setFilters({
      gender: 'any',
      faculty: 'any',
      year: 'any',
      cleanliness: 'any',
      smokingPreference: 'any',
      sleepSchedule: 'any',
      budgetRange: [0, 2000],
      lifestyle: [],
    });
  };

  return (
    <div className="h-full flex flex-col bg-[#FAFAFA]">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('student-dashboard')}
                className="text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h2 className="text-base">Find Roommate</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(true)}
                className="p-2 hover:bg-gray-50 rounded-lg relative"
              >
                <SlidersHorizontal className="h-5 w-5 text-gray-600" />
                {activeFilterCount > 0 && (
                  <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded-full">
                    {activeFilterCount}
                  </div>
                )}
              </button>
              <button
                onClick={() => onNavigate('student-profile')}
                className="w-8 h-8 bg-[#81D9F7] rounded-full flex items-center justify-center text-white"
              >
                <User className="h-4 w-4" />
              </button>
              <Button onClick={onLogout} variant="ghost" size="sm">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto px-4 py-4 pb-20">
        {/* Active Filters */}
        {activeFilterCount > 0 && (
          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-600">Active Filters:</p>
              <button 
                onClick={resetAllFilters}
                className="text-xs text-[#81D9F7] hover:underline"
              >
                Clear All
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.gender !== 'any' && (
                <span className="px-2 py-1 bg-[#81D9F7]/10 text-[#81D9F7] text-xs rounded-full flex items-center gap-1">
                  Gender: {filters.gender}
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-red-500" 
                    onClick={() => clearFilter('gender')}
                  />
                </span>
              )}
              {filters.faculty !== 'any' && (
                <span className="px-2 py-1 bg-[#81D9F7]/10 text-[#81D9F7] text-xs rounded-full flex items-center gap-1">
                  {filters.faculty.charAt(0).toUpperCase() + filters.faculty.slice(1)}
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-red-500" 
                    onClick={() => clearFilter('faculty')}
                  />
                </span>
              )}
              {filters.year !== 'any' && (
                <span className="px-2 py-1 bg-[#81D9F7]/10 text-[#81D9F7] text-xs rounded-full flex items-center gap-1">
                  Year {filters.year}
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-red-500" 
                    onClick={() => clearFilter('year')}
                  />
                </span>
              )}
              {filters.cleanliness !== 'any' && (
                <span className="px-2 py-1 bg-[#81D9F7]/10 text-[#81D9F7] text-xs rounded-full flex items-center gap-1">
                  {filters.cleanliness === 'very-neat' ? 'Very Neat' : filters.cleanliness.charAt(0).toUpperCase() + filters.cleanliness.slice(1)}
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-red-500" 
                    onClick={() => clearFilter('cleanliness')}
                  />
                </span>
              )}
              {filters.smokingPreference !== 'any' && (
                <span className="px-2 py-1 bg-[#81D9F7]/10 text-[#81D9F7] text-xs rounded-full flex items-center gap-1">
                  {filters.smokingPreference.charAt(0).toUpperCase() + filters.smokingPreference.slice(1)}
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-red-500" 
                    onClick={() => clearFilter('smokingPreference')}
                  />
                </span>
              )}
              {filters.sleepSchedule !== 'any' && (
                <span className="px-2 py-1 bg-[#81D9F7]/10 text-[#81D9F7] text-xs rounded-full flex items-center gap-1">
                  {filters.sleepSchedule === 'early-bird' ? 'Early Bird' : filters.sleepSchedule === 'night-owl' ? 'Night Owl' : 'Moderate'}
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-red-500" 
                    onClick={() => clearFilter('sleepSchedule')}
                  />
                </span>
              )}
              {(filters.budgetRange[0] !== 0 || filters.budgetRange[1] !== 2000) && (
                <span className="px-2 py-1 bg-[#81D9F7]/10 text-[#81D9F7] text-xs rounded-full flex items-center gap-1">
                  RM {filters.budgetRange[0]}-{filters.budgetRange[1]}
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-red-500" 
                    onClick={() => clearFilter('budget')}
                  />
                </span>
              )}
              {filters.lifestyle.map((lifestyle) => (
                <span key={lifestyle} className="px-2 py-1 bg-[#81D9F7]/10 text-[#81D9F7] text-xs rounded-full flex items-center gap-1">
                  {lifestyle}
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-red-500" 
                    onClick={() => clearFilter(`lifestyle-${lifestyle}`)}
                  />
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Sort and Results Count */}
        <div className="mb-3 flex items-center justify-between">
          <p className="text-gray-600 text-sm">{filteredRoommates.length} potential roommates found</p>
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-32 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="match">Best Match</SelectItem>
              <SelectItem value="age">Age</SelectItem>
              <SelectItem value="budget">Budget</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          {filteredRoommates.map((roommate) => (
            <div
              key={roommate.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
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
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{roommate.bio}</p>

                {/* Quick Info */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    RM {roommate.budget.min}-{roommate.budget.max}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    {roommate.cleanliness}
                  </span>
                  {roommate.lifestyle.slice(0, 2).map((trait, i) => (
                    <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {trait}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => setSelectedRoommate(roommate)}
                    variant="outline"
                    className="flex-1 rounded-lg text-sm h-9"
                  >
                    View Profile
                  </Button>
                  <Button
                    onClick={() => onNavigate('chat', { contactName: roommate.name })}
                    className="flex-1 bg-[#81D9F7] hover:bg-[#6BC5E0] rounded-lg text-sm h-9"
                  >
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Message
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
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

      {/* Detailed Profile Modal */}
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
            <Button
              onClick={() => {
                setSelectedRoommate(null);
                onNavigate('chat');
              }}
              className="w-full bg-[#81D9F7] hover:bg-[#6BC5E0] rounded-lg h-11"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </div>
        </div>
      )}

      {/* Mobile Filter Modal */}
      {showFilters && (
        <div className="absolute inset-0 bg-white z-50 flex flex-col">
          <div className="flex-shrink-0 bg-white p-4 border-b flex items-center gap-3">
            <button onClick={() => setShowFilters(false)} className="text-gray-600 hover:text-gray-800">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h3 className="flex-1">Filters</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Personal Details */}
            <div>
              <h4 className="text-sm mb-3">Personal Details</h4>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs">Gender</Label>
                  <Select value={filters.gender} onValueChange={(value) => setFilters(prev => ({ ...prev, gender: value }))}>
                    <SelectTrigger className="rounded-lg h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs">Faculty</Label>
                  <Select value={filters.faculty} onValueChange={(value) => setFilters(prev => ({ ...prev, faculty: value }))}>
                    <SelectTrigger className="rounded-lg h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="science">Science</SelectItem>
                      <SelectItem value="arts">Arts</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs">Year of Study</Label>
                  <Select value={filters.year} onValueChange={(value) => setFilters(prev => ({ ...prev, year: value }))}>
                    <SelectTrigger className="rounded-lg h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="1">Year 1</SelectItem>
                      <SelectItem value="2">Year 2</SelectItem>
                      <SelectItem value="3">Year 3</SelectItem>
                      <SelectItem value="4">Year 4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs">Cleanliness</Label>
                  <Select value={filters.cleanliness} onValueChange={(value) => setFilters(prev => ({ ...prev, cleanliness: value }))}>
                    <SelectTrigger className="rounded-lg h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="very-neat">Very Neat</SelectItem>
                      <SelectItem value="neat">Neat</SelectItem>
                      <SelectItem value="average">Average</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs">Smoking Preference</Label>
                  <Select value={filters.smokingPreference} onValueChange={(value) => setFilters(prev => ({ ...prev, smokingPreference: value }))}>
                    <SelectTrigger className="rounded-lg h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="non-smoker">Non-smoker</SelectItem>
                      <SelectItem value="smoker">Smoker</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs">Sleep Schedule</Label>
                  <Select value={filters.sleepSchedule} onValueChange={(value) => setFilters(prev => ({ ...prev, sleepSchedule: value }))}>
                    <SelectTrigger className="rounded-lg h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="early-bird">Early Bird</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="night-owl">Night Owl</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Room Related */}
            <div>
              <h4 className="text-sm mb-3">Room Related</h4>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs">Budget Range (RM/month)</Label>
                  <Slider
                    value={filters.budgetRange}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, budgetRange: value }))}
                    min={0}
                    max={2000}
                    step={50}
                    className="w-full mt-2"
                  />
                  <div className="flex justify-between text-xs text-gray-600 mt-1">
                    <span>RM {filters.budgetRange[0]}</span>
                    <span>RM {filters.budgetRange[1]}</span>
                  </div>
                </div>

                <div>
                  <Label className="text-xs mb-2 block">Lifestyle</Label>
                  <div className="space-y-2">
                    {lifestyleOptions.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={`roommate-filter-${option}`}
                          checked={filters.lifestyle.includes(option)}
                          onCheckedChange={() => toggleLifestyle(option)}
                        />
                        <label htmlFor={`roommate-filter-${option}`} className="text-xs cursor-pointer">
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 bg-white p-4 border-t space-y-2">
            <Button
              onClick={() => setShowFilters(false)}
              className="w-full bg-[#81D9F7] hover:bg-[#6BC5E0] rounded-lg h-11"
            >
              Apply Filters
            </Button>
            <Button
              onClick={resetAllFilters}
              variant="outline"
              className="w-full rounded-lg h-11"
            >
              Reset Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}