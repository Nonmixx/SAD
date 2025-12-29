import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Checkbox } from './ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';

type FilterModalProps = {
  onClose: () => void;
  onApply: (filters: any) => void;
  initialFilters?: any;
};

export function FilterModal({ onClose, onApply, initialFilters }: FilterModalProps) {
  const [filters, setFilters] = useState(initialFilters || {
    priceRange: [0, 1000],
    maxDistance: 5,
    roomTypes: [] as string[],
    facilities: [] as string[],
    bedrooms: 'any',
    bathrooms: 'any',
    leaseDuration: 'any',
    availableNow: false,
    sortBy: 'relevance',
    keyword: '',
  });

  const roomTypes = ['Single Room', 'Master Room', 'Studio', 'Shared Room'];
  const facilities = ['Wi-Fi', 'Aircon', 'Furniture', 'Study Desk', 'Washing Machine', 'Parking'];

  const updateFilter = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleRoomType = (type: string) => {
    const updated = filters.roomTypes.includes(type)
      ? filters.roomTypes.filter(t => t !== type)
      : [...filters.roomTypes, type];
    updateFilter('roomTypes', updated);
  };

  const toggleFacility = (facility: string) => {
    const updated = filters.facilities.includes(facility)
      ? filters.facilities.filter(f => f !== facility)
      : [...filters.facilities, facility];
    updateFilter('facilities', updated);
  };

  const handleReset = () => {
    setFilters({
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
  };

  const handleApply = () => {
    onApply(filters);
  };

  return (
    <div className="absolute inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center p-4 border-b gap-3">
        <button
          onClick={onClose}
          className="text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="flex-1">Filters</h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-5">
          {/* Price Range */}
          <div className="space-y-2">
            <Label className="text-sm">Price Range (RM/month)</Label>
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => updateFilter('priceRange', value)}
              min={0}
              max={2000}
              step={50}
              className="w-full"
            />
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>RM {filters.priceRange[0]}</span>
              <span>RM {filters.priceRange[1]}</span>
            </div>
          </div>

          {/* Distance */}
          <div className="space-y-2">
            <Label className="text-sm">Maximum Distance from UM (km)</Label>
            <Slider
              value={[filters.maxDistance]}
              onValueChange={(value) => updateFilter('maxDistance', value[0])}
              min={0}
              max={10}
              step={0.5}
              className="w-full"
            />
            <div className="text-xs text-gray-600">
              Up to {filters.maxDistance} km
            </div>
          </div>

          {/* Room Type */}
          <div className="space-y-2">
            <Label className="text-sm">Room Type</Label>
            <div className="grid grid-cols-2 gap-2">
              {roomTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => toggleRoomType(type)}
                  className={`p-2 rounded-lg border-2 transition-all text-sm ${
                    filters.roomTypes.includes(type)
                      ? 'border-[#81D9F7] bg-[#81D9F7]/10'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Facilities */}
          <div className="space-y-2">
            <Label className="text-sm">Facilities</Label>
            <div className="grid grid-cols-2 gap-2">
              {facilities.map((facility) => (
                <div key={facility} className="flex items-center space-x-2">
                  <Checkbox
                    id={`filter-${facility}`}
                    checked={filters.facilities.includes(facility)}
                    onCheckedChange={() => toggleFacility(facility)}
                  />
                  <label htmlFor={`filter-${facility}`} className="text-sm cursor-pointer">
                    {facility}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Bedrooms & Bathrooms */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-sm">Bedrooms</Label>
              <Select value={filters.bedrooms} onValueChange={(value) => updateFilter('bedrooms', value)}>
                <SelectTrigger className="rounded-lg h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Bathrooms</Label>
              <Select value={filters.bathrooms} onValueChange={(value) => updateFilter('bathrooms', value)}>
                <SelectTrigger className="rounded-lg h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Lease Duration */}
          <div className="space-y-2">
            <Label className="text-sm">Lease Duration</Label>
            <Select value={filters.leaseDuration} onValueChange={(value) => updateFilter('leaseDuration', value)}>
              <SelectTrigger className="rounded-lg h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="3">3 months</SelectItem>
                <SelectItem value="6">6 months</SelectItem>
                <SelectItem value="12">12 months</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Availability */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="availableNow"
              checked={filters.availableNow}
              onCheckedChange={(checked) => updateFilter('availableNow', checked)}
            />
            <label htmlFor="availableNow" className="text-sm cursor-pointer">
              Available immediately
            </label>
          </div>

          {/* Sort By */}
          <div className="space-y-2">
            <Label className="text-sm">Sort By</Label>
            <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
              <SelectTrigger className="rounded-lg h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Most Relevant</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="distance">Distance: Nearest</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Advanced Keyword */}
          <div className="space-y-2">
            <Label className="text-sm">Keyword Search</Label>
            <Input
              value={filters.keyword}
              onChange={(e) => updateFilter('keyword', e.target.value)}
              placeholder="e.g., balcony, gym, pool..."
              className="rounded-lg h-10"
            />
          </div>
        </div>
      </div>

      {/* Footer - Sticky Buttons */}
      <div className="flex-shrink-0 p-4 border-t bg-white flex gap-2">
        <Button
          onClick={handleReset}
          variant="outline"
          className="flex-1 rounded-lg h-11"
        >
          Reset
        </Button>
        <Button
          onClick={handleApply}
          className="flex-1 bg-[#81D9F7] hover:bg-[#6BC5E0] rounded-lg h-11"
        >
          Apply
        </Button>
      </div>
    </div>
  );
}