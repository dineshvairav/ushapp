import { StyleSheet } from 'react-native';
import { colors } from '../constants/colors'; // Adjust path as needed

// ========================================================================
// --- Global Styles ---
// ========================================================================

export const globalStyles = StyleSheet.create({
    // Style for the initial loading screen of the App component
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.gray100,
    },
    // Style for the loading overlay used in WebView
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.5)', // White with 50% opacity
        zIndex: 10, // Ensure it's above the WebView content
    },
});

