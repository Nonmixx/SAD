import { useState } from 'react';
import { X, Heart, MapPin, Phone, Mail, Calendar, ChevronLeft, ChevronRight, Home, Wifi, Wind, Bed, Lamp, Car, WashingMachine, Check } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';

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

type RoomDetailsModalProps = {
  room: Room;
  onClose: () => void;
  onToggleSave: () => void;
  isLiked: boolean;
};

const facilityIcons: any = {
  'Wi-Fi': Wifi,
  'Aircon': Wind,
  'Furniture': Bed,
  'Study Desk': Lamp,
  'Parking': Car,
  'Washing Machine': WashingMachine,
};

export function RoomDetailsModal({ room, onClose, onToggleSave, isLiked }: RoomDetailsModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % Math.max(1, room.photos.length));
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + Math.max(1, room.photos.length)) % Math.max(1, room.photos.length));
  };

  const reviews = [
    { name: 'Sarah L.', rating: 5, comment: 'Great location and very clean!', date: '2 weeks ago' },
    { name: 'Mike T.', rating: 4, comment: 'Good value for money. Landlord is responsive.', date: '1 month ago' },
    { name: 'Amy K.', rating: 5, comment: 'Love living here! Close to campus.', date: '2 months ago' },
  ];

  const nearbyPlaces = [
    { name: 'University of Malaya', distance: room.distance, type: 'University' },
    { name: 'LRT Kerinchi Station', distance: 0.5, type: 'Transport' },
    { name: '7-Eleven', distance: 0.2, type: 'Convenience' },
    { name: 'Mid Valley Megamall', distance: 1.5, type: 'Shopping' },
  ];

  return (
    <div className="absolute inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-white shrink-0">
        <div className="w-10"></div>
        <h2 className="flex-1 text-center">{room.title}</h2>
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Image Carousel */}
        <div className="relative aspect-video bg-gray-200 rounded-xl mb-4 overflow-hidden">
          {room.photos.length > 0 ? (
            <ImageWithFallback
              src={room.photos[currentImageIndex]}
              alt={room.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Home className="h-16 w-16 text-gray-400" />
            </div>
          )}
          {room.photos.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white shadow-lg z-10"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white shadow-lg z-10"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white px-2 py-0.5 rounded-full text-xs">
                {currentImageIndex + 1} / {room.photos.length}
              </div>
            </>
          )}
        </div>

        {/* Primary Info */}
        <div className="mb-4">
          <p className="text-[#81D9F7] text-xl mb-2">RM {room.price}/month</p>
          <div className="flex items-center gap-2 text-gray-600 mb-2 text-sm">
            <MapPin className="h-4 w-4" />
            <span>{room.location} • {room.distance} km from UM</span>
          </div>
          <div className="flex gap-3 text-gray-600 text-sm">
            <span>{room.bedrooms} Bedroom{room.bedrooms > 1 ? 's' : ''}</span>
            <span>•</span>
            <span>{room.bathrooms} Bathroom{room.bathrooms > 1 ? 's' : ''}</span>
            <span>•</span>
            <span>{room.roomType}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mb-4">
          <Button className="flex-1 bg-[#81D9F7] hover:bg-[#6BC5E0] rounded-lg">
            <Phone className="h-4 w-4 mr-2" />
            Contact
          </Button>
          <Button className="flex-1 bg-green-600 hover:bg-green-700 rounded-lg">
            <Calendar className="h-4 w-4 mr-2" />
            Book
          </Button>
        </div>

        {/* Facilities */}
        <div className="mb-4">
          <h3 className="mb-3 text-base">Facilities</h3>
          <div className="grid grid-cols-2 gap-2">
            {room.facilities.map((facility, index) => {
              const Icon = facilityIcons[facility] || Check;
              return (
                <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-[#81D9F7]/10 rounded-lg flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 text-[#81D9F7]" />
                  </div>
                  <span className="text-sm">{facility}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <h3 className="mb-2 text-base">About this property</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{room.description}</p>
        </div>

        {/* Detailed Room Info Table */}
        <div className="mb-4">
          <h3 className="mb-3 text-base">Property Details</h3>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b">
                  <td className="p-3 bg-gray-50">Property Type</td>
                  <td className="p-3">{room.roomType}</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 bg-gray-50">Monthly Rent</td>
                  <td className="p-3">RM {room.price}</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 bg-gray-50">Deposit</td>
                  <td className="p-3">RM {room.price * 2} (2 months)</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 bg-gray-50">Minimum Lease</td>
                  <td className="p-3">6 months</td>
                </tr>
                <tr>
                  <td className="p-3 bg-gray-50">Available From</td>
                  <td className="p-3">Immediately</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Nearby Transport & Amenities */}
        <div className="mb-4">
          <h3 className="mb-3 text-base">Nearby Places</h3>
          <div className="space-y-2">
            {nearbyPlaces.map((place, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm">{place.name}</p>
                    <p className="text-xs text-gray-500">{place.type}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-600">{place.distance} km</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base">Reviews</h3>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-[#81D9F7]">4.7</span>
              <span className="text-gray-600">({reviews.length} reviews)</span>
            </div>
          </div>
          <div className="space-y-3">
            {reviews.map((review, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-[#81D9F7] rounded-full flex items-center justify-center text-white text-xs">
                      {review.name[0]}
                    </div>
                    <span className="text-sm">{review.name}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <span className="text-yellow-500">★</span>
                    <span>{review.rating}.0</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-1">{review.comment}</p>
                <p className="text-xs text-gray-500">{review.date}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Policies */}
        <div className="mb-4">
          <h3 className="mb-3 text-base">House Rules & Policies</h3>
          <div className="bg-gray-50 p-3 rounded-lg space-y-2">
            <div className="flex items-start gap-2">
              <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
              <p className="text-gray-700 text-sm">No smoking inside the property</p>
            </div>
            <div className="flex items-start gap-2">
              <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
              <p className="text-gray-700 text-sm">Visitors allowed with prior notice</p>
            </div>
            <div className="flex items-start gap-2">
              <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
              <p className="text-gray-700 text-sm">Utilities included in rent</p>
            </div>
            <div className="flex items-start gap-2">
              <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
              <p className="text-gray-700 text-sm">24/7 security available</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t bg-white shrink-0">
        <div className="flex gap-2">
          <Button
            onClick={onToggleSave}
            variant="outline"
            className="flex-1 rounded-lg"
          >
            <Heart className={`h-4 w-4 mr-2 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
            {isLiked ? 'Saved' : 'Save'}
          </Button>
          <Button className="flex-1 bg-[#81D9F7] hover:bg-[#6BC5E0] rounded-lg">
            <Mail className="h-4 w-4 mr-2" />
            Message
          </Button>
        </div>
      </div>
    </div>
  );
}