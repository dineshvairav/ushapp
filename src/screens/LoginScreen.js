import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator, // Use Alert for simple feedback for now
} from 'react-native';

// Constants
import { colors } from '../constants/colors'; // Adjust path as needed
import { supabase } from '../lib/supabase';


// --- Login Screen ---
const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // Placeholder login handler
    const handleLogin = async () => {
        // Basic validation
        if (!email || !password) {
            Alert.alert('Error', 'Please enter both email and password.');
            return;
        }
        setLoading(true); // Start loading indicator
        try {
            // Use Supabase auth function
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) {
                console.error('Supabase Login Error:', error.message);
                Alert.alert('Login Failed', error.message || 'An unexpected error occurred.');
            } else {
                // Login successful!
                // Session update will be handled by the listener in App.js
                // No need to navigate here explicitly if using onAuthStateChange
                console.log('Login successful:', data.user?.email);
                // Alert.alert('Success', 'Logged in successfully!'); // Optional feedback
            }
        } catch (error) {
            // Catch any unexpected errors during the API call
            console.error('Unexpected Login Error:', error);
            Alert.alert('Login Failed', 'An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false); // Stop loading indicator
        }
    };

    const handleContinueAsGuest = () => {
        navigation.replace('Home');
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.title}>Login</Text>

                {/* Email Input */}
                <TextInput
                    style={styles.input}
                    placeholder="Email Address"
                    placeholderTextColor={colors.gray500}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    editable={!loading}
                />

                {/* Password Input */}
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor={colors.gray500}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry // Hide password characters
                    autoComplete="password"
                    editable={!loading}
                />

                {/* Login Button */}
                <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleLogin}
                    disabled={loading}>
                    {loading ? (
                        <ActivityIndicator color={colors.white} />
                    ) : (null)}
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>

                {/* Link to Sign Up */}
                <TouchableOpacity onPress={() => navigation.navigate('SignUp')}
                    disabled={loading}>
                    <Text style={[styles.linkText, loading && styles.linkDisabled]}>Don't have an account? Sign Up</Text>
                </TouchableOpacity>
                <Text style={{ textAlign: 'center', top: 15, opacity: 0.5 }}>or</Text>
                <TouchableOpacity style={[styles.button, styles.guestButton]} onPress={handleContinueAsGuest}>
                    <Text style={styles.guestButtonText}>Continue as Guest</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

// Styles for LoginScreen
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.gray100,
    },
    container: {
        flex: 1,
        justifyContent: 'center', // Center content vertically
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: colors.gray800,
        textAlign: 'center',
        marginBottom: 40,
    },
    input: {
        backgroundColor: colors.primary,
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginBottom: 16,
        fontSize: 16,
        borderWidth: 1,
        borderColor: colors.gray300,
        color: colors.gray800, // Text color when typing
    },
    button: {
        backgroundColor: colors.accent,
        paddingVertical: 18,
        borderRadius: 20,
        alignItems: 'center',
        marginTop: 10, // Add some space above the button
        marginBottom: 20,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    buttonDisabled: {
        backgroundColor: colors.gray400, // Visual feedback for disabled state
    },
    buttonText: {
        color: colors.white,
        fontSize: 18,
        fontWeight: '600',
    },
    linkText: {
        color: colors.blue600,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '500',
    },
    linkDisabled: {
        color: colors.gray500, // Visual feedback for disabled state
    },
    guestButtonText: {
        color: colors.accent,
        fontSize: 16,
        fontWeight: '500',
    },
    guestButton: {
        backgroundColor: 'transparent', // No background
        elevation: 0, // No shadow for guest button
        shadowOpacity: 0,
    },
});

export default LoginScreen;
