import { Artist } from '../types';

export const ARTISTS_DATA: Artist[] = [
  {
    id: 'elena-vance',
    name: 'Elena Vance',
    role: 'Generative Floatationist',
    bio: 'Elena Vance is an installation designer operating between London and Tokyo. Her work investigates structural weightlessness by suspending pneumatic, gas-filled membranes within physical architecture.',
    thesis: 'To strip form of gravity is to liberate it from structural servitude. Her digital simulations explore how light penetrates fragile membrane thresholds.',
    colors: ['#E9D5FF', '#FEE2E2', '#CFFAFE', '#ECFDF5', '#FEF3C7'], // Pastels
    quote: '"Air is both container and material; a boundary defined purely by pressure and intent."',
    pieces: [
      {
        title: 'Thresholds of Breath',
        medium: 'Inflatable Bio-PVC, Xenon lighting',
        description: 'An interactive pavilion that gently contracts and expands based on atmospheric humidity.'
      },
      {
        title: 'Weightless Manifest',
        medium: 'WebGL custom physics simulation',
        description: 'Gently drifting, translucent spatial elements reflecting local solar coordinates.'
      }
    ],
    preset: {
      gravity: 'up',
      speed: 0.6,
      count: 18,
      glossiness: 0.05, // low roughness = very glossy
      metalness: 0.02,
      transmission: 0.45, // very translucent
      colorScheme: 'pastel'
    }
  },
  {
    id: 'ryo-sato',
    name: 'Ryo Sato',
    role: 'Digital Synesthete & Coder',
    bio: 'An audio-visual programmer exploring code-generated landscapes. Ryo Sato builds responsive synthetic networks where sonic frequencies directly control the color refractivity and speed of digital structures.',
    thesis: 'Every pixel holds a frequency. True synesthesia is achieved when sound is not a passive soundtrack but the primary physical force of visual matter.',
    colors: ['#FF0055', '#33CCFF', '#FFCC00', '#9933FF', '#00FF66'], // Neons
    quote: '"Sound isn\'t a supplement to the image; sound is the code that writes the light."',
    pieces: [
      {
        title: 'Spectral Pops',
        medium: 'Interactive Synth Canvas, WebGL2',
        description: 'Micro-acoustic triggers mapped to spatial coordinate collisions, rendering responsive high-frequency waveforms.'
      },
      {
        title: 'Harmonic Ribbons',
        medium: 'Procedural laser nodes, spatial audio array',
        description: 'Tension-based physical strings responsive to active viewer proximity and cursor clicks.'
      }
    ],
    preset: {
      gravity: 'drift', // floating gently sideways
      speed: 1.4,
      count: 24,
      glossiness: 0.02,
      metalness: 0.5, // futuristic metallic sheen
      transmission: 0.1,
      colorScheme: 'neon'
    }
  },
  {
    id: 'saskia-thorne',
    name: 'Saskia Thorne',
    role: 'Silicon Couturier / Alchemist',
    bio: 'Saskia Thorne is a materials designer who treats the computer screen as a loom. Relying on thick, matte elastomers and dense industrial plastics, she creates virtual garment membranes that drape over invisible forces.',
    thesis: 'The interface is a second skin. Her research studies how digital membranes mimic biological stretch, tension, and organic exhaustion.',
    colors: ['#27272A', '#52525B', '#E4E4E7', '#18181B', '#D4D4D8'], // Monochrome / Industrial
    quote: '"Plastics are not lifeless synthetic mistakes—they are highly responsive, elastic skins waiting for code."',
    pieces: [
      {
        title: 'Dense Membranes v4',
        medium: 'Cured liquid silicon, pneumatic valves',
        description: 'Oversized black and off-white sculptures that sag and drape over solid iron beams.'
      },
      {
        title: 'Tension Wearables',
        medium: '3D Mesh, simulated gravity load',
        description: 'Garments reacting to virtual mass values, distorting based on calculated stretch limits.'
      }
    ],
    preset: {
      gravity: 'down', // floating downwards like heavy beads
      speed: 0.4,
      count: 12, // fewer, heavier structures
      glossiness: 0.4, // matte-ish look
      metalness: 0.1,
      transmission: 0.0, // completely opaque
      colorScheme: 'monochrome'
    }
  },
  {
    id: 'amara-diallo',
    name: 'Amara Diallo',
    role: 'Aura Light Sculptor',
    bio: 'Working out of Dakar and Paris, Amara captures transient atmospheric situations, focusing on temperature, glare, sunset spectra, and evaporation gradients.',
    thesis: 'Modern screens possess incredible spectrum capabilities. Her ambient installations utilize high-contrast color transitions to induce a meditative physical state.',
    colors: ['#F97316', '#EC4899', '#EAB308', '#EF4444', '#F43F5E'], // Sunset
    quote: '"The horizon isn\'t a line; it is a rapid shift of temperatures and solar glare."',
    pieces: [
      {
        title: 'Evaporation Study',
        medium: 'LED panels, water vapors, projection mapping',
        description: 'A glowing light wall displaying changing sunset gradients according to water mist density.'
      },
      {
        title: 'Glance Horizon',
        medium: 'Polarized glass, brass fixtures',
        description: 'Layered panels reflecting amber and magenta glow under intense warm lighting.'
      }
    ],
    preset: {
      gravity: 'up',
      speed: 0.9,
      count: 30, // saturated aesthetic
      glossiness: 0.08,
      metalness: 0.2,
      transmission: 0.3,
      colorScheme: 'sunset'
    }
  }
];
