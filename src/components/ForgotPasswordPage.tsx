import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ArrowLeft, Mail, Lock } from 'lucide-react';

type ForgotPasswordPageProps = {
  onNavigateToLogin: () => void;
};

export function ForgotPasswordPage({ onNavigateToLogin }: ForgotPasswordPageProps) {
  const [step, setStep] = useState<'email' | 'otp' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock OTP send
    setStep('otp');
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock OTP verification
    setStep('reset');
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    // Mock password reset
    alert('Password reset successful!');
    onNavigateToLogin();
  };

  const handleOTPChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#FAFAFA] p-6">
      <div className="flex-1 flex flex-col justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <button
            onClick={onNavigateToLogin}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </button>

          {step === 'email' && (
            <>
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#81D9F7]/10 rounded-full mb-4">
                  <Mail className="h-8 w-8 text-[#81D9F7]" />
                </div>
                <h2 className="mb-2">Forgot Password?</h2>
                <p className="text-gray-600 text-sm">
                  Enter your email and we'll send you a verification code
                </p>
              </div>

              <form onSubmit={handleSendOTP} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
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

                <Button
                  type="submit"
                  className="w-full bg-[#81D9F7] hover:bg-[#6BC5E0] rounded-lg h-11"
                >
                  Send Verification Code
                </Button>
              </form>
            </>
          )}

          {step === 'otp' && (
            <>
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#81D9F7]/10 rounded-full mb-4">
                  <Mail className="h-8 w-8 text-[#81D9F7]" />
                </div>
                <h2 className="mb-2">Verify Your Email</h2>
                <p className="text-gray-600 text-sm">
                  We've sent a 6-digit code to <br />
                  <span className="text-gray-800">{email}</span>
                </p>
              </div>

              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div className="space-y-2">
                  <Label>Enter Verification Code</Label>
                  <div className="flex gap-2 justify-center">
                    {otp.map((digit, index) => (
                      <Input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOTPChange(index, e.target.value)}
                        className="w-12 h-12 text-center rounded-lg"
                      />
                    ))}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#81D9F7] hover:bg-[#6BC5E0] rounded-lg h-11"
                >
                  Verify Code
                </Button>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Didn't receive the code?{' '}
                    <button
                      type="button"
                      onClick={() => alert('OTP resent!')}
                      className="text-[#81D9F7] hover:underline"
                    >
                      Resend
                    </button>
                  </p>
                </div>
              </form>
            </>
          )}

          {step === 'reset' && (
            <>
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#81D9F7]/10 rounded-full mb-4">
                  <Lock className="h-8 w-8 text-[#81D9F7]" />
                </div>
                <h2 className="mb-2">Reset Password</h2>
                <p className="text-gray-600 text-sm">
                  Create a new secure password
                </p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="rounded-lg h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="rounded-lg h-11"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#81D9F7] hover:bg-[#6BC5E0] rounded-lg h-11"
                >
                  Reset Password
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}