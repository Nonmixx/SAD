import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Search, MapPin, Home, User, LogOut, X, Filter, Heart, Map, MessageCircle, ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Slider } from './ui/slider';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';

type User = {
  id: string;
  fullName: string;
  profilePicture?: string;
};

type MapViewProps = {
  user: User;
  onNavigate: (page: any) => void;
  onLogout: () => void;
};

type RoomPin = {
  id: string;
  title: string;
  price: number;
  location: string;
  distance: number;
  lat: number;
  lng: number;
  roomType: string;
  facilities: string[];
  image: string;
  saved?: boolean;
};

const mockRoomPins: RoomPin[] = [
  { 
    id: '1', 
    title: 'Cozy Studio Near UM', 
    price: 450, 
    location: 'Pantai Dalam', 
    distance: 1.2, 
    lat: 3.115, 
    lng: 101.665,
    roomType: 'Studio',
    facilities: ['Wi-Fi', 'Aircon', 'Furniture'],
    image: 'https://images.unsplash.com/photo-1758874573111-76d77f6ec690?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzdHVkZW50JTIwYXBhcnRtZW50JTIwcm9vbXxlbnwxfHx8fDE3NjQ2MDQxOTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    saved: false
  },
  { 
    id: '2', 
    title: 'Spacious Master Room', 
    price: 600, 
    location: 'Bangsar South', 
    distance: 2.5, 
    lat: 3.120, 
    lng: 101.675,
    roomType: 'Master Room',
    facilities: ['Wi-Fi', 'Aircon', 'Parking', 'Furniture'],
    image: 'https://images.unsplash.com/photo-1611095459865-47682ae3c41c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwYmVkcm9vbSUyMGludGVyaW9yfGVufDF8fHx8MTc2NDUxMTA5N3ww&ixlib=rb-4.1.0&q=80&w=1080',
    saved: true
  },
  { 
    id: '3', 
    title: 'Budget-Friendly Single Room', 
    price: 350, 
    location: 'Pantai Dalam', 
    distance: 1.5, 
    lat: 3.117, 
    lng: 101.668,
    roomType: 'Single Room',
    facilities: ['Wi-Fi', 'Study Desk'],
    image: 'https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwYmVkcm9vbXxlbnwxfHx8fDE3NjQ1MTUzOTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    saved: false
  },
  { 
    id: '4', 
    title: 'Modern Shared Room', 
    price: 280, 
    location: 'Kerinchi', 
    distance: 2.0, 
    lat: 3.110, 
    lng: 101.670,
    roomType: 'Shared Room',
    facilities: ['Wi-Fi', 'Study Desk', 'Aircon'],
    image: 'https://images.unsplash.com/photo-1680264370818-659352fa16f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaGFyZWQlMjBzdHVkZW50JTIwcm9vbXxlbnwxfHx8fDE3NjQ2MDQxOTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    saved: false
  },
  { 
    id: '5', 
    title: 'Luxury Studio with Pool', 
    price: 750, 
    location: 'Bangsar', 
    distance: 3.0, 
    lat: 3.125, 
    lng: 101.680,
    roomType: 'Studio',
    facilities: ['Wi-Fi', 'Aircon', 'Parking', 'Furniture', 'Pool', 'Gym'],
    image: 'https://images.unsplash.com/photo-1610879485443-c472257793d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBzdHVkaW8lMjBhcGFydG1lbnR8ZW58MXx8fHwxNzY0NjA0MTkxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    saved: false
  },
  { 
    id: '6', 
    title: 'Clean Single Room', 
    price: 400, 
    location: 'Pantai Dalam', 
    distance: 0.8, 
    lat: 3.1213, 
    lng: 101.6559,
    roomType: 'Single Room',
    facilities: ['Wi-Fi', 'Aircon', 'Furniture'],
    image: 'https://images.unsplash.com/photo-1758874573111-76d77f6ec690?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzdHVkZW50JTIwYXBhcnRtZW50JTIwcm9vbXxlbnwxfHx8fDE3NjQ2MDQxOTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    saved: false
  },
];

