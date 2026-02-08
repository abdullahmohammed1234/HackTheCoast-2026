export interface UBCLocation {
  id: string;
  name: string;
  address: string;
  description: string;
  type: 'indoor' | 'outdoor' | 'public';
  coordinates: {
    lat: number;
    lng: number;
  };
  safetyNotes: string;
  amenities: string[];
  imageUrl?: string;
  hours?: string;
  recommended: boolean;
}

export const UBC_LOCATIONS: UBCLocation[] = [
  {
    id: 'ikea-room',
    name: 'Ikea Lecture Hall Lobby',
    address: '6145 University Blvd, Vancouver, BC V6T 1Z2',
    description: 'Large indoor space with comfortable seating near the main entrance. Great for all weather conditions.',
    type: 'indoor',
    coordinates: { lat: 49.2694, lng: -123.2521 },
    safetyNotes: 'Well-lit, high foot traffic area. Located near security office.',
    amenities: ['Seating', 'Washrooms nearby', 'Wheelchair accessible'],
    hours: 'Open during building hours (7am - 10pm)',
    recommended: true,
  },
  {
    id: 'buchanan',
    name: 'Buchanan Tower Lobby',
    address: '1866 Main Mall, Vancouver, BC V6T 1Z2',
    description: 'Spacious indoor lobby with plenty of seating. Central location on main campus.',
    type: 'indoor',
    coordinates: { lat: 49.2678, lng: -123.2548 },
    safetyNotes: 'Building security present, well-lit common areas.',
    amenities: ['Seating', 'Food court nearby', 'Study spaces'],
    hours: 'Open 24/7 with card access',
    recommended: true,
  },
  {
    id: 'lsc',
    name: 'Life Sciences Centre Atrium',
    address: '2350 Health Sciences Mall, Vancouver, BC V6T 1Z3',
    description: 'Grand indoor atrium with natural light. Central location near hospital area.',
    type: 'indoor',
    coordinates: { lat: 49.2644, lng: -123.2456 },
    safetyNotes: 'Busy during weekdays, security patrols regularly.',
    amenities: ['Seating', 'Café nearby', 'Washrooms'],
    hours: 'Open 6am - 11pm',
    recommended: true,
  },
  {
    id: 'ubc-security',
    name: 'UBC Security Office (North)',
    address: '6384 Health Sciences Mall, Vancouver, BC V6T 1Z4',
    description: 'Meet at the security office for monitored exchanges. Safest option for transactions.',
    type: 'public',
    coordinates: { lat: 49.2628, lng: -123.2442 },
    safetyNotes: 'Most secure location - monitored by security cameras and personnel.',
    amenities: ['Security present', 'Safe exchange zone'],
    hours: '24/7 security patrol',
    recommended: true,
  },
  {
    id: 'student-union',
    name: 'Student Union Building',
    address: '6138 University Blvd, Vancouver, BC V6T 1Z3',
    description: 'Hub of campus activity with many people around. Indoor and outdoor meeting spots.',
    type: 'public',
    coordinates: { lat: 49.2664, lng: -123.2514 },
    safetyNotes: 'Very busy location, many witnesses around.',
    amenities: ['Food options', 'Seating', 'Information desk', 'Security'],
    hours: 'Varies by business hours',
    recommended: true,
  },
  {
    id: ' библиотеки',
    name: 'Irving K. Barber Learning Centre',
    address: '1961 East Mall, Vancouver, BC V6T 1Z1',
    description: 'Large library with study spaces and meeting areas. Quiet but safe environment.',
    type: 'indoor',
    coordinates: { lat: 49.2699, lng: -123.2561 },
    safetyNotes: 'Library staff present, quiet area with surveillance.',
    amenities: ['Seating', 'Study rooms', 'Café', 'Washrooms'],
    hours: 'Check library hours online',
    recommended: false,
  },
  {
    id: 'museum',
    name: 'Museum of Anthropology Lobby',
    address: '6393 NW Marine Dr, Vancouver, BC V6T 1Z2',
    description: 'Cultural venue with beautiful architecture. Good indoor meeting space.',
    type: 'indoor',
    coordinates: { lat: 49.2673, lng: -123.2599 },
    safetyNotes: 'Museum security, well-maintained area.',
    amenities: ['Seating', 'Art displays', 'Gift shop'],
    hours: 'Check museum hours (often closed Mondays)',
    recommended: false,
  },
  {
    id: 'wesbrook',
    name: 'Wesbrook Community Centre',
    address: '3485 Wesbrook Mall, Vancouver, BC V6S 0A8',
    description: 'Community centre with staffed reception. Safe for exchanges.',
    type: 'public',
    coordinates: { lat: 49.2524, lng: -123.2338 },
    safetyNotes: 'Staffed during business hours, family-friendly environment.',
    amenities: ['Reception desk', 'Parking', 'Seating'],
    hours: 'Mon-Fri 8am-8pm, Sat-Sun 10am-4pm',
    recommended: true,
  },
  {
    id: 'ubc-farm',
    name: 'UBC Farm Centre',
    address: '6184 South Campus Rd, Vancouver, BC V6T 1Z4',
    description: 'Outdoor location at the farm. Best for daytime meetings only.',
    type: 'outdoor',
    coordinates: { lat: 49.2521, lng: -123.2378 },
    safetyNotes: 'Daytime recommended, busy during farm events. Remote location.',
    amenities: ['Parking', 'Outdoor space'],
    hours: 'Daytime only (8am - sunset)',
    recommended: false,
  },
  {
    id: 'telus-garden',
    name: 'Telus Garden',
    address: '1077 Great Northern Way, Vancouver, BC V5T 1E1',
    description: 'Modern office building with security. Indoor lobby suitable for exchanges.',
    type: 'indoor',
    coordinates: { lat: 49.2776, lng: -123.0832 },
    safetyNotes: 'Building security, modern surveillance.',
    amenities: ['Seating', 'Security desk', 'Elevators'],
    hours: 'Business hours, lobby always accessible',
    recommended: false,
  },
  {
    id: 'east-mall',
    name: 'East Mall Open Area',
    address: 'East Mall, Vancouver, BC V6T 1Z4',
    description: 'Open outdoor space near bus loop. Daytime recommended.',
    type: 'outdoor',
    coordinates: { lat: 49.2685, lng: -123.2489 },
    safetyNotes: 'Busy during class changes, well-lit. Daytime only.',
    amenities: ['Bus loop nearby', 'Open space'],
    hours: 'Best during daylight hours',
    recommended: false,
  },
  {
    id: 'library-robson',
    name: 'Robson Square (UBC Branch)',
    address: '800 Robson St, Vancouver, BC V6Z 3B7',
    description: 'Downtown UBC learning space. Good for off-campus exchanges.',
    type: 'indoor',
    coordinates: { lat: 49.2827, lng: -123.1207 },
    safetyNotes: 'Downtown location, busy area.',
    amenities: ['Seating', 'Staff present'],
    hours: 'Check online for hours',
    recommended: false,
  },
];

export const LOCATION_CATEGORIES = [
  { id: 'all', name: 'All Locations', icon: '🏢' },
  { id: 'indoor', name: 'Indoor', icon: '🏠' },
  { id: 'outdoor', name: 'Outdoor', icon: '🌳' },
  { id: 'public', name: 'Public/Safe Zone', icon: '🛡️' },
];

export const RECOMMENDED_LOCATIONS = UBC_LOCATIONS.filter(loc => loc.recommended);

export function getLocationById(id: string): UBCLocation | undefined {
  return UBC_LOCATIONS.find(loc => loc.id === id);
}

export function getLocationsByType(type: 'indoor' | 'outdoor' | 'public'): UBCLocation[] {
  return UBC_LOCATIONS.filter(loc => loc.type === type);
}

export function getRecommendedLocations(): UBCLocation[] {
  return RECOMMENDED_LOCATIONS;
}
