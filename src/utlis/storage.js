import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeData = async (key, value) => {
    try {
        const stringValue = JSON.stringify(value);
        await AsyncStorage.setItem(key, stringValue);
    } catch (error) {
        throw error;
    }
}

export const getData = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key);
        if (stringValue !== null) {
            return JSON.parse(stringValue);
        }
    } catch (error) {
        throw error;
    }
}