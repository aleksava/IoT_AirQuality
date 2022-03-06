import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RoomData } from '../state/types';

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList {}
    }
}

export type RootStackParamList = {
    SignIn: undefined;
    SignUp: undefined;
    Root: NavigatorScreenParams<RootTabParamList> | undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
    RootStackParamList,
    Screen
>;

export type RootTabParamList = {
    NotificationsStack: NavigatorScreenParams<NotificationsStackParamList>;
    RoomsStack: NavigatorScreenParams<RoomsStackParamList>;
    Settings: undefined;
};

type RoomParam = {
    room: RoomData;
};

export type NotificationsStackParamList = {
    Notifications: undefined;
    Room: RoomParam;
};

export type RoomsStackParamList = {
    Rooms: undefined;
    Room: RoomParam;
    AddRoom: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> = CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
>;
