import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Heart, ArrowLeft, LogOut, User, Home, Users, MessageCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { RoomDetailsModal } from './RoomDetailsModal';
import { FilterModal } from './FilterModal';
import { ImageWithFallback } from './figma/ImageWithFallback';

type User = {
  id: string;
  fullName: string;
  profilePicture?: string;
};

type Room = {
  id: string;
  title: string;
  price: number;
  location: string;
  distance: number;
  roomType: string;
  facilities: string[];
  bedrooms: number;
  bathrooms: number;
  description: string;
  photos: string[];
  saved: boolean;
};

type RoomSearchPageProps = {
  user: User;
  onNavigate: (page: any, params?: any) => void;
  onLogout: () => void;
  showSavedOnly?: boolean;
};

const mockRooms: Room[] = [
  {
    id: '1',
    title: 'Cozy Studio Near UM',
    price: 450,
    location: 'Pantai Dalam',
    distance: 1.2,
    roomType: 'Studio',
    facilities: ['Wi-Fi', 'Aircon', 'Furniture'],
    bedrooms: 1,
    bathrooms: 1,
    description: 'A comfortable studio apartment perfect for students. Close to campus with all amenities.',
    photos: ['https://images.unsplash.com/photo-1758874573111-76d77f6ec690?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzdHVkZW50JTIwYXBhcnRtZW50JTIwcm9vbXxlbnwxfHx8fDE3NjQ2MDQxOTB8MA&ixlib=rb-4.1.0&q=80&w=1080'],
    saved: false,
  },
  {
    id: '2',
    title: 'Spacious Master Room',
    price: 600,
    location: 'Bangsar South',
    distance: 2.5,
    roomType: 'Master',
    facilities: ['Wi-Fi', 'Aircon', 'Furniture', 'Parking'],
    bedrooms: 1,
    bathrooms: 1,
    description: 'Large master room with attached bathroom. Includes parking space.',
    photos: ['https://images.unsplash.com/photo-1611095459865-47682ae3c41c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwYmVkcm9vbSUyMGludGVyaW9yfGVufDF8fHx8MTc2NDUxMTA5N3ww&ixlib=rb-4.1.0&q=80&w=1080'],
    saved: true,
  },
  {
    id: '3',
    title: 'Budget-Friendly Single Room',
    price: 350,
    location: 'Pantai Dalam',
    distance: 1.5,
    roomType: 'Single',
    facilities: ['Wi-Fi', 'Furniture', 'Study Desk'],
    bedrooms: 1,
    bathrooms: 1,
    description: 'Affordable single room ideal for students on a budget.',
    photos: ['https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwYmVkcm9vbXxlbnwxfHx8fDE3NjQ1MTUzOTB8MA&ixlib=rb-4.1.0&q=80&w=1080'],
    saved: false,
  },
  {
    id: '4',
    title: 'Modern Shared Room',
    price: 280,
    location: 'Kerinchi',
    distance: 2.0,
    roomType: 'Shared',
    facilities: ['Wi-Fi', 'Aircon', 'Washing Machine'],
    bedrooms: 1,
    bathrooms: 1,
    description: 'Share with one other student. Great for making friends!',
    photos: ['https://images.unsplash.com/photo-1680264370818-659352fa16f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaGFyZWQlMjBzdHVkZW50JTIwcm9vbXxlbnwxfHx8fDE3NjQ2MDQxOTJ8MA&ixlib=rb-4.1.0&q=80&w=1080'],
    saved: false,
  },
  {
    id: '5',
    title: 'Luxury Studio with Pool',
    price: 750,
    location: 'Bangsar',
    distance: 3.0,
    roomType: 'Studio',
    facilities: ['Wi-Fi', 'Aircon', 'Furniture', 'Parking', 'Study Desk'],
    bedrooms: 1,
    bathrooms: 1,
    description: 'Premium studio with access to swimming pool and gym facilities.',
    photos: ['https://images.unsplash.com/photo-1610879485443-c472257793d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBzdHVkaW8lMjBhcGFydG1lbnR8ZW58MXx8fHwxNzY0NjA0MTkxfDA&ixlib=rb-4.1.0&q=80&w=1080'],
    saved: false,
  },
  {
    id: '6',
    title: 'Clean Single Room',
    price: 400,
    location: 'Pantai Dalam',
    distance: 0.8,
    roomType: 'Single',
    facilities: ['Wi-Fi', 'Aircon', 'Furniture', 'Study Desk'],
    bedrooms: 1,
    bathrooms: 1,
    description: 'Walking distance to UM. Very clean and well-maintained.',
    photos: ['https://images.unsplash.com/photo-1758874573111-76d77f6ec690?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzdHVkZW50JTIwYXBhcnRtZW50JTIwcm9vbXxlbnwxfHx8fDE3NjQ2MDQxOTB8MA&ixlib=rb-4.1.0&q=80&w=1080'],
    saved: false,
  },
];

