import { AtomEffect } from 'recoil';
import * as SecureStore from 'expo-secure-store';

const syncWithSecureStoreEffect: <T>(key: string) => AtomEffect<T> =
    (key) =>
    ({ setSelf, onSet, trigger }) => {
        // If there's a persisted value - set it on load
        const loadPersisted = async () => {
            const item = await SecureStore.getItemAsync(key);

            if (item != null) {
                setSelf(JSON.parse(item));
            }
        };

        // Asynchronously set the persisted data
        if (trigger === 'get') {
            loadPersisted();
        }

        // Subscribe to state changes and persist them to SecureStore
        onSet(async (newValue, _, isReset) => {
            isReset
                ? await SecureStore.deleteItemAsync(key)
                : await SecureStore.setItemAsync(key, JSON.stringify(newValue));
        });
    };

export default syncWithSecureStoreEffect;
