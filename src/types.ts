export interface SimulationConfig {
  gravity: 'up' | 'down' | 'drift';
  speed: number;
  count: number;
  glossiness: number;
  metalness: number;
  transmission: number;
  colorScheme: 'default' | 'pastel' | 'monochrome' | 'neon' | 'sunset';
}

export interface Artist {
  id: string;
  name: string;
  role: string;
  bio: string;
  thesis: string;
  colors: string[];
  pieces: {
    title: string;
    medium: string;
    description: string;
  }[];
  preset: SimulationConfig;
  quote: string;
}

export interface GuestMessage {
  id: string;
  name: string;
  note: string;
  timestamp: string;
}
