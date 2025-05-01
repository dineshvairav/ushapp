import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    Linking,
    Alert,
    ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Constants
import { colors } from '../constants/colors';
import { supabase } from '../lib/supabase';

// --- Home Screen ---
const HomeScreen = ({ navigation }) => {
    const [loadingLogout, setLoadingLogout] = useState(false);
    const [uploadedUrl, setUploadedUrl] = useState(null);
    // Replace with your actual website URL
    const websiteUrl = "https://net.usha1960.trade";

    useEffect(() => {
        const getUploadedUrl = async () => {
          const url = await AsyncStorage.getItem('uploadedUrl');
          setUploadedUrl(url);
        };

        getUploadedUrl();
      }, []);

    // Function to open the website in a browser or app
    const openWebsite = () => {
        Linking.openURL(websiteUrl).catch(err => console.error("Couldn't load page", err));
    };
    const handleLogout = async () => {
        setLoadingLogout(true);
        try {
            const { error } = await supabase.auth.signOut();
            if (error) {
                console.error('Supabase Logout Error:', error.message);
                Alert.alert('Logout Failed', error.message || 'An unexpected error occurred.');
            } else {
                console.log('Logout successful');
            }
        } catch (error) {
            console.error('Unexpected Logout Error:', error);
            Alert.alert('Logout Failed', 'An unexpected error occurred. Please try again.');
        } finally {
            setLoadingLogout(false);
        }
    };
    const handleViewDocument = (documentUrl = null) => {
        if (documentUrl) {
            navigation.navigate('ViewDocument', { documentUrl });
        } else {
            Alert.alert('No Document Available', 'Please upload a document first.');
        }
    };

    return (
        <SafeAreaView style={stylesHome.safeArea}>
            <ScrollView>
                <View style={stylesHome.container}>
                    {/* Screen Title */}
                    <Text style={stylesHome.title}></Text>

                    {/* Navigation Buttons */}
                    <TouchableOpacity style={stylesHome.navButton} onPress={() => navigation.navigate('ContactLocation')}>
                        <Text style={stylesHome.navButtonTitle}>Contact & Location</Text>
                        <Text style={stylesHome.navButtonDescription}>Find our store address and contact details.</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={stylesHome.navButton} onPress={() => navigation.navigate('AboutUs')}>
                        <Text style={stylesHome.navButtonTitle}>About Us</Text>
                        <Text style={stylesHome.navButtonDescription}>Learn more about our story.</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={stylesHome.navButton} onPress={openWebsite}>
                        <Text style={stylesHome.navButtonTitle}>Visit Our Website</Text>
                        <Text style={stylesHome.navButtonDescription}>Explore more products online.</Text>
                    </TouchableOpacity>

                    {/* Admin Section Separator */}
                    <View style={stylesHome.adminSection}>
                        <Text style={stylesHome.adminTitle}>Admin Area</Text>
                        {/* Button to navigate to Admin Upload */}
                        <TouchableOpacity style={stylesHome.adminButton} onPress={() => navigation.navigate('AdminUpload')}>
                            <Text style={stylesHome.adminButtonText}>Upload Invoice (Admin)</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Customer Document Viewing Section */}
                    <View style={stylesHome.customerSection}>
                        <Text style={stylesHome.customerNote}>(Customer document viewing requires backend integration)</Text>
                        {/* Button to navigate to View Document (Demo) */}
                        <TouchableOpacity
                            style={stylesHome.customerButton}
                            onPress={() => handleViewDocument(uploadedUrl)} // Call the handler
                        >
                            <Text style={stylesHome.customerButtonText}>View Shared Document </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={stylesHome.logoutSection}>
                        <TouchableOpacity
                            style={[stylesHome.logoutButton, loadingLogout && stylesHome.buttonDisabled]}
                            onPress={handleLogout}
                            disabled={loadingLogout}
                        >
                            {loadingLogout ? (
                                <ActivityIndicator color={colors.white} />
                            ) : (
                                <Text style={stylesHome.logoutButtonText}>Logout</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

// Styles specific to HomeScreen
const stylesHome = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.gray100 },
    container: { padding: 24 },
    title: { fontSize: 30, fontWeight: '700', color: colors.gray800, marginBottom: 24 },
    navButton: { backgroundColor: colors.white, padding: 16, borderRadius: 8, marginBottom: 16, shadowColor: colors.black, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 1.41, elevation: 2 },
    navButtonTitle: { fontSize: 18, fontWeight: '500', color: colors.border },
    navButtonDescription: { fontSize: 14, color: colors.gray600, marginTop: 4 },
    adminSection: { marginTop: 40, borderTopWidth: 1, borderTopColor: colors.gray300, paddingTop: 24 },
    adminTitle: { fontSize: 20, fontWeight: '600', color: colors.gray700, marginBottom: 12 },
    adminButton: { backgroundColor: colors.border, padding: 16, borderRadius: 20, shadowColor: colors.black, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 1.41, elevation: 2 },
    adminButtonText: { fontSize: 18, fontWeight: '500', color: colors.white, textAlign: 'center' },
    customerSection: { marginTop: 24, borderTopWidth: 1, borderTopColor: colors.gray300, paddingTop: 24 },
    customerNote: { fontSize: 16, color: colors.gray500, marginBottom: 12, textAlign: 'center' },
    customerButton: { backgroundColor: colors.accent + 'cc', padding: 16, borderRadius: 20, shadowColor: colors.black, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 1.41, elevation: 2 },
    customerButtonText: { fontSize: 18, fontWeight: '500', color: colors.white, textAlign: 'center' },
    logoutSection: {
        marginTop: 40,
        borderTopWidth: 1,
        borderTopColor: colors.gray300,
        paddingTop: 24,
        alignItems: 'center', // Center logout button
    },
    logoutButton: {
        backgroundColor: colors.gray600, // Different color for logout
        paddingVertical: 15,
        paddingHorizontal: 50,
        borderRadius: 8,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 1.41, elevation: 2 },
    logoutButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.white,
    },
    buttonDisabled: { // Reusable disabled style
        backgroundColor: colors.gray400,
        elevation: 0,
        shadowOpacity: 0,
    },

    
});

export default HomeScreen;