export function RoomSearchPage({ user, onNavigate, onLogout, showSavedOnly }: RoomSearchPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [rooms, setRooms] = useState<Room[]>(mockRooms);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [likedRooms, setLikedRooms] = useState<string[]>([]);
  const [activeFilters, setActiveFilters] = useState<any>({
    priceRange: [0, 2000],
    maxDistance: 10,
    roomTypes: [],
    facilities: [],
    bedrooms: 'any',
    bathrooms: 'any',
    leaseDuration: 'any',
    availableNow: false,
    sortBy: 'relevance',
    keyword: '',
  });

  // Load liked rooms from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('likedRooms');
    if (saved) {
      setLikedRooms(JSON.parse(saved));
    }
  }, []);

  const toggleSave = (roomId: string) => {
    const newLikedRooms = likedRooms.includes(roomId)
      ? likedRooms.filter(id => id !== roomId)
      : [...likedRooms, roomId];
    
    setLikedRooms(newLikedRooms);
    localStorage.setItem('likedRooms', JSON.stringify(newLikedRooms));
  };

  const handleApplyFilters = (filters: any) => {
    setActiveFilters(filters);
    setShowFilters(false);
  };

  const removeFilter = (filterKey: string) => {
    if (filterKey === 'price') {
      setActiveFilters({ ...activeFilters, priceRange: [0, 2000] });
    } else if (filterKey === 'distance') {
      setActiveFilters({ ...activeFilters, maxDistance: 10 });
    } else if (filterKey.startsWith('roomType-')) {
      const type = filterKey.replace('roomType-', '');
      setActiveFilters({
        ...activeFilters,
        roomTypes: activeFilters.roomTypes.filter((t: string) => t !== type)
      });
    } else if (filterKey.startsWith('facility-')) {
      const facility = filterKey.replace('facility-', '');
      setActiveFilters({
        ...activeFilters,
        facilities: activeFilters.facilities.filter((f: string) => f !== facility)
      });
    }
  };

  // Apply all filters to the rooms
  let filteredRooms = rooms.filter(room => {
    // Saved rooms filter (if showSavedOnly is true)
    if (showSavedOnly && !likedRooms.includes(room.id)) {
      return false;
    }
    
    // Search query filter
    const matchesSearch = room.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Price filter
    const matchesPrice = room.price >= activeFilters.priceRange[0] && 
                         room.price <= activeFilters.priceRange[1];
    
    // Distance filter
    const matchesDistance = room.distance <= activeFilters.maxDistance;
    
    // Room type filter
    const matchesRoomType = activeFilters.roomTypes.length === 0 || 
                            activeFilters.roomTypes.some((type: string) => 
                              room.roomType.toLowerCase().includes(type.toLowerCase()) ||
                              type.toLowerCase().includes(room.roomType.toLowerCase())
                            );
    
    // Facilities filter
    const matchesFacilities = activeFilters.facilities.length === 0 ||
                              activeFilters.facilities.every((facility: string) => 
                                room.facilities.includes(facility)
                              );
    
    // Bedrooms filter
    const matchesBedrooms = activeFilters.bedrooms === 'any' || 
                            room.bedrooms.toString() === activeFilters.bedrooms;
    
    // Bathrooms filter
    const matchesBathrooms = activeFilters.bathrooms === 'any' || 
                             room.bathrooms.toString() === activeFilters.bathrooms;
    
    // Keyword filter
    const matchesKeyword = !activeFilters.keyword || 
                          room.description.toLowerCase().includes(activeFilters.keyword.toLowerCase()) ||
                          room.facilities.some(f => f.toLowerCase().includes(activeFilters.keyword.toLowerCase()));
    
    return matchesSearch && matchesPrice && matchesDistance && matchesRoomType && 
           matchesFacilities && matchesBedrooms && matchesBathrooms && matchesKeyword;
  });

  // Apply sorting
  if (activeFilters.sortBy === 'price-low') {
    filteredRooms = [...filteredRooms].sort((a, b) => a.price - b.price);
  } else if (activeFilters.sortBy === 'price-high') {
    filteredRooms = [...filteredRooms].sort((a, b) => b.price - a.price);
  } else if (activeFilters.sortBy === 'distance') {
    filteredRooms = [...filteredRooms].sort((a, b) => a.distance - b.distance);
  }

  // Generate active filter tags for display
  const getActiveFilterTags = () => {
    const tags = [];
    
    if (activeFilters.priceRange[0] > 0 || activeFilters.priceRange[1] < 2000) {
      tags.push({
        key: 'price',
        label: `RM ${activeFilters.priceRange[0]}-${activeFilters.priceRange[1]}`
      });
    }
    
    if (activeFilters.maxDistance < 10) {
      tags.push({
        key: 'distance',
        label: `< ${activeFilters.maxDistance}km`
      });
    }
    
    activeFilters.roomTypes.forEach((type: string) => {
      tags.push({
        key: `roomType-${type}`,
        label: type
      });
    });
    
    activeFilters.facilities.forEach((facility: string) => {
      tags.push({
        key: `facility-${facility}`,
        label: facility
      });
    });
    
    return tags;
  };

  const activeFilterTags = getActiveFilterTags();

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('student-dashboard')}
                className="text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-[#81D9F7]">Room Search</h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('student-profile')}
                className="w-8 h-8 bg-[#81D9F7] rounded-full flex items-center justify-center text-white"
              >
                <User className="h-4 w-4" />
              </button>
              <Button
                onClick={onLogout}
                variant="ghost"
                size="sm"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex gap-2 mb-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search location, room type..."
                className="pl-9 rounded-lg h-10"
              />
            </div>
            <Button
              onClick={() => setShowFilters(true)}
              variant="outline"
              className="rounded-lg px-3"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </div>

          {/* Active Filters */}
          {activeFilterTags.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {activeFilterTags.map((tag) => (
                <button
                  key={tag.key}
                  onClick={() => removeFilter(tag.key)}
                  className="px-2 py-1 bg-[#81D9F7] text-white rounded-full text-xs flex items-center gap-1"
                >
                  {tag.label}
                  <span className="text-xs">×</span>
                </button>
              ))}
              <button
                onClick={() => setActiveFilters({
                  priceRange: [0, 2000],
                  maxDistance: 10,
                  roomTypes: [],
                  facilities: [],
                  bedrooms: 'any',
                  bathrooms: 'any',
                  leaseDuration: 'any',
                  availableNow: false,
                  sortBy: 'relevance',
                  keyword: '',
                })}
                className="px-2 py-1 text-gray-600 text-xs"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto px-4 py-4 pb-20">
        <div className="mb-3">
          <p className="text-gray-600 text-sm">
            {filteredRooms.length} room{filteredRooms.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Room Cards */}
        <div className="space-y-4">
          {filteredRooms.map((room) => (
            <div
              key={room.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden active:shadow-md transition-all"
              onClick={() => setSelectedRoom(room)}
            >
              {/* Thumbnail */}
              <div className="aspect-video bg-gray-200 relative overflow-hidden">
                {room.photos.length > 0 ? (
                  <ImageWithFallback
                    src={room.photos[0]}
                    alt={room.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Home className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSave(room.id);
                  }}
                  className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md active:scale-110 transition-transform"
                >
                  <Heart
                    className={`h-4 w-4 ${
                      likedRooms.includes(room.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'
                    }`}
                  />
                </button>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="mb-1">{room.title}</h3>
                <p className="text-[#81D9F7] mb-2">RM {room.price}/month</p>
                <p className="text-sm text-gray-600 mb-2">
                  {room.location} • {room.distance} km from UM
                </p>

                {/* Quick Facts */}
                <div className="flex gap-2 mb-2 text-sm text-gray-600">
                  <span>{room.bedrooms} bed</span>
                  <span>•</span>
                  <span>{room.bathrooms} bath</span>
                  <span>•</span>
                  <span>{room.roomType}</span>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {room.description}
                </p>

                {/* Facilities */}
                <div className="flex flex-wrap gap-2">
                  {room.facilities.slice(0, 3).map((facility, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                    >
                      {facility}
                    </span>
                  ))}
                  {room.facilities.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      +{room.facilities.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredRooms.length === 0 && (
          <div className="text-center py-16">
            <Home className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="mb-2 text-gray-600">No rooms found</h3>
            <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
          </div>
        )}
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
            <Search className="h-5 w-5 text-[#81D9F7]" />
            <span className="text-xs text-[#81D9F7]">Search</span>
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

      {/* Room Details Modal */}
      {selectedRoom && (
        <RoomDetailsModal
          room={selectedRoom}
          onClose={() => setSelectedRoom(null)}
          onToggleSave={() => toggleSave(selectedRoom.id)}
          isLiked={likedRooms.includes(selectedRoom.id)}
        />
      )}

      {/* Filter Modal */}
      {showFilters && (
        <FilterModal
          onClose={() => setShowFilters(false)}
          onApply={handleApplyFilters}
          initialFilters={activeFilters}
        />
      )}
    </div>
  );
}