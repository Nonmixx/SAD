import { useState, useEffect } from 'react';
import { ArrowLeft, Heart, Home, Search, Users, MessageCircle } from 'lucide-react';
import { RoomDetailsModal } from './RoomDetailsModal';
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

type SavedRoomsPageProps = {
  user: User;
  onNavigate: (page: any, params?: any) => void;
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
    description: 'Premium studio with access to pool and gym facilities.',
    photos: ['https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhcGFydG1lbnQlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjQ2MDQxOTN8MA&ixlib=rb-4.1.0&q=80&w=1080'],
    saved: false,
  },
];

export function SavedRoomsPage({ user, onNavigate }: SavedRoomsPageProps) {
  const [likedRooms, setLikedRooms] = useState<string[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

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

  // Filter to show only liked rooms
  const savedRooms = mockRooms.filter(room => likedRooms.includes(room.id));

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
        <h1 className="flex-1">Saved Rooms</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {savedRooms.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No saved rooms yet</p>
            <p className="text-sm text-gray-400 mt-2">
              Start saving rooms from the search page
            </p>
          </div>
        ) : (
          <div className="space-y-3 pb-20">
            {savedRooms.map((room) => (
              <div
                key={room.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
                onClick={() => setSelectedRoom(room)}
              >
                <div className="relative">
                  <ImageWithFallback
                    src={room.photos[0]}
                    alt={room.title}
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSave(room.id);
                    }}
                    className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md"
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        likedRooms.includes(room.id)
                          ? 'fill-red-500 text-red-500'
                          : 'text-gray-600'
                      }`}
                    />
                  </button>
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="text-base mb-1">{room.title}</h3>
                      <p className="text-sm text-gray-600">
                        {room.location} • {room.distance}km away
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg text-[#81D9F7]">RM{room.price}</p>
                      <p className="text-xs text-gray-500">per month</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                      {room.roomType}
                    </span>
                    {room.facilities.slice(0, 3).map((facility, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs"
                      >
                        {facility}
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
    </div>
  );
}