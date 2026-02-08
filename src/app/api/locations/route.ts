import { NextRequest, NextResponse } from 'next/server';
import { UBC_LOCATIONS, UBCLocation, getLocationsByType, getRecommendedLocations } from '@/lib/ubcLocations';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const recommended = searchParams.get('recommended');
    const id = searchParams.get('id');

    let locations: UBCLocation[] = UBC_LOCATIONS;

    if (type) {
      locations = getLocationsByType(type as 'indoor' | 'outdoor' | 'public');
    } else if (recommended === 'true') {
      locations = getRecommendedLocations();
    } else if (id) {
      const found = UBC_LOCATIONS.find(loc => loc.id === id);
      return NextResponse.json({ location: found || null });
    }

    return NextResponse.json({ locations });
  } catch (error) {
    console.error('Error fetching locations:', error);
    return NextResponse.json({ error: 'Failed to fetch locations' }, { status: 500 });
  }
}
