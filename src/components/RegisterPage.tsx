import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Eye, EyeOff, Check, X } from 'lucide-react';

type RegisterPageProps = {
  onRegister: (userData: any) => void;
  onNavigateToLogin: () => void;
  userType: 'student' | 'landlord';
};

export function RegisterPage({ onRegister, onNavigateToLogin, userType }: RegisterPageProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    phone: '',
    userType: userType,
    faculty: '',
    course: '',
    yearOfStudy: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const calculateAge = (dob: string) => {
    if (!dob) return 0;
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];

  const passwordChecks = [
    { label: 'At least 8 characters', met: formData.password.length >= 8 },
    { label: 'Upper & lowercase letters', met: /[a-z]/.test(formData.password) && /[A-Z]/.test(formData.password) },
    { label: 'Contains a number', met: /[0-9]/.test(formData.password) },
    { label: 'Contains special character', met: /[^a-zA-Z0-9]/.test(formData.password) },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    // Show success message and navigate to login
    alert('Account created successfully! Please login to continue.');
    onNavigateToLogin();
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const age = calculateAge(formData.dateOfBirth);

  return (
    <div className="h-full overflow-auto p-4 py-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="text-center mb-6">
          <h1 className="text-[#81D9F7] mb-2">Create Account</h1>
          <p className="text-gray-600 text-sm">
            Join ROOMEO as a {userType === 'student' ? 'Student' : 'Landlord'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => updateField('fullName', e.target.value)}
                required
                className="rounded-lg h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                required
                className="rounded-lg h-11"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  required
                  className="rounded-lg pr-10 h-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {formData.password && (
                <div className="space-y-1">
                  <div className="flex gap-1">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded ${
                          i < passwordStrength ? strengthColors[passwordStrength - 1] : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  {passwordStrength > 0 && (
                    <p className="text-xs text-gray-600">{strengthLabels[passwordStrength - 1]}</p>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => updateField('confirmPassword', e.target.value)}
                  required
                  className="rounded-lg pr-10 h-11"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {formData.confirmPassword && (
                <div className="flex items-center gap-1 text-xs">
                  {formData.password === formData.confirmPassword ? (
                    <>
                      <Check className="h-3 w-3 text-green-500" />
                      <span className="text-green-500">Passwords match</span>
                    </>
                  ) : (
                    <>
                      <X className="h-3 w-3 text-red-500" />
                      <span className="text-red-500">Passwords don't match</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {formData.password && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-600 mb-2">Password requirements:</p>
              <div className="space-y-1">
                {passwordChecks.map((check, i) => (
                  <div key={i} className="flex items-center gap-1 text-xs">
                    {check.met ? (
                      <Check className="h-3 w-3 text-green-500" />
                    ) : (
                      <X className="h-3 w-3 text-gray-400" />
                    )}
                    <span className={check.met ? 'text-green-600' : 'text-gray-500'}>
                      {check.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth *</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => updateField('dateOfBirth', e.target.value)}
                required
                className="rounded-lg h-11"
              />
              {age > 0 && (
                <p className="text-xs text-gray-600">Age: {age} years old</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                required
                className="rounded-lg h-11"
              />
            </div>
          </div>

          {userType === 'student' && (
            <>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="faculty">Faculty *</Label>
                  <Select value={formData.faculty} onValueChange={(value) => updateField('faculty', value)}>
                    <SelectTrigger className="rounded-lg h-11">
                      <SelectValue placeholder="Select faculty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Science">Science</SelectItem>
                      <SelectItem value="Arts">Arts & Social Sciences</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                      <SelectItem value="Medicine">Medicine</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="course">Course/Programme *</Label>
                  <Input
                    id="course"
                    value={formData.course}
                    onChange={(e) => updateField('course', e.target.value)}
                    required={userType === 'student'}
                    className="rounded-lg h-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="yearOfStudy">Year of Study *</Label>
                <Select value={formData.yearOfStudy} onValueChange={(value) => updateField('yearOfStudy', value)}>
                  <SelectTrigger className="rounded-lg h-11">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Year 1</SelectItem>
                    <SelectItem value="2">Year 2</SelectItem>
                    <SelectItem value="3">Year 3</SelectItem>
                    <SelectItem value="4">Year 4</SelectItem>
                    <SelectItem value="5">Year 5+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {userType === 'landlord' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="company">Company/Organization (Optional)</Label>
                <Input
                  id="company"
                  value={formData.course}
                  onChange={(e) => updateField('course', e.target.value)}
                  className="rounded-lg h-11"
                  placeholder="Leave blank if individual landlord"
                />
              </div>
            </>
          )}

          <Button
            type="submit"
            className="w-full bg-[#81D9F7] hover:bg-[#6BC5E0] rounded-lg mt-6 h-11"
          >
            Create Account
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <button
              onClick={onNavigateToLogin}
              className="text-[#81D9F7] hover:underline"
            >
              Login here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}