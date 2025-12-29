import { useState } from 'react';
import { ArrowLeft, Upload, User, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Slider } from './ui/slider';

type User = {
  id: string;
  email: string;
  fullName: string;
  userType: 'student' | 'landlord';
  phone: string;
  dateOfBirth: string;
  faculty?: string;
  course?: string;
  yearOfStudy?: number;
  profilePicture?: string;
  budget?: { min: number; max: number };
  cleanliness?: string;
  lifestyle?: string[];
  bio?: string;
  gender?: string;
  smokingPreference?: string;
  sleepSchedule?: string;
};

type StudentProfileProps = {
  user: User;
  onNavigate: (page: any) => void;
  onLogout: () => void;
  onUpdateUser: (user: User) => void;
};

export function StudentProfile({ user, onNavigate, onLogout, onUpdateUser }: StudentProfileProps) {
  const [profileData, setProfileData] = useState<User>(user);
  const [budgetRange, setBudgetRange] = useState([
    user.budget?.min || 0,
    user.budget?.max || 1000,
  ]);

  const lifestyleOptions = [
    'Early Bird',
    'Night Owl',
    'Social',
    'Quiet',
    'Non-Smoker',
    'Pet Friendly',
    'Fitness Enthusiast',
    'Foodie',
  ];

  const updateField = (field: string, value: any) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const toggleLifestyle = (option: string) => {
    const current = profileData.lifestyle || [];
    const updated = current.includes(option)
      ? current.filter(l => l !== option)
      : [...current, option];
    updateField('lifestyle', updated);
  };

  const handleSave = () => {
    const updatedUser = {
      ...profileData,
      budget: { min: budgetRange[0], max: budgetRange[1] },
    };
    onUpdateUser(updatedUser);
    
    // Also update in localStorage
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const updatedUsers = registeredUsers.map((u: any) => 
      u.id === profileData.id ? { ...u, ...updatedUser } : u
    );
    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    alert('Profile updated successfully!');
  };

  return (
    <div className="h-full flex flex-col bg-[#FAFAFA]">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('student-dashboard')}
              className="text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h2>My Profile</h2>
          </div>
          <Button
            onClick={onLogout}
            variant="ghost"
            size="sm"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto px-4 py-4">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          {/* Profile Picture */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-4">
              <div className="w-32 h-32 bg-[#81D9F7] rounded-full flex items-center justify-center text-white overflow-hidden">
                {profileData.profilePicture ? (
                  <img
                    src={profileData.profilePicture}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-16 w-16" />
                )}
              </div>
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border-2 border-white">
                <Upload className="h-4 w-4 text-gray-600" />
              </button>
            </div>
            <h3>{profileData.fullName}</h3>
            <p className="text-gray-600">{profileData.email}</p>
          </div>

          {/* Basic Information */}
          <div className="space-y-6">
            <div>
              <h3 className="mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input
                    value={profileData.fullName}
                    onChange={(e) => updateField('fullName', e.target.value)}
                    className="rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input
                    value={profileData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    className="rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Faculty</Label>
                  <Input
                    value={profileData.faculty || ''}
                    onChange={(e) => updateField('faculty', e.target.value)}
                    className="rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Course/Programme</Label>
                  <Input
                    value={profileData.course || ''}
                    onChange={(e) => updateField('course', e.target.value)}
                    className="rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Year of Study</Label>
                  <Select
                    value={profileData.yearOfStudy?.toString() || ''}
                    onValueChange={(value) => updateField('yearOfStudy', Number(value))}
                  >
                    <SelectTrigger className="rounded-lg">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Year 1</SelectItem>
                      <SelectItem value="2">Year 2</SelectItem>
                      <SelectItem value="3">Year 3</SelectItem>
                      <SelectItem value="4">Year 4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select
                    value={profileData.gender || ''}
                    onValueChange={(value) => updateField('gender', value)}
                  >
                    <SelectTrigger className="rounded-lg">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label>About Me</Label>
              <Textarea
                value={profileData.bio || ''}
                onChange={(e) => updateField('bio', e.target.value)}
                placeholder="Tell us about yourself..."
                rows={4}
                className="rounded-lg"
              />
            </div>

            {/* Budget Range */}
            <div className="space-y-3">
              <Label>Budget Range (RM/month)</Label>
              <Slider
                value={budgetRange}
                onValueChange={setBudgetRange}
                min={0}
                max={2000}
                step={50}
                className="w-full"
              />
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>RM {budgetRange[0]}</span>
                <span>RM {budgetRange[1]}</span>
              </div>
            </div>

            {/* Cleanliness Habits */}
            <div className="space-y-2">
              <Label>Cleanliness Habits</Label>
              <Select
                value={profileData.cleanliness || ''}
                onValueChange={(value) => updateField('cleanliness', value)}
              >
                <SelectTrigger className="rounded-lg">
                  <SelectValue placeholder="Select cleanliness level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="very-neat">Very Neat & Organized</SelectItem>
                  <SelectItem value="neat">Generally Neat</SelectItem>
                  <SelectItem value="average">Average</SelectItem>
                  <SelectItem value="relaxed">Relaxed about cleanliness</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Smoking Preference */}
            <div className="space-y-2">
              <Label>Smoking Preference</Label>
              <Select
                value={profileData.smokingPreference || ''}
                onValueChange={(value) => updateField('smokingPreference', value)}
              >
                <SelectTrigger className="rounded-lg">
                  <SelectValue placeholder="Select preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="non-smoker">Non-smoker</SelectItem>
                  <SelectItem value="occasional">Occasional smoker</SelectItem>
                  <SelectItem value="smoker">Smoker</SelectItem>
                  <SelectItem value="no-preference">No preference</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sleep Schedule */}
            <div className="space-y-2">
              <Label>Sleep Schedule</Label>
              <Select
                value={profileData.sleepSchedule || ''}
                onValueChange={(value) => updateField('sleepSchedule', value)}
              >
                <SelectTrigger className="rounded-lg">
                  <SelectValue placeholder="Select schedule" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="early-bird">Early Bird (sleep before 11pm)</SelectItem>
                  <SelectItem value="moderate">Moderate (11pm - 1am)</SelectItem>
                  <SelectItem value="night-owl">Night Owl (after 1am)</SelectItem>
                  <SelectItem value="flexible">Flexible</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Lifestyle Preferences */}
            <div className="space-y-3">
              <Label>Lifestyle Preferences</Label>
              <p className="text-sm text-gray-600">Select all that apply</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {lifestyleOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={option}
                      checked={(profileData.lifestyle || []).includes(option)}
                      onCheckedChange={() => toggleLifestyle(option)}
                    />
                    <label htmlFor={option} className="text-sm cursor-pointer">
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-6">
              <Button
                onClick={() => onNavigate('student-dashboard')}
                variant="outline"
                className="flex-1 rounded-lg"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="flex-1 bg-[#81D9F7] hover:bg-[#6BC5E0] rounded-lg"
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