import { Building2, GraduationCap } from 'lucide-react';
import { Button } from './ui/button';

type RoleSelectionPageProps = {
  onSelectRole: (role: 'student' | 'landlord') => void;
  onBack: () => void;
};

export function RoleSelectionPage({ onSelectRole, onBack }: RoleSelectionPageProps) {
  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-[#81D9F7]/10 to-[#FAFAFA] p-6">
      <div className="flex-1 flex flex-col justify-center">
        <div className="text-center mb-6">
          <h1 className="text-[#81D9F7] mb-2">ROOMEO</h1>
          <p className="text-gray-600 text-sm">Choose your account type</p>
        </div>

        <div className="space-y-3">
          {/* Student Option */}
          <button
            onClick={() => onSelectRole('student')}
            className="w-full bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition-all active:scale-95 border-2 border-transparent hover:border-[#81D9F7]"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 bg-[#81D9F7]/10 rounded-full flex items-center justify-center">
                <GraduationCap className="h-8 w-8 text-[#81D9F7]" />
              </div>
              <div className="text-center">
                <h3 className="mb-1">I'm a Student</h3>
                <p className="text-sm text-gray-600">
                  Find rooms, search for roommates, and connect with landlords
                </p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="px-2.5 py-1 bg-gray-100 rounded-full text-xs">Search Rooms</span>
                <span className="px-2.5 py-1 bg-gray-100 rounded-full text-xs">Find Roommates</span>
                <span className="px-2.5 py-1 bg-gray-100 rounded-full text-xs">AI Assistant</span>
              </div>
            </div>
          </button>

          {/* Landlord Option */}
          <button
            onClick={() => onSelectRole('landlord')}
            className="w-full bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition-all active:scale-95 border-2 border-transparent hover:border-[#81D9F7]"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center">
                <Building2 className="h-8 w-8 text-purple-600" />
              </div>
              <div className="text-center">
                <h3 className="mb-1">I'm a Landlord</h3>
                <p className="text-sm text-gray-600">
                  List properties, manage tenants, and grow your business
                </p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="px-2.5 py-1 bg-gray-100 rounded-full text-xs">List Rooms</span>
                <span className="px-2.5 py-1 bg-gray-100 rounded-full text-xs">Manage Tenants</span>
                <span className="px-2.5 py-1 bg-gray-100 rounded-full text-xs">Analytics</span>
              </div>
            </div>
          </button>
        </div>

        <div className="mt-5 text-center">
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-gray-600"
          >
            Back to Login
          </Button>
        </div>
      </div>
    </div>
  );
}