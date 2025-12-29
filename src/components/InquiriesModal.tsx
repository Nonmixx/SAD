import { User, MessageCircle, Bell, Home, Plus } from 'lucide-react';
import { Button } from './ui/button';

type Inquiry = {
  id: string;
  studentName: string;
  listingId: string;
  listingTitle: string;
  message: string;
  timestamp: string;
  read: boolean;
};

type InquiriesModalProps = {
  inquiries: Inquiry[];
  onClose: () => void;
  onReplyToInquiry: (inquiry: Inquiry) => void;
  onNavigateHome: () => void;
  onShowAddModal: () => void;
  onNavigateMessages: () => void;
};

export function InquiriesModal({ inquiries, onClose, onReplyToInquiry, onNavigateHome, onShowAddModal, onNavigateMessages }: InquiriesModalProps) {
  const unreadCount = inquiries.filter(inq => !inq.read).length;

  return (
    <div className="absolute inset-0 bg-white z-50 flex flex-col">
      <div className="flex-shrink-0 p-4 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base mb-1">Student Inquiries</h3>
            <p className="text-xs text-gray-600">
              {inquiries.length} total, {unreadCount} unread
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
          >
            ×
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-20">
        {inquiries.length > 0 ? (
          <div className="space-y-3">
            {inquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                className={`p-3 rounded-lg border-2 ${
                  inquiry.read ? 'border-gray-200 bg-white' : 'border-[#81D9F7]/30 bg-[#81D9F7]/5'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#81D9F7] rounded-full flex items-center justify-center text-white">
                      <User className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm">{inquiry.studentName}</p>
                      <p className="text-xs text-gray-500">{inquiry.timestamp}</p>
                    </div>
                  </div>
                  {!inquiry.read && (
                    <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                      New
                    </span>
                  )}
                </div>

                <div className="mb-2">
                  <p className="text-xs text-gray-500 mb-0.5">Regarding:</p>
                  <p className="text-xs text-[#81D9F7]">{inquiry.listingTitle}</p>
                </div>

                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-0.5">Message:</p>
                  <p className="text-xs text-gray-700">{inquiry.message}</p>
                </div>

                <Button
                  onClick={() => onReplyToInquiry(inquiry)}
                  className="w-full bg-[#81D9F7] hover:bg-[#6BC5E0] rounded-lg text-xs h-9"
                >
                  <MessageCircle className="h-3 w-3 mr-1" />
                  Reply to {inquiry.studentName}
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h4 className="mb-2 text-gray-600">No inquiries yet</h4>
            <p className="text-gray-500 text-sm">
              When students inquire about your listings, they'll appear here
            </p>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t shadow-lg">
        <div className="flex items-center justify-around py-2">
          <button
            onClick={onNavigateHome}
            className="flex flex-col items-center gap-1 px-3 py-1"
          >
            <Home className="h-5 w-5 text-gray-600" />
            <span className="text-xs text-gray-600">Home</span>
          </button>
          <button
            onClick={onShowAddModal}
            className="flex flex-col items-center gap-1 px-3 py-1"
          >
            <Plus className="h-5 w-5 text-gray-600" />
            <span className="text-xs text-gray-600">Add</span>
          </button>
          <button
            onClick={onNavigateMessages}
            className="flex flex-col items-center gap-1 px-3 py-1"
          >
            <MessageCircle className="h-5 w-5 text-gray-600" />
            <span className="text-xs text-gray-600">Messages</span>
          </button>
          <button
            onClick={onClose}
            className="flex flex-col items-center gap-1 px-3 py-1 relative"
          >
            <Bell className="h-5 w-5 text-[#81D9F7]" />
            <span className="text-xs text-[#81D9F7]">Inquiries</span>
            {unreadCount > 0 && (
              <span className="absolute top-0 right-2 w-4 h-4 bg-red-500 text-white rounded-full text-[9px] flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </nav>
    </div>
  );
}