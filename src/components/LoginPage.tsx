import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Eye, EyeOff } from 'lucide-react';

type LoginPageProps = {
  onLogin: (email: string, password: string) => void;
  onNavigateToRegister: () => void;
  onNavigateToForgotPassword: () => void;
};

export function LoginPage({ onLogin, onNavigateToRegister, onNavigateToForgotPassword }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-[#81D9F7]/10 to-[#FAFAFA] p-6">
      <div className="flex-1 flex flex-col justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="text-center mb-6">
            <h1 className="text-[#81D9F7] text-3xl mb-2">ROOMEO</h1>
            <p className="text-gray-600 text-sm">Find Your Perfect Room & Roommate</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-lg h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="rounded-lg pr-10 h-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={onNavigateToForgotPassword}
                className="text-sm text-[#81D9F7] hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#81D9F7] hover:bg-[#6BC5E0] rounded-lg h-11"
            >
              Login
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={onNavigateToRegister}
                className="text-[#81D9F7] hover:underline"
              >
                Register here
              </button>
            </p>
          </div>

          <div className="mt-6 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 text-center mb-2">Demo Accounts:</p>
            <p className="text-xs text-gray-600">Student: student@um.edu.my</p>
            <p className="text-xs text-gray-600">Landlord: landlord@property.com</p>
            <p className="text-xs text-gray-600">Password: password123</p>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Or register a new account - the system will remember your role!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}