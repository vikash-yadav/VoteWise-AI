/**
 * Voter Profile Service
 * Simulates ECI voter verification and provides booth details with coordinates.
 * In production, this would connect to the ECI Voter Portal API.
 */

export interface VoterProfile {
  voterName: string;
  epicNumber: string;
  fatherName: string;
  age: number;
  gender: string;
  constituency: string;
  constituencyCode: string;
  assemblyConstituency: string;
  partNumber: number;
  serialNumber: number;
  pollingBooth: {
    name: string;
    address: string;
    number: number;
    lat: number;
    lng: number;
  };
  voterStatus: 'active' | 'pending' | 'not_found';
  registrationDate: string;
  state: string;
  district: string;
}

// Simulated voter database keyed by Firebase UID
// In production this would query Firestore/Cloud SQL
const voterDatabase: Record<string, VoterProfile> = {};

/**
 * Generates a deterministic voter profile from user info.
 * This simulates what would come from ECI voter verification.
 */
function generateProfileFromUser(uid: string, displayName: string, email: string): VoterProfile {
  // Use UID hash to pick a constituency deterministically
  const constituencies = [
    {
      name: 'South Delhi (LS-07)',
      code: 'LS-07',
      assembly: 'RK Puram (AC-41)',
      state: 'Delhi',
      district: 'South West Delhi',
      booth: { name: 'Kendriya Vidyalaya No. 2, RK Puram', address: 'Sector 4, R.K. Puram, New Delhi - 110022', number: 142, lat: 28.5685, lng: 77.1754 }
    },
    {
      name: 'New Delhi (LS-01)',
      code: 'LS-01',
      assembly: 'Rajinder Nagar (AC-34)',
      state: 'Delhi',
      district: 'Central Delhi',
      booth: { name: 'Govt. Boys Senior Secondary School, Rajinder Nagar', address: 'Shanker Road, Rajinder Nagar, New Delhi - 110060', number: 87, lat: 28.6406, lng: 77.1847 }
    },
    {
      name: 'East Delhi (LS-05)',
      code: 'LS-05',
      assembly: 'Preet Vihar (AC-57)',
      state: 'Delhi',
      district: 'East Delhi',
      booth: { name: 'MCD Primary School, Preet Vihar', address: 'Block D, Preet Vihar, Delhi - 110092', number: 203, lat: 28.6358, lng: 77.3009 }
    },
    {
      name: 'Chandni Chowk (LS-02)',
      code: 'LS-02',
      assembly: 'Ballimaran (AC-18)',
      state: 'Delhi',
      district: 'North Delhi',
      booth: { name: 'Govt. Girls Senior Secondary School, Ballimaran', address: 'Gali Qasim Jaan, Ballimaran, Delhi - 110006', number: 56, lat: 28.6519, lng: 77.2234 }
    },
    {
      name: 'Gurugram (LS-03)',
      code: 'LS-03',
      assembly: 'Badshahpur (AC-48)',
      state: 'Haryana',
      district: 'Gurugram',
      booth: { name: 'Govt. Senior Secondary School, Sector 56', address: 'Sector 56, Gurugram, Haryana - 122011', number: 312, lat: 28.4213, lng: 77.0427 }
    }
  ];

  // Deterministic selection based on UID
  const hash = uid.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const selected = constituencies[hash % constituencies.length];

  const epicPrefix = selected.state === 'Delhi' ? 'DL' : 'HR';
  const epicNum = `${epicPrefix}/${selected.code.replace('LS-', '')}/${String(hash % 9999999).padStart(7, '0')}`;

  return {
    voterName: displayName || 'Citizen',
    epicNumber: epicNum,
    fatherName: 'N/A (Verify on ECI Portal)',
    age: 25,
    gender: 'N/A',
    constituency: selected.name,
    constituencyCode: selected.code,
    assemblyConstituency: selected.assembly,
    partNumber: (hash % 50) + 1,
    serialNumber: (hash % 500) + 1,
    pollingBooth: selected.booth,
    voterStatus: 'active',
    registrationDate: '2024-01-15',
    state: selected.state,
    district: selected.district
  };
}

export class VoterProfileService {
  /**
   * Get or create voter profile for a Firebase user
   */
  getProfile(uid: string, displayName: string, email: string): VoterProfile {
    if (!voterDatabase[uid]) {
      voterDatabase[uid] = generateProfileFromUser(uid, displayName, email);
    }
    return voterDatabase[uid];
  }

  /**
   * Verify voter status (simulated)
   */
  verifyStatus(epicNumber: string): { verified: boolean; message: string } {
    // In production: call ECI API to verify
    return {
      verified: true,
      message: `EPIC ${epicNumber} is verified and active on the electoral roll.`
    };
  }

  /**
   * Get Google Maps navigation URL for the polling booth
   */
  getBoothNavigationUrl(lat: number, lng: number, boothName: string): string {
    const destination = encodeURIComponent(boothName);
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${destination}&travelmode=driving`;
  }

  /**
   * Get Google Maps embed URL for display
   */
  getBoothMapEmbedUrl(lat: number, lng: number, boothName: string): string {
    const query = encodeURIComponent(`${boothName}`);
    return `https://www.google.com/maps?q=${lat},${lng}&z=16&output=embed`;
  }
}
