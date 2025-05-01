import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    SafeAreaView,
    Pressable, 
    Alert,
    ActivityIndicator,
} from 'react-native';

// Constants
import * as WebBrowser from 'expo-web-browser';
import { colors } from '../constants/colors'; 
import { supabase } from '../lib/supabase';

// --- Authentication Modal Component ---
// Slides up from the bottom after onboarding
const AuthModal = ({ visible, onClose, navigation }) => {
    const [loading, setLoading] = useState(false);
    // Navigate to Home and close modal
    const handleContinueAsGuest = () => {
        if (loading) return;
        onClose(); 
        navigation.replace('Home');
    };

    // Placeholder for Login navigation
    const handleLogin = () => {
        if (loading) return;
        onClose();
        console.log("Navigate to Login Screen");
         // For now, go home after closing
         navigation.replace('Login');
    };

    // Placeholder for Sign Up navigation
    const handleSignUp = () => {
        if (loading) return;
        onClose();
        console.log("Navigate to Sign Up Screen");
         // For now, go home after closing
         navigation.replace('SignUp');
    };

    // Placeholder for Gmail Sign In
    const handleGmailSignIn = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                // options: {
                //    redirectTo: Linking.createURL('/auth/callback'), // Optional: Specify redirect URL if needed
                // }
            });

            if (error) {
                console.error('Google OAuth Error:', error.message);
                Alert.alert('Google Sign-In Failed', error.message || 'An unexpected error occurred.');
            } else if (data.url) {
                // If Supabase provides a URL, open it in the browser
                // Requires expo-web-browser
                const result = await WebBrowser.openAuthSessionAsync(data.url);
                if (result.type === 'success') {
                    // Handle success - Supabase listener in App.js should pick up the session
                    console.log('OAuth flow successful (check App.js listener)');
                    // Note: Session might take a moment to be detected by the listener.
                    // You might want to show a loading indicator until the session state updates in App.js
                } else {
                    console.warn('OAuth flow cancelled or failed:', result);
                    Alert.alert('Google Sign-In Cancelled', 'The sign-in process was not completed.');
                }
                // Close modal regardless of browser result, let App.js handle navigation via session state
                onClose();
            } else {
                 console.log('Google Sign-In initiated (check Supabase listener/redirect)');
                 // If no URL is returned, Supabase might handle redirect differently (e.g., deep link)
                 // Close modal and let App.js handle navigation via session state
                 onClose();
            }

        } catch (error) {
            console.error('Unexpected Google Sign-In Error:', error);
            Alert.alert('Google Sign-In Failed', 'An unexpected error occurred.');
        } finally {
            setLoading(false);
            // Close modal even if there was an error during initiation
             if (!visible) onClose(); // Ensure modal closes if browser flow fails early
        }
    };


    return (
        <Modal
            animationType="slide" 
            transparent={true} 
            visible={visible}
            onRequestClose={onClose} 
        >
            {/* Pressable backdrop to close the modal */}
            <Pressable style={styles.backdrop} onPress={loading ? null : onClose}>
                
                <Pressable>
                    <SafeAreaView style={styles.modalContainer}>
                        <View style={styles.contentView}>
                            {/* Modal Title */}
                            <Text style={styles.title}>Join Us</Text>
                            <Text style={styles.subtitle}>Choose an option to continue</Text>

                            {/* Action Buttons */}
                            <TouchableOpacity style={[styles.button, styles.loginButton, loading && styles.loadingButton]} onPress={handleLogin}
                            disabled={loading}>
                                <Text style={styles.buttonText}>Login</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={[styles.button, styles.signupButton, loading && styles.loadingButton]} onPress={handleSignUp}
                            disabled={loading}>
                                <Text style={[styles.buttonText, styles.signupButtonText]}>Sign Up</Text>
                            </TouchableOpacity>

                             <TouchableOpacity style={[styles.button, styles.gmailButton, loading && styles.loadingButton]} onPress={handleGmailSignIn}
                             disabled={loading}>
                                {loading ? (
                                    <ActivityIndicator size="small" color={colors.white} />
                                ) : null}

                                <Text style={styles.buttonText}> G </Text>
                                <Text style={styles.buttonText}>Sign in with Gmail</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={[styles.button, styles.guestButton, loading && styles.loadingButton]} onPress={handleContinueAsGuest}
                            disabled={loading}>
                                <Text style={styles.guestButtonText}>Continue as Guest</Text>
                            </TouchableOpacity>

                            {/* Optional: Close button */}
                            {/* <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                                <Text style={styles.closeButtonText}>Close</Text>
                            </TouchableOpacity> */}
                        </View>
                    </SafeAreaView>
                </Pressable>
            </Pressable>
        </Modal>
    );
};

// Styles for AuthModal
export const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black backdrop
        justifyContent: 'flex-end', // Align modal to the bottom
    },
    modalContainer: {
        // Ensures content doesn't go under notches/status bars within the modal view itself
    },
    contentView: {
        backgroundColor: colors.white,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 30, // Add padding at the bottom
        borderTopLeftRadius: 20, // Rounded corners at the top
        borderTopRightRadius: 20,
        alignItems: 'center', // Center items horizontally
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.gray800,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: colors.gray600,
        marginBottom: 24,
        textAlign: 'center',
    },
    button: {
        width: '100%', // Make buttons take full width
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
        flexDirection: 'row', // For icon + text alignment
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    loadingButton: {
        opacity: 0.5,
    },
    loginButton: {
        backgroundColor: colors.accent,
    },
    signupButton: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.accent,
    },
    gmailButton: {
        backgroundColor: colors.border//'#DB4437', // Google Red
    },
    guestButton: {
        backgroundColor: 'transparent', // No background
        elevation: 0, // No shadow for guest button
        shadowOpacity: 0,
    },
    buttonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '600',
        marginHorizontal: 5, // Space around icon/text
    },
    signupButtonText: {
        color: colors.accent, // Text color for signup button
    },
    guestButtonText: {
        color: colors.gray600,
        fontSize: 16,
        fontWeight: '500',
    },
    // Optional close button styling
    // closeButton: {
    //     marginTop: 10,
    // },
    // closeButtonText: {
    //     color: colors.gray500,
    //     fontSize: 14,
    // },
});

export default AuthModal;
