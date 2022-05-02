import { atom, DefaultValue, selectorFamily } from 'recoil';
import syncWithAsyncStorageEffect from '../utils/syncWithAsyncStorageEffect';

interface Subscriptions {
    [roomId: number]: number;
}

export const allSubscriptionsState = atom<Subscriptions>({
    key: 'allSubscriptions',
    default: {},
    effects: [syncWithAsyncStorageEffect<Subscriptions>('roomSubscriptions')]
});

export const roomSubscriptionState = selectorFamily<number | undefined, number | undefined>({
    key: 'roomSubscription',
    get:
        (roomId) =>
        async ({ get }) => {
            const allSubscriptions = get(allSubscriptionsState);

            if (roomId) {
                return allSubscriptions[roomId];
            }

            return undefined;
        },
    set:
        (roomId) =>
        ({ set }, newValue) => {
            if (roomId) {
                if (newValue && !(newValue instanceof DefaultValue)) {
                    // Add/update subscription
                    set(allSubscriptionsState, (prevValue) => ({
                        ...prevValue,
                        [roomId]: newValue
                    }));
                } else {
                    // Remove subscription (if existing)
                    set(allSubscriptionsState, (prevValue) => {
                        var clone = Object.assign({}, prevValue);
                        delete clone[roomId];
                        return clone;
                    });
                }
            }
        }
});
