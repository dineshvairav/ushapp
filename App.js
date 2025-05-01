import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { colors} from './src/constants/colors'
import { globalStyles } from './src/styles/globalStyles'; 
import OnboardingScreen from './src/screens/OnboardingScreen'; 
import HomeScreen from './src/screens/HomeScreen'; 
import ContactLocationScreen from './src/screens/ContactLocationScreen'; 
import AboutUsScreen from './src/screens/AboutUsScreen'; 
import AdminUploadScreen from './src/screens/AdminUploadScreen'; 
import ViewDocumentScreen from './src/screens/ViewDocumentScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen'; // Import Sign Up screen
import { supabase } from './src/lib/supabase';
import AuthListener from './src/components/AuthListener';

// --- Navigation Setup ---
const Stack = createNativeStackNavigator();

const AuthListenerScreen = () => {
  return <AuthListener />;
};

// --- Main App Component ---
const App = () => {
    // State to track if it's the user's first launch (null means loading)
    const [isFirstLaunch, setIsFirstLaunch] = useState(null);

    useEffect(() => {
        // Function to check if the app has been launched before
        const checkFirstLaunch = async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, 300)); // Simulate loading delay
                setIsFirstLaunch(true);
            } catch (e) {
                console.error("Failed to check first launch status", e);
                setIsFirstLaunch(false);
            }
        };

        checkFirstLaunch();
    }, []); // Run only once on component mount

    // Show loading indicator while checking first launch status
    if (isFirstLaunch === null) {
        return (
            <View style={globalStyles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.blue500} />
            </View>
        );
    }

    // Render the main navigation structure
    return (
        <NavigationContainer>
            <Stack.Navigator
                // Determine the initial screen based on first launch status
                initialRouteName={isFirstLaunch ? "Onboarding" : "Home"}
                // Default screen options (can be overridden per screen)
                screenOptions={{
                    headerShown: false, // Hide header by default
                    headerStyle: { backgroundColor: colors.white },
                    headerTitleStyle: { color: colors.gray800 },
                    headerTintColor: colors.blue600, // Back button color
                }}
            >
                {/* Define the screens in the stack */}
                <Stack.Screen name="Onboarding" component={OnboardingScreen} />
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="AuthListener" component={AuthListenerScreen} />
                <Stack.Screen
                    name="ContactLocation"
                    component={ContactLocationScreen}
                    // Override default options to show header for this screen
                    options={{ headerShown: true, title: 'Contact & Location' }}
                />
                <Stack.Screen
                    name="AboutUs"
                    component={AboutUsScreen}
                    options={{ headerShown: true, title: 'About Us' }}
                />
                <Stack.Screen
                    name="AdminUpload"
                    component={AdminUploadScreen}
                    options={{ headerShown: true, title: 'Admin - Upload Invoice' }}
                />
                <Stack.Screen
                    name="ViewDocument"
                    component={ViewDocumentScreen}
                    options={{ headerShown: true, title: 'View Document' }}
                />
                <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{ headerShown: true, title: 'Sign in' }}
                />
                <Stack.Screen
                    name="SignUp"
                    component={SignUpScreen}
                    options={{ headerShown: true, title: 'Sign up' }}
                />
            </Stack.Navigator>
            {/* Configure the device status bar */}
            <StatusBar style="auto" />
        </NavigationContainer>
    );
};

export default App; // Export the main App component
