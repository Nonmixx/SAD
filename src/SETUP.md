# ROOMEO Setup Guide

## Features Implemented

✅ **Functional Messaging System**
- Real-time chat interface with persistent storage (localStorage)
- Message history saved across sessions
- Contact list with online status indicators
- Typing and sending messages

✅ **AI Chat Assistant**
- Integrated AI assistant in the chat
- Provides help with:
  - Room searching
  - Roommate matching
  - Price recommendations
  - Location suggestions
- Context-aware responses based on user queries

✅ **Enhanced AI Price Prediction**
- Advanced pricing algorithm considering:
  - Room type (30% impact)
  - Distance from campus (20% impact)
  - Location premium (15% impact)
  - Facilities (35% impact)
  - Number of bedrooms/bathrooms
- Provides price range and detailed breakdown
- Shows factors affecting the suggested price

✅ **Google Maps Integration**
- Real Google Maps with interactive pins
- Search functionality for locations
- Geolocation support
- Custom markers for university and rooms
- Interactive bottom sheet for room details
- Zoom and pan controls

✅ **Mobile-Optimized Design**
- Responsive layouts for all screen sizes
- Mobile-first approach
- Bottom navigation for mobile devices
- Touch-friendly buttons and controls
- Optimized typography and spacing
- Slide-out sidebars for chat/map on mobile

## Google Maps API Key Setup

To enable the Google Maps feature, you need to add your Google Maps API key:

### 1. Get a Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
4. Go to "Credentials" and create an API key
5. (Optional) Restrict your API key to your domain for security

### 2. Add the API Key

Open `/components/MapPage.tsx` and find line 67:

```typescript
script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=places`;
```

Replace `YOUR_GOOGLE_MAPS_API_KEY` with your actual API key:

```typescript
script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAbc123...&libraries=places`;
```

## How to Use

### Chat System
1. Navigate to Messages from the dashboard
2. Select a contact to start chatting
3. Type your message and press Enter or click Send
4. Messages are automatically saved to localStorage
5. Try chatting with the **ROOMEO AI Assistant** for help!

### AI Assistant Features
Ask the AI assistant questions like:
- "Help me find a room"
- "Show me roommate matches"
- "What are the prices in Bangsar?"
- "Where should I look for rooms?"

### AI Price Prediction
1. Go to Landlord Dashboard (login with "landlord" in email)
2. Click "Add New Listing"
3. Fill in property details
4. Click the "AI" button next to price
5. Get intelligent price suggestions with detailed breakdown

### Google Maps
1. Navigate to Map View
2. Use the search bar to find locations
3. Click on room pins to see details
4. Click the navigation button to center on your location
5. Pan and zoom to explore the area

## Mobile Features

- **Bottom Navigation**: Quick access to main features on mobile
- **Responsive Chat**: Slide-out contact list on mobile
- **Touch Gestures**: Tap, swipe, and zoom support
- **Optimized Layouts**: Cards and buttons sized for touch
- **Mobile Menu**: Hamburger menu for navigation

## Browser Compatibility

- Chrome/Edge: ✅ Full support
- Safari: ✅ Full support
- Firefox: ✅ Full support
- Mobile browsers: ✅ Optimized

## Tips

1. **Clear Storage**: If you want to reset messages, open browser console and run:
   ```javascript
   localStorage.removeItem('roomeo-messages');
   localStorage.removeItem('roomeo-contacts');
   ```

2. **Test Accounts**:
   - Student: Use any email without "landlord"
   - Landlord: Use email with "landlord" (e.g., landlord@test.com)

3. **Mobile Testing**: Use browser DevTools device mode to test mobile layouts

## Future Enhancements

Consider adding:
- Real backend with Supabase for true multi-user chat
- Push notifications for new messages
- Image uploads in chat
- Voice/video calling
- Advanced map filters
- Route planning from university to rooms
- Real-time room availability updates

## Support

For issues or questions, check:
- Browser console for errors
- Network tab for API issues
- Ensure JavaScript is enabled
- Check localStorage permissions
