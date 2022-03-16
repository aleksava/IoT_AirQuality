import axios from 'axios';
import { selector } from 'recoil';
import { Room } from './types';

export const roomsState = selector<Room[]>({
    key: 'rooms',
    get: async () => {
        const rooms = await axios
            .get<Room[]>(`${process.env.API_URL}/rooms`, {
                headers: {
                    Authorization: `Bearer ${process.env.BEARER_TOKEN}`
                }
            })
            .then((response) => {
                return response;
            })
            .catch((error) => {
                console.log(error);
            });

        return rooms && rooms.data ? rooms.data : [];
    }
});
