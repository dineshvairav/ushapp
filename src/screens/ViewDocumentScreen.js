import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ActivityIndicator,
} from 'react-native';
import { WebView } from 'react-native-webview';


// Constants & Styles
import { colors } from '../constants/colors'; // Adjust path
import { globalStyles } from '../styles/globalStyles'; // Adjust path

// --- View Document Screen ---
// Displays a document (PDF) using Google Docs Viewer within a WebView
const ViewDocumentScreen = ({ route }) => {
    // Get parameters passed from navigation (document URL and optional message)
    const { documentUrl, message } = route.params || {};

    // State variables
    const [isLoading, setIsLoading] = useState(false); // Controls loading indicator visibility
    const [error, setError] = useState(''); // Stores error messages
    const [webViewKey, setWebViewKey] = useState(0); // Used to force WebView reload on URL change

    // Construct the Google Docs Viewer URL (requires internet)
    // Ensures the document URL is properly encoded
    const viewerUrl = documentUrl
        ? `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(documentUrl)}`
        : null;

    // Effect runs when documentUrl or message changes
    useEffect(() => {
        setIsLoading(!!viewerUrl); // Show loading if there's a URL
        setError(''); // Clear previous errors
        setWebViewKey(prevKey => prevKey + 1); // Increment key to force reload
        // If no URL is provided, set the error message
        if (!viewerUrl) {
            setError(message || 'No document URL provided.');
        }
    }, [documentUrl, message]); // Dependencies for the effect

    // Callback function to handle WebView loading errors
    const handleWebViewError = (syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        console.error('WebView Error:', nativeEvent); // Log error details
        // Set a user-friendly error message
        setError(`Failed to load document. Error: ${nativeEvent.description || nativeEvent.code || 'Unknown error'}`);
        setIsLoading(false); // Hide loading indicator
    };

    return (
        <SafeAreaView style={stylesViewDoc.safeArea}>
            {/* Screen Header (Could be part of navigation header instead) */}
            {/* <Text style={stylesViewDoc.headerText}>View Document</Text> */}

            {/* Conditional rendering based on error state or URL availability */}
            {error ? (
                // Display error message if an error occurred
                <View style={stylesViewDoc.centerContainer}>
                    <Text style={stylesViewDoc.errorText}>{error}</Text>
                </View>
            ) : viewerUrl ? (
                // Display WebView if a valid URL is constructed
                <WebView
                    key={webViewKey} // Force re-render when key changes
                    source={{ uri: viewerUrl }}
                    style={stylesViewDoc.webView}
                    // Control loading indicator
                    onLoadStart={() => setIsLoading(true)}
                    onLoadEnd={() => setIsLoading(false)}
                    onError={handleWebViewError} // Handle loading errors
                    // Allow viewing content from any source (needed for gview)
                    originWhitelist={['*']}
                    // Enable JS and storage for viewer functionality
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    // Show loading indicator provided by WebView
                    startInLoadingState={true}
                    // Render custom loading indicator using global style
                    renderLoading={() => (
                        <ActivityIndicator
                            style={globalStyles.loadingOverlay} // Use absolute positioned overlay style
                            size="large"
                            color={colors.blue500}
                        />
                    )}
                />
            ) : (
                // Display message if no document URL was provided initially
                <View style={stylesViewDoc.centerContainer}>
                    <Text style={stylesViewDoc.infoText}>No document to display.</Text>
                </View>
            )}
            {/* Optional: Separate overlay loading indicator controlled by state */}
            {/* {isLoading && !error && (
                <ActivityIndicator style={globalStyles.loadingOverlay} size="large" color={colors.blue500} />
            )} */}
        </SafeAreaView>
    );
};

// Styles specific to ViewDocumentScreen
const stylesViewDoc = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.gray100 },
     headerText: { fontSize: 24, fontWeight: '700', color: colors.gray800, padding: 16, textAlign: 'center', borderBottomWidth: 1, borderBottomColor: colors.gray300, backgroundColor: colors.white },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    errorText: { color: colors.red500, textAlign: 'center', fontWeight: '500', fontSize: 16 },
    infoText: { color: colors.gray600, textAlign: 'center', fontSize: 16 },
    webView: { flex: 1 }, // Ensure WebView takes available space
});

export default ViewDocumentScreen;
