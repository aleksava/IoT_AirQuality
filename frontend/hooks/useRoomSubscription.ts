import { useEffect } from 'react';
import { SetterOrUpdater, useRecoilState, useResetRecoilState } from 'recoil';
import { roomSubscriptionState } from '../state/subscription';

export function useRoomSubcriptionState(
    roomId: number | undefined
): [number | undefined, SetterOrUpdater<number | undefined>] {
    const [roomSubscription, setRoomSubscription] = useRecoilState(roomSubscriptionState(roomId));
    const resetRoomSubscription = useResetRecoilState(roomSubscriptionState(roomId));

    const expired = roomSubscription && roomSubscription < new Date().getTime();

    useEffect(() => {
        // Remove expired subscription (if any)
        if (roomSubscription && expired) {
            resetRoomSubscription();
        }
    }, [roomSubscription, expired]);

    return [roomSubscription, setRoomSubscription];
}

export function useRoomSubcriptionValue(roomId: number) {
    const [roomSubscription, _setRoomSubscription] = useRoomSubcriptionState(roomId);

    return roomSubscription;
}
