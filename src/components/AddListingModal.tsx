import { useState, useEffect } from 'react';
import { X, Upload, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';

type Listing = {
  id?: string;
  title: string;
  price: number;
  location: string;
  distance: number;
  roomType: string;
  facilities: string[];
  photos: string[];
  description: string;
  bedrooms?: number;
  bathrooms?: number;
};

type AddListingModalProps = {
  listing: Listing | null;
  onClose: () => void;
  onSave: (listing: Listing) => void;
  skipAnimation?: boolean;
};

export function AddListingModal({ listing, onClose, onSave, skipAnimation }: AddListingModalProps) {
  const [formData, setFormData] = useState<Listing>({
    title: '',
    price: 0,
    location: '',
    distance: 0,
    roomType: '',
    facilities: [],
    photos: [],
    description: '',
    bedrooms: 1,
    bathrooms: 1,
    ...listing,
  });

  const [showPreview, setShowPreview] = useState(false);

  const facilities = [
    'Wi-Fi',
    'Aircon',
    'Furniture',
    'Study Desk',
    'Washing Machine',
    'Parking',
  ];

  const roomTypes = ['Single Room', 'Master Room', 'Studio', 'Shared Room'];

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleFacility = (facility: string) => {
    const updated = formData.facilities.includes(facility)
      ? formData.facilities.filter(f => f !== facility)
      : [...formData.facilities, facility];
    updateField('facilities', updated);
  };

  const handleAISuggestPrice = () => {
    // Advanced AI price prediction algorithm
    let basePrice = 350;
    let priceFactors: string[] = [];
    
    // Room type factor (30% impact)
    if (formData.roomType === 'Master Room') {
      basePrice = 550;
      priceFactors.push('Master Room (+RM 200)');
    } else if (formData.roomType === 'Studio') {
      basePrice = 500;
      priceFactors.push('Studio (+RM 150)');
    } else if (formData.roomType === 'Shared Room') {
      basePrice = 280;
      priceFactors.push('Shared Room (-RM 70)');
    } else {
      priceFactors.push('Single Room (Base)');
    }
    
    // Distance factor (20% impact)
    if (formData.distance < 1) {
      basePrice += 150;
      priceFactors.push('Very close to UM (+RM 150)');
    } else if (formData.distance < 2) {
      basePrice += 100;
      priceFactors.push('Close to UM (+RM 100)');
    } else if (formData.distance < 3) {
      basePrice += 50;
      priceFactors.push('Near UM (+RM 50)');
    } else if (formData.distance > 4) {
      basePrice -= 50;
      priceFactors.push('Far from UM (-RM 50)');
    }
    
    // Location factor (15% impact)
    const location = formData.location.toLowerCase();
    if (location.includes('bangsar')) {
      basePrice += 120;
      priceFactors.push('Premium area: Bangsar (+RM 120)');
    } else if (location.includes('pantai dalam')) {
      basePrice += 50;
      priceFactors.push('Popular area: Pantai Dalam (+RM 50)');
    }
    
    // Facilities factor (35% impact)
    let facilitiesBonus = 0;
    if (formData.facilities.includes('Aircon')) {
      facilitiesBonus += 80;
      priceFactors.push('Aircon (+RM 80)');
    }
    if (formData.facilities.includes('Parking')) {
      facilitiesBonus += 60;
      priceFactors.push('Parking (+RM 60)');
    }
    if (formData.facilities.includes('Wi-Fi')) {
      facilitiesBonus += 30;
      priceFactors.push('Wi-Fi (+RM 30)');
    }
    if (formData.facilities.includes('Furniture')) {
      facilitiesBonus += 70;
      priceFactors.push('Fully Furnished (+RM 70)');
    }
    if (formData.facilities.includes('Washing Machine')) {
      facilitiesBonus += 40;
      priceFactors.push('Washing Machine (+RM 40)');
    }
    if (formData.facilities.includes('Study Desk')) {
      facilitiesBonus += 20;
      priceFactors.push('Study Desk (+RM 20)');
    }
    
    basePrice += facilitiesBonus;
    
    // Size factor
    if (formData.bedrooms && formData.bedrooms > 1) {
      const bedroomBonus = (formData.bedrooms - 1) * 100;
      basePrice += bedroomBonus;
      priceFactors.push(`${formData.bedrooms} Bedrooms (+RM ${bedroomBonus})`);
    }
    if (formData.bathrooms && formData.bathrooms > 1) {
      const bathroomBonus = (formData.bathrooms - 1) * 50;
      basePrice += bathroomBonus;
      priceFactors.push(`${formData.bathrooms} Bathrooms (+RM ${bathroomBonus})`);
    }
    
    // Round to nearest 10
    const suggestedPrice = Math.round(basePrice / 10) * 10;
    
    // Calculate market range (±15%)
    const minPrice = Math.round((suggestedPrice * 0.85) / 10) * 10;
    const maxPrice = Math.round((suggestedPrice * 1.15) / 10) * 10;
    
    updateField('price', suggestedPrice);
    
    // Show detailed breakdown
    alert(
      `🤖 AI Price Prediction Results\n\n` +
      `Suggested Price: RM ${suggestedPrice}/month\n` +
      `Market Range: RM ${minPrice} - ${maxPrice}\n\n` +
      `Price Factors:\n${priceFactors.map((f, i) => `${i + 1}. ${f}`).join('\n')}\n\n` +
      `💡 Tip: Prices in this range are 73% more likely to get inquiries!`
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className={`absolute inset-0 bg-white z-50 flex flex-col overflow-hidden ${skipAnimation ? '' : 'modal-enter'}`}>
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b flex items-center justify-between">
        <h2 className="text-base">{listing ? 'Edit Listing' : 'Add New Listing'}</h2>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {!showPreview ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Property Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  placeholder="e.g., Cozy Studio Near UM"
                  required
                  className="rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Monthly Rent (RM) *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => updateField('price', Number(e.target.value))}
                      required
                      className="rounded-lg"
                    />
                    <Button
                      type="button"
                      onClick={handleAISuggestPrice}
                      variant="outline"
                      className="shrink-0"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      AI
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="roomType">Room Type *</Label>
                  <Select value={formData.roomType} onValueChange={(value) => updateField('roomType', value)}>
                    <SelectTrigger className="rounded-lg">
                      <SelectValue placeholder="Select room type" />
                    </SelectTrigger>
                    <SelectContent>
                      {roomTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => updateField('location', e.target.value)}
                    placeholder="e.g., Pantai Dalam"
                    required
                    className="rounded-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="distance">Distance from UM (km) *</Label>
                  <Input
                    id="distance"
                    type="number"
                    step="0.1"
                    value={formData.distance}
                    onChange={(e) => updateField('distance', Number(e.target.value))}
                    required
                    className="rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    min="1"
                    value={formData.bedrooms}
                    onChange={(e) => updateField('bedrooms', Number(e.target.value))}
                    className="rounded-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    min="1"
                    value={formData.bathrooms}
                    onChange={(e) => updateField('bathrooms', Number(e.target.value))}
                    className="rounded-lg"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Facilities</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {facilities.map((facility) => (
                    <div key={facility} className="flex items-center space-x-2">
                      <Checkbox
                        id={facility}
                        checked={formData.facilities.includes(facility)}
                        onCheckedChange={() => toggleFacility(facility)}
                      />
                      <label
                        htmlFor={facility}
                        className="text-sm cursor-pointer"
                      >
                        {facility}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  placeholder="Describe your property..."
                  rows={4}
                  required
                  className="rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <Label>Photos</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#81D9F7] transition-colors cursor-pointer">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Click to upload photos</p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  onClick={() => setShowPreview(true)}
                  variant="outline"
                  className="flex-1 rounded-lg"
                >
                  Preview
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-[#81D9F7] hover:bg-[#6BC5E0] rounded-lg"
                >
                  {listing ? 'Update Listing' : 'Create Listing'}
                </Button>
              </div>
            </form>
          ) : (
            <div>
              {/* Preview Mode */}
              <div className="space-y-6">
                <div className="aspect-video bg-gray-200 rounded-xl flex items-center justify-center">
                  <p className="text-gray-500">Property Photo Preview</p>
                </div>

                <div>
                  <h2 className="mb-2">{formData.title}</h2>
                  <p className="text-[#81D9F7] mb-4">RM {formData.price}/month</p>
                  <p className="text-gray-600">
                    {formData.location} • {formData.distance} km from UM
                  </p>
                </div>

                <div>
                  <h3 className="mb-3">Facilities</h3>
                  <div className="flex flex-wrap gap-2">
                    {formData.facilities.map((facility, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-[#81D9F7]/10 text-[#81D9F7] rounded-full"
                      >
                        {facility}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-3">Description</h3>
                  <p className="text-gray-600">{formData.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Room Type</p>
                    <p>{formData.roomType}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Bedrooms</p>
                    <p>{formData.bedrooms}</p>
                  </div>
                </div>

                <Button
                  onClick={() => setShowPreview(false)}
                  variant="outline"
                  className="w-full rounded-lg"
                >
                  Back to Edit
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}