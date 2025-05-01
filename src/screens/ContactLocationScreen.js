import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    Platform,
    Linking,
} from 'react-native';

// Constants
import { colors } from '../constants/colors'; // Adjust path

// --- Contact & Location Screen ---
const ContactLocationScreen = () => {
    // Replace with your actual store details
    const storeAddress = "Usha Metals & Agency, Fancy Bazaar, Changanacherry - 686101";
    const storePhone = "91-9961295835";

    // Prepare query for map links
    const googleMapsQuery = encodeURIComponent(storeAddress);
    // Platform-specific map URL scheme
    const mapUrl = Platform.OS === 'ios'
        ? `maps://app?q=${googleMapsQuery}` // iOS Maps app
        : `geo:0,0?q=${googleMapsQuery}`; // Android geo intent

    // Function to open the address in the default map app
    const openMap = () => {
        Linking.openURL(mapUrl).catch(() => {
            // Fallback to web map if app link fails
            Linking.openURL(`https://maps.google.com/?q=${googleMapsQuery}`);
        });
    };

    // Function to initiate a phone call
    const callStore = () => {
        Linking.openURL(`tel:${storePhone}`).catch(err => console.error("Couldn't make call", err));
    }

    return (
        <SafeAreaView style={stylesContact.safeArea}>
            <View style={stylesContact.container}>
                <Text style={stylesContact.title}>Contact & Location</Text>

                {/* Address Card */}
                <View style={stylesContact.card}>
                    <Text style={stylesContact.cardTitle}>Our Address:</Text>
                    <Text style={stylesContact.cardText}>{storeAddress}</Text>
                    <TouchableOpacity onPress={openMap} style={stylesContact.mapButton}>
                        <Text style={stylesContact.buttonText}>Open in Maps</Text>
                    </TouchableOpacity>
                </View>

                {/* Phone Card */}
                <View style={stylesContact.card}>
                    <Text style={stylesContact.cardTitle}>Call Us:</Text>
                    <Text style={stylesContact.cardText}>{storePhone}</Text>
                    <TouchableOpacity onPress={callStore} style={stylesContact.callButton}>
                        <Text style={stylesContact.buttonText}>Call Now</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

// Styles specific to ContactLocationScreen
const stylesContact = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.gray100 },
    container: { padding: 24 },
    title: { fontSize: 30, fontWeight: '700', color: colors.gray800, marginBottom: 24 },
    card: { backgroundColor: colors.white, padding: 16, borderRadius: 8, marginBottom: 16, shadowColor: colors.black, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 1.41, elevation: 2 },
    cardTitle: { fontSize: 18, fontWeight: '500', color: colors.gray700, marginBottom: 8 },
    cardText: { fontSize: 16, color: colors.gray600, marginBottom: 12 },
    mapButton: { backgroundColor: colors.accent, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 10, alignSelf: 'flex-start' },
    callButton: { backgroundColor: colors.border, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 10, alignSelf: 'flex-start' },
    buttonText: { color: colors.white, fontWeight: '500', fontSize: 14 },
});

export default ContactLocationScreen;
