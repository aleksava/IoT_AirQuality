import { AtomEffect } from 'recoil';
import AsyncStorage from '@react-native-async-storage/async-storage';

const syncWithAsyncStorageEffect: <T>(key: string) => AtomEffect<T> =
    (key) =>
    ({ setSelf, onSet, trigger }) => {
        // If there's a persisted value - set it on load
        const loadPersisted = async () => {
            const item = await AsyncStorage.getItem(key);

            if (item != null) {
                setSelf(JSON.parse(item));
            }
        };

        // Asynchronously set the persisted data
        if (trigger === 'get') {
            loadPersisted();
        }

        // Subscribe to state changes and persist them to AsyncStorage
        onSet(async (newValue, _, isReset) => {
            isReset
                ? await AsyncStorage.removeItem(key)
                : await AsyncStorage.setItem(key, JSON.stringify(newValue));
        });
    };

export default syncWithAsyncStorageEffect;
