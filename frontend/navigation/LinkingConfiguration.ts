/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import { LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';

import { RootStackParamList } from './types';

const linking: LinkingOptions<RootStackParamList> = {
    prefixes: [Linking.makeUrl('/')],
    config: {
        screens: {
            SignIn: 'signin',
            SignUp: 'signup',
            Root: {
                screens: {
                    NotificationsStack: {
                        initialRouteName: 'Notifications',
                        screens: {
                            Notifications: 'notifications',
                            Room: {
                                path: 'room/:roomId/:measurement?',
                                parse: {
                                    id: Number
                                }
                            }
                        }
                    },
                    RoomsStack: {
                        initialRouteName: 'Rooms',
                        screens: {
                            Rooms: 'rooms',
                            Room: {
                                path: 'room/:id',
                                parse: {
                                    id: Number
                                }
                            },
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
