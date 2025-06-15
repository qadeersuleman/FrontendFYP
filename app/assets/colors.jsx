// colors.js - Professional Color Palette for AI Mental Health App
export const Colors = {
  // Core Brand Colors
  brand: {
      primary: '#4E7AC7',       // Calming blue (main brand color)
      primaryDark: '#3A5F9A',   // Darker shade for contrast
      primaryLight: '#6B8FD4',  // Lighter shade for highlights
      primaryPastel: '#E8EFF9', // Very light for subtle backgrounds
  },
  
  // Secondary Colors
  accent: {
      teal: '#5EC8D8',         // Refreshed teal for accents
      tealDark: '#3EA4B5',
      tealLight: '#8EDCE8',
      tealPastel: '#E6F7FA',
      
      lavender: '#957FEF',      // Soft purple for mindfulness features
      lavenderDark: '#7A65D6',
      lavenderLight: '#B19BFF',
      
      coral: '#FF7B7B',        // Warm color for emotional features
      coralDark: '#E05C5C',
      coralLight: '#FF9D9D',
  },
  
  // Neutral Colors
  neutrals: {
      white: '#FFFFFF',
      background: '#F9FBFF',   // Very light blue-tinged background
      surface: '#FFFFFF',       // White for cards/surfaces
      surfaceLow: '#F2F5FA',    // Slightly darker for contrast
      border: '#E3E9F2',        // Light gray-blue for borders
      divider: '#EDF1F7',       // Very subtle dividers
  },
  
  // Text Colors
  text: {
      primary: '#2D3748',       // Dark blue-gray for primary text
      secondary: '#4A5568',     // Medium gray for secondary text
      tertiary: '#718096',      // Light gray for hints/disabled
      inverted: '#FFFFFF',      // White text on colored backgrounds
      disabled: '#CBD5E0',      // Very light gray for disabled states
      link: '#4E7AC7',         // Brand color for links
  },
  
  // Status Colors
  status: {
      success: '#4FD1A6',       // Vibrant teal-green for success
      successLight: '#E6FCF7',
      warning: '#FFB74D',       // Soft orange for warnings
      warningLight: '#FFF5E6',
      error: '#FF6B6B',        // Soft red for errors
      errorLight: '#FFEEEE',
      info: '#64B5F6',         // Light blue for information
      infoLight: '#EBF5FF',
  },
  
  // Feature-Specific Colors
  features: {
      meditation: '#957FEF',    // Lavender for meditation
      mindfulness: '#A78BFA',   // Light purple for mindfulness
      mood: '#FF9E7D',          // Warm peach for mood tracking
      journal: '#6DD3A4',      // Fresh green for journaling
      ai: '#FFB347',            // Golden yellow for AI interactions
      community: '#5EC8D8',     // Teal for social features
  },
  
  // Gradients
  gradients: {
      primary: ['#4E7AC7', '#5EC8D8'],       // Brand blue to teal
      calm: ['#5EC8D8', '#957FEF'],          // Teal to lavender
      energy: ['#FFB347', '#FF7B7B'],        // Gold to coral
      sunrise: ['#FF9E7D', '#FFB347'],       // Mood gradient
      twilight: ['#4E7AC7', '#957FEF'],      // Evening calm
  },
  
  // UI Elements
  ui: {
      shadow: 'rgba(46, 52, 64, 0.08)',      // Subtle shadow
      shadowDark: 'rgba(46, 52, 64, 0.15)',  // Deeper shadow
      overlay: 'rgba(45, 55, 72, 0.6)',      // For modals/overlays
      backdrop: 'rgba(249, 251, 255, 0.8)',  // For frosted glass effects
  },
  
  // Data Visualization
  dataViz: {
      blue: '#4E7AC7',
      teal: '#5EC8D8',
      purple: '#957FEF',
      pink: '#FF7B7B',
      orange: '#FFB347',
      green: '#6DD3A4',
      yellow: '#FFD166',
  }
};

export default Colors;