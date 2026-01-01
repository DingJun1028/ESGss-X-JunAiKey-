export interface ActivityRecord {
  date: string;
  amount: number;
  factor_id?: number;
  source: string;
  memo?: string;
}

const API_BASE = 'https://api.nocodebackend.com';
const INSTANCE = '54686_esgss';

/**
 * Robust fetch utility with retry logic for transient failures.
 */
async function fetchWithRetry(url: string, options?: RequestInit, retries = 2): Promise<Response> {
    let lastError: any;
    for (let i = 0; i <= retries; i++) {
        try {
            const response = await fetch(url, options);
            
            // Check for success
            if (response.ok) return response;
            
            // Log non-ok responses but only retry if status suggests it might resolve
            const isTransient = response.status === 429 || (response.status >= 500 && response.status <= 599);
            
            if (i < retries && isTransient) {
                const delay = 1000 * Math.pow(2, i);
                await new Promise(r => setTimeout(r, delay));
            } else {
                return response;
            }
        } catch (err) {
            lastError = err;
            if (i < retries) {
                await new Promise(r => setTimeout(r, 1000 * Math.pow(2, i)));
            }
        }
    }
    throw lastError || new Error(`Network request failed to ${url}`);
}

export const BackendService = {
  /**
   * Logs activity data to the central NoCodeBackend database.
   */
  async logActivity(record: ActivityRecord) {
    try {
      const response = await fetchWithRetry(`${API_BASE}/create/activity_data?Instance=${INSTANCE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(record)
      });

      if (!response.ok) {
        console.error(`Backend Sync Error: HTTP ${response.status}`, await response.text());
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.warn("Backend Sync Warning: Could not reach NoCodeBackend. Check network or API Token.", error);
      return null;
    }
  },

  /**
   * Retrieves carbon factors from the database.
   */
  async fetchFactors() {
    try {
      const response = await fetchWithRetry(`${API_BASE}/read/carbon_factors?Instance=${INSTANCE}`);
      if (!response.ok) {
          console.error(`Backend Fetch Error: HTTP ${response.status}`);
          return [];
      }
      return await response.json();
    } catch (error) {
      console.warn("Backend Fetch Warning", error);
      return [];
    }
  }
};
