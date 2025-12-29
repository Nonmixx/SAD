import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Search, MapPin, Home, User, LogOut, Navigation, X, Filter, ChevronDown, DollarSign, Ruler, Star } from 'lucide-react';
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

type MapPageProps = {
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
};

const mockRoomPins: RoomPin[] = [
  { 
    id: '1', 
    title: 'Cozy Studio', 
    price: 450, 
    location: 'Pantai Dalam', 
    distance: 1.2, 
    lat: 3.115, 
    lng: 101.665,
    roomType: 'Studio',
    facilities: ['Wi-Fi', 'Aircon', 'Furniture'],
    image: 'https://images.unsplash.com/photo-1758874573111-76d77f6ec690?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzdHVkZW50JTIwYXBhcnRtZW50JTIwcm9vbXxlbnwxfHx8fDE3NjQ2MDQxOTB8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  { 
    id: '2', 
    title: 'Master Room', 
    price: 600, 
    location: 'Bangsar South', 
    distance: 2.5, 
    lat: 3.120, 
    lng: 101.675,
    roomType: 'Master Room',
    facilities: ['Wi-Fi', 'Aircon', 'Parking', 'Furniture'],
    image: 'https://images.unsplash.com/photo-1611095459865-47682ae3c41c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwYmVkcm9vbSUyMGludGVyaW9yfGVufDF8fHx8MTc2NDUxMTA5N3ww&ixlib=rb-4.1.0&q=80&w=1080'
  },
  { 
    id: '3', 
    title: 'Budget Room', 
    price: 350, 
    location: 'Pantai Dalam', 
    distance: 1.5, 
    lat: 3.117, 
    lng: 101.668,
    roomType: 'Single Room',
    facilities: ['Wi-Fi', 'Study Desk'],
    image: 'https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwYmVkcm9vbXxlbnwxfHx8fDE3NjQ1MTUzOTB8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  { 
    id: '4', 
    title: 'Shared Room', 
    price: 280, 
    location: 'Kerinchi', 
    distance: 2.0, 
    lat: 3.110, 
    lng: 101.670,
    roomType: 'Shared Room',
    facilities: ['Wi-Fi', 'Study Desk'],
    image: 'https://images.unsplash.com/photo-1680264370818-659352fa16f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaGFyZWQlMjBzdHVkZW50JTIwcm9vbXxlbnwxfHx8fDE3NjQ2MDQxOTJ8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  { 
    id: '5', 
    title: 'Luxury Studio', 
    price: 750, 
    location: 'Bangsar', 
    distance: 3.0, 
    lat: 3.125, 
    lng: 101.680,
    roomType: 'Studio',
    facilities: ['Wi-Fi', 'Aircon', 'Parking', 'Furniture', 'Pool'],
    image: 'https://images.unsplash.com/photo-1610879485443-c472257793d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBzdHVkaW8lMjBhcGFydG1lbnR8ZW58MXx8fHwxNzY0NjA0MTkxfDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
];

export function MapPage({ user, onNavigate, onLogout }: MapPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPin, setSelectedPin] = useState<RoomPin | null>(null);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showRoomList, setShowRoomList] = useState(true);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [maxDistance, setMaxDistance] = useState(5);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [selectedRoomTypes, setSelectedRoomTypes] = useState<string[]>([]);
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  const allFacilities = ['Wi-Fi', 'Aircon', 'Furniture', 'Parking', 'Pool', 'Gym', 'Study Desk'];
  const allRoomTypes = ['Studio', 'Single Room', 'Master Room', 'Shared Room'];

  // Filter rooms based on search and filters
  const filteredRooms = mockRoomPins.filter(room => {
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

  useEffect(() => {
    // Load Google Maps script with async/defer
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        initMap();
        return;
      }

      // Check if script already exists
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
      if (existingScript) {
        // Wait for it to load
        const checkLoaded = setInterval(() => {
          if (window.google && window.google.maps) {
            clearInterval(checkLoaded);
            initMap();
          }
        }, 100);
        return;
      }

      const script = document.createElement('script');
      // Replace with your Google Maps API key
      const API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places,marker`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        // Wait a bit for libraries to fully initialize
        setTimeout(() => {
          if (window.google && window.google.maps) {
            initMap();
          } else {
            setMapError('Failed to load Google Maps properly');
          }
        }, 100);
      };
      
      script.onerror = () => {
        setMapError('Failed to load Google Maps. Please check your API key.');
      };
      
      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, []);

  // Update markers when filters change
  useEffect(() => {
    if (mapLoaded && googleMapRef.current) {
      updateMapMarkers();
    }
  }, [filteredRooms, mapLoaded, selectedPin]);

  const initMap = async () => {
    if (!mapRef.current || !window.google || !window.google.maps) {
      console.error('Google Maps not ready');
      return;
    }

    try {
      // Wait for google.maps.Map to be available
      if (typeof window.google.maps.Map !== 'function') {
        setMapError('Google Maps API not fully loaded');
        return;
      }

      // University of Malaya coordinates
      const umLocation = { lat: 3.1213, lng: 101.6559 };

      const map = new window.google.maps.Map(mapRef.current, {
        center: umLocation,
        zoom: 14,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ],
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        mapId: 'ROOMEO_MAP', // Required for AdvancedMarkerElement
      });

      googleMapRef.current = map;

      // Import marker library
      const markerLibrary = await window.google.maps.importLibrary("marker");
      const { AdvancedMarkerElement, PinElement } = markerLibrary as any;

      // Add University marker using AdvancedMarkerElement
      const umPin = new PinElement({
        background: '#EF4444',
        borderColor: '#FFFFFF',
        glyphColor: '#FFFFFF',
        scale: 1.2,
      });

      new AdvancedMarkerElement({
        map: map,
        position: umLocation,
        content: umPin.element,
        title: 'University of Malaya',
      });

      setMapLoaded(true);
      setMapError(null);
      
      // Initial markers
      await updateMapMarkers();
    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError('Failed to initialize map. Please check your API key and ensure the Marker library is enabled.');
    }
  };

  const updateMapMarkers = async () => {
    if (!googleMapRef.current || !window.google || !mapLoaded) return;

    try {
      const markerLibrary = await window.google.maps.importLibrary("marker");
      const { AdvancedMarkerElement, PinElement } = markerLibrary as any;

      // Clear existing markers
      markersRef.current.forEach(marker => {
        marker.map = null;
      });
      markersRef.current = [];

      // Add filtered room markers
      filteredRooms.forEach((room) => {
        const roomPin = new PinElement({
          background: '#81D9F7',
          borderColor: '#FFFFFF',
          glyphColor: '#FFFFFF',
          scale: selectedPin?.id === room.id ? 1.3 : 1.0,
        });

        const marker = new AdvancedMarkerElement({
          map: googleMapRef.current,
          position: { lat: room.lat, lng: room.lng },
          content: roomPin.element,
          title: room.title,
        });

        marker.addListener('click', () => {
          handlePinClick(room);
          googleMapRef.current.panTo({ lat: room.lat, lng: room.lng });
        });

        markersRef.current.push(marker);
      });
    } catch (error) {
      console.error('Error updating markers:', error);
    }
  };

  const handlePinClick = (room: RoomPin) => {
    setSelectedPin(room);
    setShowBottomSheet(true);
    updateMapMarkers(); // Update marker sizes
  };

  const handleSearch = () => {
    if (!searchQuery || !googleMapRef.current || !window.google) return;

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: searchQuery + ', Kuala Lumpur, Malaysia' }, (results: any, status: any) => {
      if (status === 'OK' && results[0]) {
        googleMapRef.current.setCenter(results[0].geometry.location);
        googleMapRef.current.setZoom(15);
      }
    });
  };

  const centerOnMyLocation = () => {
    if (navigator.geolocation && googleMapRef.current) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          googleMapRef.current.setCenter(pos);
          googleMapRef.current.setZoom(16);
        },
        () => {
          alert('Unable to get your location');
        }
      );
    }
  };

  const handleRoomCardClick = (room: RoomPin) => {
    setSelectedPin(room);
    setShowBottomSheet(true);
    if (googleMapRef.current) {
      googleMapRef.current.panTo({ lat: room.lat, lng: room.lng });
      googleMapRef.current.setZoom(16);
    }
    updateMapMarkers();
  };

  return (
    <div className="h-full flex flex-col bg-[#FAFAFA]">
      {/* Header */}
      <header className="bg-white shadow-sm z-30">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('student-dashboard')}
                className="text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h2 className="text-lg">Map View</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('student-profile')}
                className="flex items-center gap-2 hover:bg-gray-50 px-2 py-2 rounded-lg"
              >
                <div className="w-8 h-8 bg-[#81D9F7] rounded-full flex items-center justify-center text-white">
                  <User className="h-4 w-4" />
                </div>
              </button>
              <Button onClick={onLogout} variant="ghost" size="sm" className="hidden sm:flex">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search location, room type..."
                className="pl-9 rounded-lg"
              />
            </div>
            <Button
              onClick={() => setShowFilters(true)}
              variant="outline"
              className="rounded-lg relative"
            >
              <Filter className="h-4 w-4" />
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#81D9F7] text-white rounded-full text-xs flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </Button>
            <Button
              onClick={() => setShowRoomList(!showRoomList)}
              className="bg-[#81D9F7] hover:bg-[#6BC5E0] rounded-lg hidden lg:flex"
            >
              {showRoomList ? 'Hide' : 'Show'} List
            </Button>
          </div>

          {/* Active Filter Tags */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {priceRange[1] < 1000 && (
                <span className="px-3 py-1 bg-[#81D9F7]/10 text-[#81D9F7] rounded-full text-xs">
                  RM {priceRange[0]}-{priceRange[1]}
                </span>
              )}
              {maxDistance < 5 && (
                <span className="px-3 py-1 bg-[#81D9F7]/10 text-[#81D9F7] rounded-full text-xs">
                  < Ruler className="h-3 w-3" /> &lt; {maxDistance}km
                </span>
              )}
              {selectedRoomTypes.map(type => (
                <span key={type} className="px-3 py-1 bg-[#81D9F7]/10 text-[#81D9F7] rounded-full text-xs">
                  {type}
                </span>
              ))}
              {selectedFacilities.map(facility => (
                <span key={facility} className="px-3 py-1 bg-[#81D9F7]/10 text-[#81D9F7] rounded-full text-xs">
                  {facility}
                </span>
              ))}
              <button
                onClick={clearFilters}
                className="px-3 py-1 text-gray-600 hover:text-gray-800 text-xs underline"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative overflow-hidden flex">
        {/* Map Container */}
        <div className="flex-1 relative">
          <div ref={mapRef} className="absolute inset-0 w-full h-full" />

          {/* Loading State */}
          {!mapLoaded && !mapError && (
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-30">
              <div className="text-center max-w-md px-4">
                <div className="w-12 h-12 border-4 border-[#81D9F7] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Loading map...</p>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-left">
                  <p className="text-sm mb-2">📝 Setup Required:</p>
                  <ol className="text-xs text-gray-700 space-y-1 list-decimal list-inside">
                    <li>Get a Google Maps API key from <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-[#81D9F7] underline">Google Cloud Console</a></li>
                    <li>Enable the following APIs:
                      <ul className="ml-6 mt-1 space-y-0.5 list-disc list-inside">
                        <li>Maps JavaScript API</li>
                        <li>Places API</li>
                        <li>Geocoding API</li>
                      </ul>
                    </li>
                    <li>Replace 'YOUR_GOOGLE_MAPS_API_KEY' in /components/MapPage.tsx</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {mapError && (
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-30">
              <div className="text-center max-w-md px-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-red-500" />
                </div>
                <h3 className="text-lg mb-2 text-gray-800">Map Unavailable</h3>
                <p className="text-sm text-gray-600 mb-4">{mapError}</p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left mb-4">
                  <p className="text-sm mb-2">🔧 How to fix:</p>
                  <ol className="text-xs text-gray-700 space-y-2 list-decimal list-inside">
                    <li>
                      <strong>Get API Key:</strong>
                      <br />
                      <a href="https://console.cloud.google.com/google/maps-apis" target="_blank" rel="noopener noreferrer" className="text-[#81D9F7] underline">
                        Visit Google Cloud Console
                      </a>
                    </li>
                    <li>
                      <strong>Enable APIs:</strong>
                      <ul className="ml-6 mt-1 space-y-0.5 list-disc list-inside">
                        <li>Maps JavaScript API</li>
                        <li>Places API</li>
                        <li>Geocoding API</li>
                      </ul>
                    </li>
                    <li>
                      <strong>Update Code:</strong>
                      <br />
                      <span className="text-xs bg-gray-800 text-white px-2 py-1 rounded font-mono">
                        /components/MapPage.tsx
                      </span>
                    </li>
                  </ol>
                </div>
                <Button
                  onClick={() => window.location.reload()}
                  className="bg-[#81D9F7] hover:bg-[#6BC5E0] rounded-lg"
                >
                  Retry
                </Button>
              </div>
            </div>
          )}

          {/* My Location Button */}
          {mapLoaded && (
            <button 
              onClick={centerOnMyLocation}
              className="absolute top-4 right-4 w-11 h-11 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
            >
              <Navigation className="h-5 w-5 text-gray-600" />
            </button>
          )}

          {/* Filter Button */}
          {mapLoaded && (
            <button className="absolute top-16 right-4 w-11 h-11 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors z-10">
              <Filter className="h-5 w-5 text-gray-600" />
            </button>
          )}

          {/* Legend */}
          {mapLoaded && (
            <div className="absolute bottom-24 sm:bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 z-10">
              <p className="text-xs mb-2">Legend</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded-full" />
                  <span className="text-xs">University of Malaya</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#81D9F7] rounded-full" />
                  <span className="text-xs">Available Rooms</span>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Sheet */}
          {showBottomSheet && selectedPin && (
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-20 max-h-[70vh] overflow-y-auto">
              <div className="p-4 sm:p-6">
                {/* Handle */}
                <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />

                {/* Close button for mobile */}
                <button
                  onClick={() => setShowBottomSheet(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 sm:hidden"
                >
                  <X className="h-5 w-5" />
                </button>

                {/* Content */}
                <div>
                  {/* Room Image */}
                  {selectedPin.image && (
                    <div className="mb-4 rounded-lg overflow-hidden">
                      <ImageWithFallback
                        src={selectedPin.image}
                        alt={selectedPin.title}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg mb-2">{selectedPin.title}</h3>
                      <p className="text-[#81D9F7] mb-2">RM {selectedPin.price}/month</p>
                      <div className="flex items-center gap-2 text-gray-600 mb-3">
                        <MapPin className="h-4 w-4 shrink-0" />
                        <span className="text-sm">{selectedPin.location} • {selectedPin.distance} km from UM</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="px-3 py-1 bg-[#81D9F7]/10 text-[#81D9F7] rounded-full text-xs">
                          {selectedPin.roomType}
                        </span>
                        {selectedPin.facilities.slice(0, 2).map((facility, i) => (
                          <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                            {facility}
                          </span>
                        ))}
                        {selectedPin.facilities.length > 2 && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                            +{selectedPin.facilities.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => setShowBottomSheet(false)}
                      className="text-gray-500 hover:text-gray-700 hidden sm:block"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Nearby Rooms */}
                  <div className="mb-4">
                    <h4 className="mb-3 text-sm">Nearby Rooms</h4>
                    <div className="space-y-2">
                      {mockRoomPins
                        .filter(r => r.id !== selectedPin.id)
                        .slice(0, 3)
                        .map((room) => (
                          <button
                            key={room.id}
                            onClick={() => {
                              setSelectedPin(room);
                              if (googleMapRef.current) {
                                googleMapRef.current.panTo({ lat: room.lat, lng: room.lng });
                              }
                            }}
                            className="w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm mb-1">{room.title}</p>
                                <p className="text-xs text-gray-600">{room.location}</p>
                              </div>
                              <p className="text-sm text-[#81D9F7]">RM {room.price}</p>
                            </div>
                          </button>
                        ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button
                      onClick={() => onNavigate('room-search')}
                      variant="outline"
                      className="flex-1 rounded-lg"
                    >
                      View Details
                    </Button>
                    <Button
                      onClick={() => onNavigate('chat')}
                      className="flex-1 bg-[#81D9F7] hover:bg-[#6BC5E0] rounded-lg"
                    >
                      Contact
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Room List Sidebar - Desktop */}
        {showRoomList && mapLoaded && (
          <div className="w-96 bg-white shadow-lg overflow-hidden hidden lg:flex flex-col">
            {/* List Header */}
            <div className="p-4 border-b sticky top-0 bg-white z-10">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg">Available Rooms</h3>
                <button
                  onClick={() => setShowRoomList(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="text-sm text-gray-600">
                {filteredRooms.length} room{filteredRooms.length !== 1 ? 's' : ''} found
              </p>
            </div>

            {/* Scrollable Room List */}
            <div className="flex-1 overflow-y-auto">
              {filteredRooms.length > 0 ? (
                <div className="p-4 space-y-3">
                  {filteredRooms.map(room => (
                    <div
                      key={room.id}
                      onClick={() => handleRoomCardClick(room)}
                      className={`bg-white border-2 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-all ${
                        selectedPin?.id === room.id ? 'border-[#81D9F7] shadow-md' : 'border-gray-200'
                      }`}
                    >
                      {/* Room Image */}
                      <div className="aspect-video bg-gray-200 relative overflow-hidden">
                        <ImageWithFallback
                          src={room.image}
                          alt={room.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 right-2 bg-[#81D9F7] text-white px-2 py-1 rounded-full text-xs">
                          {room.distance} km
                        </div>
                      </div>

                      {/* Room Info */}
                      <div className="p-3">
                        <h4 className="mb-1">{room.title}</h4>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-[#81D9F7]">RM {room.price}/mo</p>
                          <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                            {room.roomType}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600 mb-2">
                          <MapPin className="h-3 w-3" />
                          <p className="text-xs">{room.location}</p>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {room.facilities.slice(0, 3).map((facility, i) => (
                            <span key={i} className="text-xs px-2 py-0.5 bg-gray-100 rounded">
                              {facility}
                            </span>
                          ))}
                          {room.facilities.length > 3 && (
                            <span className="text-xs px-2 py-0.5 bg-gray-100 rounded">
                              +{room.facilities.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <Home className="h-16 w-16 text-gray-300 mb-4" />
                  <h4 className="mb-2 text-gray-600">No rooms found</h4>
                  <p className="text-sm text-gray-500">Try adjusting your filters</p>
                  <Button
                    onClick={clearFilters}
                    className="mt-4 bg-[#81D9F7] hover:bg-[#6BC5E0]"
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mobile Room List Toggle */}
        {!showBottomSheet && mapLoaded && (
          <button
            onClick={() => setShowRoomList(!showRoomList)}
            className="lg:hidden fixed bottom-6 right-6 bg-[#81D9F7] text-white rounded-full px-4 py-3 shadow-lg flex items-center gap-2 z-20 hover:bg-[#6BC5E0] transition-colors"
          >
            <Home className="h-5 w-5" />
            <span className="text-sm">
              {filteredRooms.length} Room{filteredRooms.length !== 1 ? 's' : ''}
            </span>
          </button>
        )}

        {/* Mobile Room List Bottom Sheet */}
        {showRoomList && (
          <div className="lg:hidden fixed inset-x-0 bottom-0 bg-white rounded-t-2xl shadow-2xl z-25 max-h-[60vh] flex flex-col">
            {/* Handle */}
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto my-3" />

            {/* List Header */}
            <div className="px-4 pb-3 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg">Available Rooms</h3>
                  <p className="text-sm text-gray-600">
                    {filteredRooms.length} room{filteredRooms.length !== 1 ? 's' : ''} found
                  </p>
                </div>
                <button
                  onClick={() => setShowRoomList(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Room List */}
            <div className="flex-1 overflow-y-auto p-4">
              {filteredRooms.length > 0 ? (
                <div className="space-y-3">
                  {filteredRooms.map(room => (
                    <div
                      key={room.id}
                      onClick={() => {
                        handleRoomCardClick(room);
                        setShowRoomList(false);
                      }}
                      className={`bg-white border-2 rounded-lg overflow-hidden ${
                        selectedPin?.id === room.id ? 'border-[#81D9F7]' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex gap-3 p-3">
                        {/* Thumbnail */}
                        <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden shrink-0 relative">
                          <ImageWithFallback
                            src={room.image}
                            alt={room.title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                          <h4 className="mb-1 text-sm">{room.title}</h4>
                          <p className="text-[#81D9F7] mb-1 text-sm">RM {room.price}/mo</p>
                          <div className="flex items-center gap-1 text-gray-600 mb-1">
                            <MapPin className="h-3 w-3" />
                            <p className="text-xs">{room.location} • {room.distance}km</p>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {room.facilities.slice(0, 2).map((facility, i) => (
                              <span key={i} className="text-xs px-2 py-0.5 bg-gray-100 rounded">
                                {facility}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Home className="h-16 w-16 text-gray-300 mb-4" />
                  <h4 className="mb-2 text-gray-600">No rooms found</h4>
                  <p className="text-sm text-gray-500 mb-4">Try adjusting your filters</p>
                  <Button
                    onClick={() => {
                      clearFilters();
                      setShowRoomList(false);
                    }}
                    className="bg-[#81D9F7] hover:bg-[#6BC5E0]"
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Filters Modal */}
      {showFilters && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg">Filters</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
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
                <Label className="text-sm mb-3 block">Room Types</Label>
                <div className="space-y-2">
                  {allRoomTypes.map(type => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={type}
                        checked={selectedRoomTypes.includes(type)}
                        onCheckedChange={() => toggleRoomType(type)}
                      />
                      <label htmlFor={type} className="text-sm cursor-pointer">
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Facilities */}
              <div>
                <Label className="text-sm mb-3 block">Facilities</Label>
                <div className="space-y-2">
                  {allFacilities.map(facility => (
                    <div key={facility} className="flex items-center space-x-2">
                      <Checkbox
                        id={facility}
                        checked={selectedFacilities.includes(facility)}
                        onCheckedChange={() => toggleFacility(facility)}
                      />
                      <label htmlFor={facility} className="text-sm cursor-pointer">
                        {facility}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white p-6 border-t space-y-3">
              <Button
                onClick={() => setShowFilters(false)}
                className="w-full bg-[#81D9F7] hover:bg-[#6BC5E0] rounded-lg"
              >
                Apply Filters
              </Button>
              <Button
                onClick={clearFilters}
                variant="outline"
                className="w-full rounded-lg"
              >
                Clear All Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}