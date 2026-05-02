import { API_BASE_URL } from '../lib/config';

export class ApiService {
  static async fetchVoterProfile(uid: string, displayName?: string) {
    const res = await fetch(`${API_BASE_URL}/api/v1/voter-profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid, displayName }),
    });
    return res.json();
  }

  static async sendMessage(message: string, userContext: any, history: any[]) {
    const res = await fetch(`${API_BASE_URL}/api/v1/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, userContext, history }),
    });
    return res.json();
  }
}
