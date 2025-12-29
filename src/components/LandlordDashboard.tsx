import { useState, forwardRef, useImperativeHandle, useEffect, useRef } from 'react';
import { Plus, Home, Edit, Trash2, Eye, LogOut, User, MessageCircle, Bell } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';

type User = {
  id: string;
  email: string;
  fullName: string;
  userType: 'student' | 'landlord';
  profilePicture?: string;
};

type Listing = {
  id: string;
  title: string;
  price: number;
  location: string;
  distance: number;
  roomType: string;
  facilities: string[];
  photos: string[];
  description: string;
  inquiries?: number;
  views?: number;
};

type Inquiry = {
  id: string;
  studentName: string;
  listingId: string;
  listingTitle: string;
  message: string;
  timestamp: string;
  read: boolean;
};

type LandlordDashboardProps = {
  user: User;
  onNavigate: (page: any, params?: any) => void;
  onLogout: () => void;
  skipAnimation?: boolean;
  listings: Listing[];
  setListings: (listings: Listing[]) => void;
  showAddModal: boolean;
  setShowAddModal: (show: boolean) => void;
  editingListing: Listing | null;
  setEditingListing: (listing: Listing | null) => void;
  onAddListing: (listing: any) => void;
  onEditListing: (listing: any) => void;
  onDeleteListing: (id: string) => void;
  showInquiries: boolean;
  setShowInquiries: (show: boolean) => void;
  inquiries: Inquiry[];
};

export interface LandlordDashboardRef {
  openAddModal: () => void;
  openInquiries: () => void;
}

export const LandlordDashboard = forwardRef<LandlordDashboardRef, LandlordDashboardProps>(
  ({ user, onNavigate, onLogout, skipAnimation, listings, setListings, showAddModal, setShowAddModal, editingListing, setEditingListing, onAddListing, onEditListing, onDeleteListing, showInquiries, setShowInquiries, inquiries }, ref) => {
  const listingsRef = useRef<HTMLDivElement>(null);

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    openAddModal: () => {
      setEditingListing(null);
      setShowAddModal(true);
    },
    openInquiries: () => {
      setShowInquiries(true);
    },
  }));

  const unreadCount = inquiries.filter(inq => !inq.read).length;

  const totalViews = listings.reduce((sum, listing) => sum + (listing.views || 0), 0);

  const stats = [
    { label: 'Total Listings', value: listings.length.toString(), icon: Home },
    { label: 'Total Views', value: totalViews.toString(), icon: Eye },
  ];

  return (
    <div className="h-full flex flex-col bg-[#FAFAFA]">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="px-4 py-3 flex items-center justify-between">
          <h1 className="text-[#81D9F7] text-2xl font-bold">ROOMEO</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('landlord-profile')}
              className="flex items-center gap-2 hover:bg-gray-50 px-2 py-2 rounded-lg"
            >
              <div className="w-8 h-8 bg-[#81D9F7] rounded-full flex items-center justify-center text-white">
                {user.profilePicture ? (
                  <img src={user.profilePicture} alt="" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User className="h-4 w-4" />
                )}
              </div>
            </button>
            <Button
              onClick={onLogout}
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-800"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto px-4 py-4 pb-20">
        {/* Welcome Section */}
        <div className="mb-4">
          <h2 className="mb-1">Welcome back!</h2>
          <p className="text-sm text-gray-600">Manage your property listings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-3 shadow-sm"
              >
                <div className="flex items-center justify-center mb-2">
                  <IconComponent className="h-5 w-5 text-[#81D9F7]" />
                </div>
                <p className="text-center mb-1">{stat.value}</p>
                <p className="text-gray-600 text-[10px] text-center leading-tight">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Add Listing Button */}
        <Button
          onClick={() => {
            setEditingListing(null);
            setShowAddModal(true);
          }}
          className="w-full bg-[#81D9F7] hover:bg-[#6BC5E0] rounded-lg h-11 mb-4"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Listing
        </Button>

        {/* Listings */}
        <div className="space-y-3" ref={listingsRef}>
          {listings.map((listing) => (
            <div key={listing.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* Image */}
              <div className="w-full h-40 bg-gray-200 relative">
                {listing.photos && listing.photos.length > 0 ? (
                  <ImageWithFallback
                    src={listing.photos[0]}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Home className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                {/* Action Buttons Overlay */}
                <div className="absolute top-2 right-2 flex gap-1">
                  <button
                    onClick={() => {
                      setEditingListing(listing);
                      setShowAddModal(true);
                    }}
                    className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white shadow-sm"
                  >
                    <Edit className="h-4 w-4 text-gray-700" />
                  </button>
                  <button
                    onClick={() => onDeleteListing(listing.id)}
                    className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white shadow-sm"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-3">
                <h3 className="text-sm mb-1">{listing.title}</h3>
                <p className="text-[#81D9F7] mb-2">RM {listing.price}/month</p>
                <p className="text-xs text-gray-600 mb-2">
                  {listing.location} • {listing.distance} km from UM
                </p>
                <div className="flex items-center gap-1 mb-2">
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-[10px] rounded">
                    {listing.roomType}
                  </span>
                </div>

                {/* Stats */}
                <div className="flex gap-3 text-xs text-gray-600 mb-3">
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {listing.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" />
                    {listing.inquiries}
                  </span>
                </div>

                {/* Facilities */}
                <div className="flex flex-wrap gap-1">
                  {listing.facilities.slice(0, 3).map((facility, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-[#81D9F7]/10 text-[#81D9F7] text-[10px] rounded-full"
                    >
                      {facility}
                    </span>
                  ))}
                  {listing.facilities.length > 3 && (
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded-full">
                      +{listing.facilities.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}

          {listings.length === 0 && (
            <div className="bg-white rounded-xl p-8 text-center">
              <Home className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-sm mb-2 text-gray-600">No listings yet</h3>
              <p className="text-xs text-gray-500 mb-4">Start by adding your first property listing</p>
              <Button
                onClick={() => setShowAddModal(true)}
                className="bg-[#81D9F7] hover:bg-[#6BC5E0] rounded-lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Listing
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t shadow-lg">
        <div className="flex items-center justify-around py-2">
          <button
            onClick={() => onNavigate('landlord-dashboard')}
            className="flex flex-col items-center gap-1 px-3 py-1"
          >
            <Home className="h-5 w-5 text-[#81D9F7]" />
            <span className="text-xs text-[#81D9F7]">Home</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex flex-col items-center gap-1 px-3 py-1"
          >
            <Plus className="h-5 w-5 text-gray-600" />
            <span className="text-xs text-gray-600">Add</span>
          </button>
          <button
            onClick={() => onNavigate('landlord-chat')}
            className="flex flex-col items-center gap-1 px-3 py-1"
          >
            <MessageCircle className="h-5 w-5 text-gray-600" />
            <span className="text-xs text-gray-600">Messages</span>
          </button>
          <button
            onClick={() => setShowInquiries(true)}
            className="flex flex-col items-center gap-1 px-3 py-1 relative"
          >
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="text-xs text-gray-600">Inquiries</span>
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
});