import { 
    Poppins_700Bold, 
    Poppins_600SemiBold, 
    Poppins_500Medium 
  } from '@expo-google-fonts/poppins';
  import { 
    Inter_400Regular, 
    Inter_300Light 
  } from '@expo-google-fonts/inter';
  import { 
    Lora_400Regular_Italic 
  } from '@expo-google-fonts/lora';
  
  // ======================
  // 1. FONT LOADING CONFIG
  // ======================
  export const loadFonts = async () => {
    await Font.loadAsync({
      'Poppins-Bold': Poppins_700Bold,
      'Poppins-SemiBold': Poppins_600SemiBold,
      'Poppins-Medium': Poppins_500Medium,
      'Inter-Regular': Inter_400Regular,
      'Inter-Light': Inter_300Light,
      'Lora-Italic': Lora_400Regular_Italic,
    });
  };
  
  // Rest of the file remains the same (Fonts, TextStyles exports)...



// ======================
// 2. FONT STYLE PRESETS
// ======================
export const Fonts = {
    // Headings
    heading1: {
      fontFamily: 'Poppins-Bold',
      fontSize: 36,
      lineHeight: 44,
      color: '#2E3A59', // Dark blue for trust
    },
    heading2: {
      fontFamily: 'Poppins-SemiBold',
      fontSize: 24,
      lineHeight: 32,
      color: '#2E3A59',
    },
  
    // Body Text
    bodyLarge: {
      fontFamily: 'Inter-Regular',
      fontSize: 16,
      lineHeight: 24,
      color: '#4A5568', // Soft gray for readability
    },
    bodySmall: {
      fontFamily: 'Inter-Light',
      fontSize: 14,
      lineHeight: 20,
      color: '#4A5568',
    },
  
    // Special (Quotes/Testimonials)
    quote: {
      fontFamily: 'Lora-Italic',
      fontSize: 18,
      lineHeight: 26,
      color: '#4A5568',
    },
  
    // Buttons
    buttonPrimary: {
      fontFamily: 'Poppins-SemiBold',
      fontSize: 16,
      color: 'white',
      letterSpacing: 0.5,
    },
    buttonSecondary: {
      fontFamily: 'Poppins-Medium',
      fontSize: 14,
      color: '#4A5568',
    },
  };
  
  // ======================
  // 3. FONT UTILITY CLASSES
  // ======================
  export const TextStyles = {
    // Quick access
    title: Fonts.heading1,
    subtitle: Fonts.heading2,
    paragraph: Fonts.bodyLarge,
    caption: Fonts.bodySmall,
  };