import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
} from 'react-native';

// Constants
import { colors } from '../constants/colors'; 
import { supabase } from '../lib/supabase';

// --- About Us Screen ---
const AboutUsScreen = () => {
    return (
        <SafeAreaView style={stylesAbout.safeArea}>
            <ScrollView>
                <View style={stylesAbout.container}>
                    <Text style={stylesAbout.title}>About Us</Text>
                    {/* Card containing the about text */}
                    <View style={stylesAbout.card}>
                        <Text style={stylesAbout.content}>
                            {/* Replace placeholder text with actual About Us content */}
                            Welcome to our store! We are passionate about providing high-quality products and exceptional customer service.
                            {'\n\n'}
                            Our journey started in [Year] with a simple mission: to [Your Mission Statement]. We believe in [Your Core Values].
                            {'\n\n'}
                            Thank you for choosing us. We hope you enjoy your shopping experience!
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

// Styles specific to AboutUsScreen
const stylesAbout = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.gray100 },
    container: { padding: 24 },
    title: { fontSize: 30, fontWeight: '700', color: colors.gray800, marginBottom: 24 },
    card: { backgroundColor: colors.white, padding: 16, borderRadius: 8, shadowColor: colors.black, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 1.41, elevation: 2 },
    content: { fontSize: 16, color: colors.gray700, lineHeight: 24 }, // Line height for readability
});

export default AboutUsScreen;
