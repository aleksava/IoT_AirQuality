import { atom } from 'recoil';
import syncWithSecureStoreEffect from '../utils/syncWithSecureStoreEffect';

interface Auth {
    accessToken?: string;
}

export const authState = atom<Auth>({
    key: 'auth',
    default: {},
    effects: [syncWithSecureStoreEffect<Auth>('auth')]
});
