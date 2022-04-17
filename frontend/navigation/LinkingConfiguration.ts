import { LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';

import { RootStackParamList } from './types';

const linking: LinkingOptions<RootStackParamList> = {
    prefixes: [Linking.makeUrl('/')],
    config: {
        screens: {
            SignIn: 'signin',
            Root: {
                screens: {
                    RoomsStack: {
                        initialRouteName: 'Rooms',
                        screens: {
                            Rooms: 'rooms',
                            Room: 'room',
                            AddRoom: 'addrooms'
                        }
                    },
                    Settings: 'settings'
                }
            }
        }
    }
};

export default linking;
