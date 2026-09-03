import { bins as mockBins, products as mockProducts, incidents as mockIncidents, stats as mockStats, weekly as mockWeekly } from '../data/mockData';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function fetchJson(url, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${url}`, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`API call to ${url} failed or offline. Using fallback data.`, err.message);
    return null;
  }
}

export const api = {
  async getDashboard() {
    const data = await fetchJson('/dashboard');
    if (data) {
      return {
        stats: [
          { label: 'Products Tracked', value: data.users ? String(data.users * 120) : mockStats[0].value, delta: '+8.2%', note: 'vs last month' },
          { label: 'Active Smart Bins', value: data.bins ? String(data.bins) : mockStats[1].value, delta: '+4.6%', note: 'online now' },
          { label: 'Waste Collected', value: data.wasteKg ? `${(data.wasteKg / 1000).toFixed(2)} T` : mockStats[2].value, delta: '+12.4%', note: 'today' },
          { label: 'Cleanliness Score', value: mockStats[3].value, delta: '+3.1%', note: 'city average' }
        ],
        criticalBins: data.criticalBins || 2,
        activeIncidents: data.activeIncidents || 3
      };
    }
    return { stats: mockStats, criticalBins: 2, activeIncidents: 3 };
  },

  async getBins() {
    const data = await fetchJson('/bins');
    if (Array.isArray(data) && data.length > 0) {
      return data.map(b => ({
        id: b.id || `BIN-${b.id}`,
        area: b.area || b.location || 'Central Zone',
        fill: b.fill_level ?? b.fill ?? 50,
        status: (b.fill_level >= 90 || b.status === 'critical') ? 'Critical' : (b.fill_level >= 75 || b.status === 'warning') ? 'Warning' : 'Normal',
        type: b.waste_type || 'Mixed Waste',
        lat: parseFloat(b.latitude) || 28.614,
        lon: parseFloat(b.longitude) || 77.21
      }));
    }
    return mockBins;
  },

  async getProducts() {
    const data = await fetchJson('/products');
    if (Array.isArray(data) && data.length > 0) {
      return data.map(p => ({
        id: p.product_id || p.id || 'PRD-000',
        name: p.name || 'Tracked Item',
        category: p.category || 'Plastic',
        owner: p.owner_name || 'Anonymous',
        status: p.status || 'In Use',
        points: p.eco_points || 100
      }));
    }
    return mockProducts;
  },

  async getIncidents() {
    const data = await fetchJson('/incidents');
    if (Array.isArray(data) && data.length > 0) {
      return data.map(x => ({
        id: x.id || `INC-${x.id}`,
        product: x.product_id || 'PRD-UNKNOWN',
        location: x.location || 'City Area',
        severity: x.severity || 'Medium',
        confidence: x.ai_confidence || 85,
        time: x.time_ago || 'Recently'
      }));
    }
    return mockIncidents;
  },

  async registerProduct(productData) {
    const result = await fetchJson('/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    });
    return result || { success: true, product: productData };
  },

  async updateBinSensor(binId, sensorData) {
    const result = await fetchJson(`/bins/${binId}/sensor`, {
      method: 'POST',
      body: JSON.stringify(sensorData)
    });
    return result || { success: true };
  }
};
