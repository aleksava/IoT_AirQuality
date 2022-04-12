import { Room } from '../state/types';
import apiClient from './api';

export const RoomsService = {
    getRooms: () => apiClient.get<Room[]>('/rooms').then((response) => response.data)
};