export function MapView({ user, onNavigate, onLogout }: MapViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPin, setSelectedPin] = useState<RoomPin | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [maxDistance, setMaxDistance] = useState(5);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [selectedRoomTypes, setSelectedRoomTypes] = useState<string[]>([]);
  const [rooms, setRooms] = useState<RoomPin[]>(mockRoomPins);
  const [mapCenter, setMapCenter] = useState({ lat: 3.1213, lng: 101.6559 });
  const [mapZoom, setMapZoom] = useState(14);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchMarker, setSearchMarker] = useState<any>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [isRoomListExpanded, setIsRoomListExpanded] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<RoomPin | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const allFacilities = ['Wi-Fi', 'Aircon', 'Furniture', 'Parking', 'Pool', 'Gym', 'Study Desk'];
  const allRoomTypes = ['Studio', 'Single Room', 'Master Room', 'Shared Room'];

  // Filter rooms based on search and filters
  const filteredRooms = rooms.filter(room => {
    const matchesSearch = searchQuery === '' || 
      room.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.roomType.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPrice = room.price >= priceRange[0] && room.price <= priceRange[1];
    const matchesDistance = room.distance <= maxDistance;
    
    const matchesFacilities = selectedFacilities.length === 0 || 
      selectedFacilities.every(f => room.facilities.includes(f));
    
    const matchesRoomType = selectedRoomTypes.length === 0 || 
      selectedRoomTypes.includes(room.roomType);

    return matchesSearch && matchesPrice && matchesDistance && matchesFacilities && matchesRoomType;
  });

  const toggleFacility = (facility: string) => {
    setSelectedFacilities(prev => 
      prev.includes(facility) ? prev.filter(f => f !== facility) : [...prev, facility]
    );
  };

  const toggleRoomType = (type: string) => {
    setSelectedRoomTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const toggleSave = (roomId: string) => {
    setRooms(rooms.map(room => 
      room.id === roomId ? { ...room, saved: !room.saved } : room
    ));
  };

  const clearFilters = () => {
    setPriceRange([0, 1000]);
    setMaxDistance(5);
    setSelectedFacilities([]);
    setSelectedRoomTypes([]);
    setSearchQuery('');
  };

  const activeFilterCount = 
    (priceRange[1] < 1000 ? 1 : 0) + 
    (maxDistance < 5 ? 1 : 0) + 
    selectedFacilities.length + 
    selectedRoomTypes.length;

  const handleRoomClick = (room: RoomPin) => {
    setSelectedPin(room);
    setMapCenter({ lat: room.lat, lng: room.lng });
    setMapZoom(16);
    setShowSearchResults(false);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);
    setShowSearchResults(true);

    try {
      // Use Nominatim API for geocoding (free, no API key needed)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery + ', Kuala Lumpur, Malaysia'
        )}&limit=5`
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchResultClick = (result: any) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    
    setMapCenter({ lat, lng });
    setMapZoom(16);
    setShowSearchResults(false);
    setSearchQuery(result.display_name.split(',')[0]);

    // Remove old search marker if exists
    if (searchMarker && leafletMapRef.current) {
      leafletMapRef.current.removeLayer(searchMarker);
    }

    // Add new search marker
    if (window.L && leafletMapRef.current) {
      const searchIcon = window.L.divIcon({
        className: 'custom-marker',
        html: '<div style="background: #10B981; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px;">📍</div>',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });

      const marker = window.L.marker([lat, lng], { icon: searchIcon })
        .addTo(leafletMapRef.current)
        .bindPopup(`<div style="min-width: 200px;"><b>${result.display_name}</b></div>`)
        .openPopup();
      
      setSearchMarker(marker);
    }
  };

  const handleSearchInputChange = (value: string) => {
    setSearchQuery(value);
    if (!value.trim()) {
      setShowSearchResults(false);
      setSearchResults([]);
    }
  };

  // Load Leaflet CSS and JS
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.id = 'leaflet-css';
    
    // Only add if not already present
    if (!document.getElementById('leaflet-css')) {
      document.head.appendChild(link);
    }

    // Load Leaflet JS
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.id = 'leaflet-js';
    script.async = true;
    
    script.onload = () => {
      // Initialize map once Leaflet is loaded
      if (!leafletMapRef.current && mapRef.current && window.L) {
        initMap();
      }
    };

    // Only add if not already present
    if (!document.getElementById('leaflet-js')) {
      document.head.appendChild(script);
    } else if (window.L && !leafletMapRef.current) {
      // If script already loaded, init map
      initMap();
    }

    return () => {
      // Clean up map instance on unmount
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  // Update map view when center or zoom changes
  useEffect(() => {
    if (leafletMapRef.current) {
      leafletMapRef.current.setView([mapCenter.lat, mapCenter.lng], mapZoom);
    }
  }, [mapCenter, mapZoom]);

  // Update markers when filtered rooms or selected pin changes
  useEffect(() => {
    if (leafletMapRef.current && window.L) {
      updateMarkers();
    }
  }, [filteredRooms, selectedPin]);

  // Click outside to close search results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const initMap = () => {
    if (!window.L || !mapRef.current || leafletMapRef.current) return;

    try {
      // Create map
      const map = window.L.map(mapRef.current).setView([mapCenter.lat, mapCenter.lng], mapZoom);
      leafletMapRef.current = map;

      // Add OpenStreetMap tiles
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      // Add markers
      updateMarkers();
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  };

  const updateMarkers = () => {
    if (!leafletMapRef.current || !window.L) return;

    // Clear existing markers
    markersRef.current.forEach(marker => {
      leafletMapRef.current.removeLayer(marker);
    });
    markersRef.current = [];

    // Add University marker
    const umIcon = window.L.divIcon({
      className: 'custom-marker',
      html: '<div style="background: #EF4444; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    const umMarker = window.L.marker([3.1213, 101.6559], { icon: umIcon })
      .addTo(leafletMapRef.current)
      .bindPopup('<b>University of Malaya</b>');
    
    markersRef.current.push(umMarker);

    // Add room markers
    filteredRooms.forEach(room => {
      const isSelected = selectedPin?.id === room.id;
      const roomIcon = window.L.divIcon({
        className: 'custom-marker',
        html: `<div style="background: #81D9F7; width: ${isSelected ? 32 : 24}px; height: ${isSelected ? 32 : 24}px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-size: ${isSelected ? 10 : 8}px; font-weight: bold;">${isSelected ? '★' : room.price}</div>`,
        iconSize: [isSelected ? 32 : 24, isSelected ? 32 : 24],
        iconAnchor: [isSelected ? 16 : 12, isSelected ? 16 : 12],
      });

      const marker = window.L.marker([room.lat, room.lng], { icon: roomIcon })
        .addTo(leafletMapRef.current)
        .bindPopup(`
          <div style="min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">${room.title}</h3>
            <p style="margin: 4px 0; color: #81D9F7; font-weight: bold; font-size: 16px;">RM ${room.price}/month</p>
            <p style="margin: 4px 0; font-size: 12px; color: #666;">${room.location} • ${room.distance}km</p>
            <p style="margin: 4px 0; font-size: 12px;"><span style="background: #f3f4f6; padding: 2px 8px; border-radius: 12px;">${room.roomType}</span></p>
          </div>
        `);

      marker.on('click', () => {
        setSelectedPin(room);
      });

      markersRef.current.push(marker);
    });
  };

  return (
    <div className="h-full flex flex-col bg-[#FAFAFA] relative">
      {/* Header */}
      <header className="bg-white shadow-sm z-10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('student-dashboard')}
                className="text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h2 className="text-base">Map View</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(true)}
                className="p-2 hover:bg-gray-50 rounded-lg relative"
              >
                <SlidersHorizontal className="h-5 w-5 text-gray-600" />
                {(selectedRoomTypes.length > 0 || selectedFacilities.length > 0) && (
                  <div className="absolute top-1 right-1 w-2 h-2 bg-[#81D9F7] rounded-full"></div>
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

      {/* Map Container - Use CSS to hide instead of conditional rendering */}
      <div className={`flex-1 relative z-0 ${showFilters ? 'hidden' : ''}`}>
        <div 
          ref={mapRef} 
          className="absolute inset-0 w-full h-full"
        />

        {/* Reset View Button */}
        <button
          onClick={() => {
            setMapCenter({ lat: 3.1213, lng: 101.6559 });
            setMapZoom(14);
            setSelectedPin(null);
          }}
          className="absolute top-3 right-3 bg-white rounded-lg shadow-lg px-3 py-2 hover:bg-gray-50 transition-colors z-10 text-xs"
        >
          Reset View
        </button>

        {/* Room List Toggle Button */}
        <button
          onClick={() => setIsRoomListExpanded(!isRoomListExpanded)}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-lg px-4 py-2 hover:bg-gray-50 transition-colors z-10 flex items-center gap-2 text-xs"
        >
          {isRoomListExpanded ? (
            <>
              <ChevronDown className="h-4 w-4" />
              Hide Rooms ({filteredRooms.length})
            </>
          ) : (
            <>
              <ChevronUp className="h-4 w-4" />
              Show Rooms ({filteredRooms.length})
            </>
          )}
        </button>
      </div>

      {/* Available Rooms Bottom Sheet */}
      {isRoomListExpanded && !showFilters && (
        <div className="bg-white border-t shadow-lg max-h-[40vh] overflow-hidden flex flex-col">
          <div className="p-3 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-sm">Available Rooms ({filteredRooms.length})</h3>
              <button
                onClick={() => setIsRoomListExpanded(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <ChevronDown className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="overflow-y-auto p-3 space-y-2">
            {filteredRooms.map((room) => (
              <div
                key={room.id}
                onClick={() => handleRoomClick(room)}
                className={`bg-white rounded-lg border-2 p-2 cursor-pointer transition-all ${
                  selectedPin?.id === room.id
                    ? 'border-[#81D9F7] bg-[#81D9F7]/5'
                    : 'border-gray-200 hover:border-[#81D9F7]/50'
                }`}
              >
                <div className="flex gap-2">
                  <ImageWithFallback
                    src={room.image}
                    alt={room.title}
                    className="w-16 h-16 rounded-lg object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs mb-0.5 truncate">{room.title}</h4>
                    <p className="text-[#81D9F7] text-xs mb-0.5">RM {room.price}/month</p>
                    <p className="text-xs text-gray-600 truncate">
                      {room.location} • {room.distance}km
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="px-1.5 py-0.5 bg-gray-100 text-gray-700 text-[9px] rounded">
                        {room.roomType}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSave(room.id);
                        }}
                        className="ml-auto"
                      >
                        <Heart
                          className={`h-4 w-4 ${
                            room.saved
                              ? 'fill-red-500 text-red-500'
                              : 'text-gray-400'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredRooms.length === 0 && (
              <div className="text-center py-8">
                <Home className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-1">No rooms found</p>
                <p className="text-xs text-gray-500">Try adjusting your filters</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      {!showFilters && (
        <nav className="bg-white border-t shadow-lg z-20">
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
              onClick={() => onNavigate('map')}
              className="flex flex-col items-center gap-1 px-3 py-1"
            >
              <MapPin className="h-5 w-5 text-[#81D9F7]" />
              <span className="text-xs text-[#81D9F7]">Map</span>
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
      )}

      {/* Filters Modal */}
      {showFilters && (
        <div className="absolute inset-0 bg-white z-[60] flex flex-col">
          <div className="flex-shrink-0 bg-white p-4 border-b flex items-center gap-3">
            <button
              onClick={() => setShowFilters(false)}
              className="text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h3 className="flex-1">Filters</h3>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {/* Price Range */}
            <div>
              <Label className="text-sm mb-2 block">
                Price Range: RM {priceRange[0]} - RM {priceRange[1]}
              </Label>
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                max={1000}
                step={50}
                className="mt-2"
              />
            </div>

            {/* Distance */}
            <div>
              <Label className="text-sm mb-2 block">
                Max Distance: {maxDistance} km from UM
              </Label>
              <Slider
                value={[maxDistance]}
                onValueChange={value => setMaxDistance(value[0])}
                max={5}
                step={0.5}
                className="mt-2"
              />
            </div>

            {/* Room Types */}
            <div>
              <Label className="text-sm mb-2 block">Room Types</Label>
              <div className="space-y-2">
                {allRoomTypes.map(type => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`map-${type}`}
                      checked={selectedRoomTypes.includes(type)}
                      onCheckedChange={() => toggleRoomType(type)}
                    />
                    <label htmlFor={`map-${type}`} className="text-sm cursor-pointer">
                      {type}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Facilities */}
            <div>
              <Label className="text-sm mb-2 block">Facilities</Label>
              <div className="space-y-2">
                {allFacilities.map(facility => (
                  <div key={facility} className="flex items-center space-x-2">
                    <Checkbox
                      id={`map-${facility}`}
                      checked={selectedFacilities.includes(facility)}
                      onCheckedChange={() => toggleFacility(facility)}
                    />
                    <label htmlFor={`map-${facility}`} className="text-sm cursor-pointer">
                      {facility}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex-shrink-0 bg-white p-4 border-t space-y-2">
            <Button
              onClick={() => setShowFilters(false)}
              className="w-full bg-[#81D9F7] hover:bg-[#6BC5E0] rounded-lg h-11"
            >
              Apply Filters ({filteredRooms.length} rooms)
            </Button>
            <Button
              onClick={clearFilters}
              variant="outline"
              className="w-full rounded-lg h-11"
            >
              Clear All Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}