import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    Image,
} from 'react-native';

// Constants
import { windowWidth } from '../constants/dimensions'; // Adjust path
import { colors } from '../constants/colors'; // Adjust path
import AuthModal from '../components/AuthModal';


// --- Onboarding Screen ---
const OnboardingScreen = ({ navigation }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollViewRef = useRef(null);
    const [isAuthModalVisible, setIsAuthModalVisible] = useState(false);

    // Data for the onboarding slides
    const onboardingData = [
        { title: "Welcome to Our Store!", description: "Discover amazing products curated just for you.", bgColor: colors.accent + 'cc', image: require('../../assets/images/home_1.png') },
        { title: "Exclusive Offers", description: "Get access to special deals and discounts.", bgColor: colors.tint, image: require('../../assets/images/home_2.png') },
        { title: "Shop Anytime, Anywhere", description: "Your favorite store, now in your pocket.", bgColor: colors.gray800 + 'cc', image: require('../../assets/images/home_3.png') },
        { image: require('../../assets/images/logo.png'), title: "WELCOME", description: "Your shopping companion.", bgColor: colors.red800 + 'cc' },
    ];

    // Update active index based on scroll position
    const handleScroll = (event) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(contentOffsetX / windowWidth);
        setActiveIndex(index);
    };

    // Navigate to next slide or home screen
    const handleNext = () => {
        if (activeIndex < onboardingData.length - 1) {
            scrollViewRef.current?.scrollTo({ x: windowWidth * (activeIndex + 1), animated: true });
        } else {
            // Replace onboarding with home so user can't go back
            // navigation.replace('Home');
            setIsAuthModalVisible(true);
        }
    };

    const handleCloseModal = () => {
        setIsAuthModalVisible(false);
    };

    return (
        <>
            <SafeAreaView style={stylesOnboarding.safeArea}>
                {/* <Image style={{ ...StyleSheet.absoluteFillObject, height: '100%', opacity: 0.9 }} source={require('../../assets/images/logo.png')} /> */}

                <View>

                    <Text style={{
                        fontSize: 36,
                        fontWeight: 'bold',
                        color: colors.accent,
                        textAlign: 'center',
                        marginVertical: 30,
                    }}>
                        ushªOªpp
                    </Text>
                </View>
                {/* Horizontal scroll for slides */}
                <ScrollView
                    ref={scrollViewRef}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={handleScroll}
                    scrollEventThrottle={16} // Control how often scroll event fires
                    style={stylesOnboarding.scrollView}
                >

                    {onboardingData.map((item, index) => (

                        <View
                            key={index}
                            style={[stylesOnboarding.slide, { width: windowWidth, backgroundColor: item.bgColor }]}
                        >
                            <Text style={stylesOnboarding.slideTitle}>{item.title}</Text>
                            <Text style={stylesOnboarding.slideDescription}>{item.description}</Text>

                            {item.image && <Image source={item.image} style={stylesOnboarding.backgroundImage} />}
                        </View>
                    ))}
                </ScrollView>

                {/* Pagination dots */}
                <View style={stylesOnboarding.paginationContainer}>
                    {onboardingData.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                stylesOnboarding.paginationDot,
                                activeIndex === index ? stylesOnboarding.paginationDotActive : stylesOnboarding.paginationDotInactive
                            ]}
                        />
                    ))}
                </View>
                {/* Next/Get Started button */}
                <View style={stylesOnboarding.buttonContainer}>
                    <TouchableOpacity onPress={handleNext} style={stylesOnboarding.nextButton}>
                        <Text style={stylesOnboarding.nextButtonText}>
                            {activeIndex === onboardingData.length - 1 ? "Get Started" : "Next"}
                        </Text>
                    </TouchableOpacity>
                </View>
            <AuthModal
                visible={isAuthModalVisible}
                onClose={handleCloseModal}
                navigation={navigation} // Pass navigation prop to the modal
            />
        </SafeAreaView>
        </>
    );
};

// Styles specific to OnboardingScreen
const stylesOnboarding = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.white },
    scrollView: { flex: 1 },
    slide: { height: '100%', alignItems: 'center', justifyContent: 'center', padding: 32 },
    slideTitle: { fontSize: 30, fontWeight: '700', color: colors.primary, textAlign: 'center', marginBottom: 50, marginTop: 180 },
    slideDescription: { fontSize: 18, color: colors.secondary, textAlign: 'center', opacity: 0.8 },
    paginationContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 16, position: 'absolute', bottom: 80, left: 0, right: 0 },
    paginationDot: { height: 8, width: 8, borderRadius: 4, marginHorizontal: 4 },
    paginationDotActive: { backgroundColor: colors.white },
    paginationDotInactive: { backgroundColor: colors.gray400 },
    buttonContainer: { position: 'absolute', bottom: 20, left: 0, right: 0, alignItems: 'center', paddingHorizontal: 32 },
    nextButton: { backgroundColor: colors.accent, paddingVertical: 12, paddingHorizontal: 40, borderRadius: 9999, shadowColor: colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 5 },
    nextButtonText: { fontSize: 18, fontWeight: '600', color: colors.primary },
    backgroundImage: {
        width: windowWidth, height: 300, marginBottom: 10, resizeMode: 'contain', position: 'absolute', top: 0, left: 0, right: 0
    },

});

export default OnboardingScreen;
