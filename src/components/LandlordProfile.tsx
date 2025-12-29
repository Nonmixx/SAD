import { useState } from 'react';
import { ArrowLeft, Upload, User, LogOut, Building2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

type User = {
  id: string;
  email: string;
  fullName: string;
  userType: 'student' | 'landlord';
  phone: string;
  dateOfBirth: string;
  profilePicture?: string;
  bio?: string;
  companyName?: string;
  businessRegistration?: string;
  address?: string;
};

type LandlordProfileProps = {
  user: User;
  onNavigate: (page: any) => void;
  onLogout: () => void;
  onUpdateUser: (user: User) => void;
};

export function LandlordProfile({ user, onNavigate, onLogout, onUpdateUser }: LandlordProfileProps) {
  const [profileData, setProfileData] = useState<User>(user);

  const updateField = (field: string, value: any) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onUpdateUser(profileData);
    
    // Also update in localStorage
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const updatedUsers = registeredUsers.map((u: any) => 
      u.id === profileData.id ? { ...u, ...profileData } : u
    );
    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
    localStorage.setItem('currentUser', JSON.stringify(profileData));
    
    alert('Profile updated successfully!');
  };

  return (
    <div className="h-full flex flex-col bg-[#FAFAFA]">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('landlord-dashboard')}
              className="text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h2 className="text-base">Landlord Profile</h2>
          </div>
          <Button
            onClick={onLogout}
            variant="ghost"
            size="sm"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto px-4 py-4">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          {/* Profile Picture */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative mb-3">
              <div className="w-24 h-24 bg-[#81D9F7] rounded-full flex items-center justify-center text-white overflow-hidden">
                {profileData.profilePicture ? (
                  <img
                    src={profileData.profilePicture}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Building2 className="h-12 w-12" />
                )}
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border-2 border-white">
                <Upload className="h-3 w-3 text-gray-600" />
              </button>
            </div>
            <h3 className="text-base">{profileData.fullName}</h3>
            <p className="text-gray-600 text-sm">{profileData.email}</p>
          </div>

          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm mb-3">Personal Information</h3>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-xs">Full Name</Label>
                  <Input
                    value={profileData.fullName}
                    onChange={(e) => updateField('fullName', e.target.value)}
                    className="rounded-lg h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Email</Label>
                  <Input
                    value={profileData.email}
                    disabled
                    className="rounded-lg h-10 bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Phone Number</Label>
                  <Input
                    value={profileData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    className="rounded-lg h-10"
                  />
                </div>
              </div>
            </div>

            {/* Business Information */}
            <div>
              <h3 className="text-sm mb-3">Business Information (Optional)</h3>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-xs">Company/Business Name</Label>
                  <Input
                    value={profileData.companyName || ''}
                    onChange={(e) => updateField('companyName', e.target.value)}
                    placeholder="e.g., ABC Properties Sdn Bhd"
                    className="rounded-lg h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Business Registration Number</Label>
                  <Input
                    value={profileData.businessRegistration || ''}
                    onChange={(e) => updateField('businessRegistration', e.target.value)}
                    placeholder="e.g., 202001234567"
                    className="rounded-lg h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Office Address</Label>
                  <Textarea
                    value={profileData.address || ''}
                    onChange={(e) => updateField('address', e.target.value)}
                    placeholder="Enter your office address"
                    rows={3}
                    className="rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label className="text-xs">About/Bio</Label>
              <Textarea
                value={profileData.bio || ''}
                onChange={(e) => updateField('bio', e.target.value)}
                placeholder="Tell students about yourself and your properties..."
                rows={4}
                className="rounded-lg"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => onNavigate('landlord-dashboard')}
                variant="outline"
                className="flex-1 rounded-lg h-10"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="flex-1 bg-[#81D9F7] hover:bg-[#6BC5E0] rounded-lg h-10"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
