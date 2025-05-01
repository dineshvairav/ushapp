import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TextInput,
    TouchableOpacity,
    Alert, 
    ScrollView, 
    ActivityIndicator
} from 'react-native';

// Constants
import { colors } from '../constants/colors'; // Adjust path as needed
import { supabase } from '../lib/supabase';

// --- Sign Up Screen ---
const SignUpScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // Placeholder sign up handler
    const handleSignUp = async () => {
        // Basic validation
        if (!email || !password || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match.');
            return;
        }
        setLoading(true); 

        try {
            // Use Supabase auth function for sign up
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
                // You can add options like data for user metadata if needed
                // options: {
                //   data: { full_name: 'Example User' }
                // }
            });

            if (error) {
                console.error('Supabase Sign Up Error:', error.message);
                Alert.alert('Sign Up Failed', error.message || 'An unexpected error occurred.');
            } else if (data.user && data.user.identities?.length === 0) {
                // Handle case where user already exists but is unconfirmed
                 console.warn('User already exists but might be unconfirmed:', data.user.email);
                 Alert.alert('Sign Up Info', 'User may already exist. Please check your email to confirm or try logging in.');
                 // Optionally navigate to Login or show a specific message
                 navigation.navigate('Login');
            } else if (data.user) {
                 // Sign up successful!
                 console.log('Sign up successful:', data.user.email);
                 Alert.alert(
                    'Sign Up Successful',
                    'Please check your email for a confirmation link to complete the registration.'
                 );
                 // Navigate to login or a confirmation pending screen
                 navigation.navigate('Login');
            } else {
                 // Handle unexpected cases where there's no error but no user data
                 console.error('Supabase Sign Up - Unexpected Response:', data);
                 Alert.alert('Sign Up Failed', 'An unexpected issue occurred. Please try again.');
            }
        } catch (error) {
            // Catch any unexpected errors during the API call
            console.error('Unexpected Sign Up Error:', error);
            Alert.alert('Sign Up Failed', 'An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false); // Stop loading
        }
    };

    const handleContinueAsGuest = () => {
        navigation.replace('Home'); // Or navigation.navigate('Login');
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                <View style={styles.container}>
                    <Text style={styles.title}>Create Account</Text>

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
                        autoComplete="new-password" 
                        editable={!loading}
                    />

                    {/* Confirm Password Input */}
                    <TextInput
                        style={styles.input}
                        placeholder="Confirm Password"
                        placeholderTextColor={colors.gray500}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry 
                        editable={!loading}
                    />

                    {/* Sign Up Button */}
                    <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]}
                     onPress={handleSignUp}
                     disabled={loading}>
                        {loading ? (
                            <ActivityIndicator color={colors.white} />
                        ) : null}   
                        <Text style={styles.buttonText}>Sign Up</Text>
                    </TouchableOpacity>

                    {/* Link to Login */}
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}
                        disabled={loading} 
                    >
                        <Text style={[styles.linkText, loading && styles.linkDisabled]}>Already have an account? Login</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

// Styles for SignUpScreen
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.gray100,
    },
    scrollViewContainer: {
        flexGrow: 1, // Ensure content can grow to fill space
        justifyContent: 'center', // Center content vertically
    },
    container: {
        paddingHorizontal: 24,
        paddingVertical: 20, // Add vertical padding
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
        color: colors.gray800,
    },
    button: {
        backgroundColor: colors.border, // Use a different color for sign up
        paddingVertical: 18,
        borderRadius: 20,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    buttonDisabled: {
        backgroundColor: colors.gray400,
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
        color: colors.gray500,
    },
});

export default SignUpScreen;
