import { selector } from 'recoil';
import { RoomsService } from '../api/rooms';
import { Room } from './types';

export const roomsState = selector<Room[]>({
    key: 'rooms',
    get: async () => {
        const rooms = await RoomsService.getRooms();

        return rooms || [];
    }
});
