import { Background } from '@react-navigation/elements';

export const getProductData = ({ productId, popular, deal, searchTerm }) => {
    let filterFunction;
    searchTerm = searchTerm?.toLowerCase();

    if (productId) {
        filterFunction = (product) => product.id === productId;
    } else if (popular && searchTerm) {
        filterFunction = (product) =>
            (product.name?.toLowerCase().includes(searchTerm) ||
                product.description?.toLowerCase().includes(searchTerm)) &&
            product.popular === true;
    } else if (popular) {
        filterFunction = (product) => product.popular === true;
    } else if (deal) {
        filterFunction = (product) => product.deal === true;
    } else if (searchTerm) {
        filterFunction = (product) => product.name?.toLowerCase().includes(searchTerm) || product.description?.toLowerCase().includes(searchTerm);
    }
    else {
        filterFunction = (product) => product;
    }

    return productData.filter(filterFunction);
};

export const productData = [
    {
        id: 1,
        name: 'Preethi Mixer - PEPPY_PRO',
        category: 'Mixer',
        brand: 'Preethi',
        capacity: '750w',
        price: '6750.00',
        offerPrice: '5750.00',
        currency: '₹',
        description: 'ERGONOMIC DESIGN : Sleepsia car neck pillow provide exceptional support for your neck during car journeys. Designed to cradle your neck and support its natural curvature, reducing strain and promoting relaxation.',
        quantityAvailable: 5,
        deal: true,
        popular: true,
        image: require('./../assets/products/Peppy.png')
    },
    {
        id: 2,
        name: 'Sujata Griner Jar',
        category: 'Accessories',
        brand: 'Sujata',
        capacity: '900w',
        price: '1050.00',
        offerPrice: '850.00',
        currency: '₹',
        description: 'ERGONOMIC DESIGN : Sleepsia car neck pillow provide exceptional support for your neck during car journeys. Designed to cradle your neck and support its natural curvature, reducing strain and promoting relaxation.',
        quantityAvailable: 5,
        deal: true,
        popular: true,
        image: require('./../assets/products/Grinder_Jar.png')
    },
    {
        id: 3,
        name: 'Brass Lamp - GPY',
        category: 'Brass Lamp',
        brand: 'Shiva',
        price: '1250.00',
        offerPrice: '1050.00',
        currency: '₹',
        description: 'ERGONOMIC DESIGN : Sleepsia car neck pillow provide exceptional support for your neck during car journeys. Designed to cradle your neck and support its natural curvature, reducing strain and promoting relaxation.',
        quantityAvailable: 5,
        deal: false,
        popular: true,
        image: require('./../assets/products/Lamp.png')
    },
    {
        id: 4,
        name: 'Bombay Thali - SS',
        category: 'Stainless Steel',
        brand: 'Ankur',
        price: '350.00',
        offerPrice: '250.00',
        currency: '₹',
        description: 'ERGONOMIC DESIGN : Sleepsia car neck pillow provide exceptional support for your neck during car journeys. Designed to cradle your neck and support its natural curvature, reducing strain and promoting relaxation.',
        quantityAvailable: 5,
        deal: false,
        popular: false,
        image: require('./../assets/products/Thali.png')
    },
    {
        id: 5,
        name: 'Twist PC - SS',
        category: 'Cooker',
        brand: 'Anantha',
        capacity: '5 Litres',
        price: '4150.00',
        offerPrice: '3250.00',
        currency: '₹',
        description: 'ERGONOMIC DESIGN : Sleepsia car neck pillow provide exceptional support for your neck during car journeys. Designed to cradle your neck and support its natural curvature, reducing strain and promoting relaxation.',
        quantityAvailable: 5,
        deal: false,
        popular: true,
        image: require('./../assets/products/Twist.png')
    },
];

export const onboardingData = [
    {
        id: 1,
        title: 'Enjoy Shopping with Us',
        summary: 'shoud be anthything to be added later',
        image: require('./../assets/onboarding/home_1.png')
    },
    {
        id: 2,
        title: 'Suitable Price for all Items',
        summary: 'shoud be anthything to be added later',
        image: require('./../assets/onboarding/home_2.png')
    },
    {
        id: 3,
        title: 'Explore Us',
        summary: 'shoud be anthything to be added later',
        image: require('./../assets/onboarding/home_3.png')
    },

];

export const activeUserData = [
    {
        username: 'Dinu',
        email: 'dinu@gmail.com',
        address: '22, Fancy bazaar, CHRY',
    },
];
