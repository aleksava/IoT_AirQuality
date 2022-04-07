import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import {
    createNativeStackNavigator,
    NativeStackNavigationProp
} from '@react-navigation/native-stack';
import * as React from 'react';
import {
    NotificationsStackParamList,
    RoomsStackParamList,
    RootStackParamList,
    RootTabParamList
} from './types';
import LinkingConfiguration from './LinkingConfiguration';
import { useTheme } from 'styled-components';
import { AddIcon, NotificationIcon, RoomsIcon, SettingsIcon } from '../components/icons';
import Settings from '../screens/Settings';
import Notifications from '../screens/Notifications';
import Rooms from '../screens/Rooms';
import { navigationLightTheme } from '../theme';
import Room from '../screens/Room';
import AddRoom from '../screens/AddRoom';
import { Header, HeaderType } from '../components/common/Header';
import IconButton from '../components/common/IconButton';
import SignIn from '../screens/SignIn';
import SignUp from '../screens/SignUp';
import notificationHandler from '../utils/notificationHandler';
import { Host } from 'react-native-portalize';

export default function Navigation() {
    return (
        <NavigationContainer linking={LinkingConfiguration} theme={navigationLightTheme}>
            <Host>
                <RootNavigator />
            </Host>
        </NavigationContainer>
    );
}

function RootNavigator() {
    const Stack = createNativeStackNavigator<RootStackParamList>();

    notificationHandler();

    // TODO: Get signed in state
    const isSignedIn = true;

    return (
        <Stack.Navigator>
            {isSignedIn ? (
                <Stack.Screen
                    name="Root"
                    component={BottomTabNavigator}
                    options={{ headerShown: false }}
                />
            ) : (
                <>
                    <Stack.Screen
                        name="SignIn"
                        component={SignIn}
                        options={{
                            title: 'Sign In',
                            header: (props) => <Header type={HeaderType.Main} headerProps={props} />
                        }}
                    />
                    <Stack.Screen
                        name="SignUp"
                        component={SignUp}
                        options={{
                            title: 'Sign In',
                            header: (props) => <Header type={HeaderType.Main} headerProps={props} />
                        }}
                    />
                </>
            )}
        </Stack.Navigator>
    );
}

const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
    const theme = useTheme();

    return (
        <BottomTab.Navigator
            initialRouteName="RoomsStack"
            screenOptions={{
                tabBarActiveTintColor: theme.colors.text.main,
                tabBarStyle: {
                    backgroundColor: theme.colors.background.gray,
                    height: 56
                },
                tabBarIconStyle: {
                    flexGrow: 0,
                    flexBasis: 24,
                    marginTop: 4
                },
                tabBarItemStyle: {
                    justifyContent: 'center'
                },
                tabBarLabelStyle: {
                    marginTop: 4
                }
            }}
        >
            <BottomTab.Screen
                name="NotificationsStack"
                component={NotificationsStack}
                options={{
                    title: 'Notifications',
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <NotificationIcon width={24} height={24} fill={color} />
                    )
                }}
            />

            <BottomTab.Screen
                name="RoomsStack"
                component={RoomsStack}
                options={{
                    headerShown: false,
                    tabBarLabel: 'Rooms',
                    tabBarIcon: ({ color }) => <RoomsIcon width={24} height={24} fill={color} />
                }}
            />

            <BottomTab.Screen
                name="Settings"
                component={Settings}
                options={{
                    title: 'Settings',
                    header: (props) => <Header type={HeaderType.Main} headerProps={props} />,
                    tabBarIcon: ({ color }) => <SettingsIcon width={24} height={24} fill={color} />
                }}
            />
        </BottomTab.Navigator>
    );
}

function NotificationsStack() {
    const Stack = createNativeStackNavigator<NotificationsStackParamList>();

    return (
        <Stack.Navigator initialRouteName="Notifications">
            <Stack.Screen
                name="Notifications"
                component={Notifications}
                options={{
                    header: (props) => <Header type={HeaderType.Main} headerProps={props} />
                }}
            />
            <Stack.Screen
                name="Room"
                component={Room}
                options={({ route }) => ({
                    header: (props) => <Header type={HeaderType.Stack} headerProps={props} />,
                    title: route.params.room.roomName
                })}
            />
        </Stack.Navigator>
    );
}

function RoomsStack() {
    const theme = useTheme();
    const Stack = createNativeStackNavigator<RoomsStackParamList>();

    const navigation = useNavigation<NativeStackNavigationProp<RoomsStackParamList, 'Rooms'>>();

    return (
        <Stack.Navigator initialRouteName="Rooms">
            <Stack.Screen
                name="Rooms"
                component={Rooms}
                options={{
                    title: 'My Rooms',
                    header: (props) => <Header type={HeaderType.Main} headerProps={props} />,
                    headerRight: () => (
                        <IconButton
                            onPress={() => navigation.navigate('AddRoom')}
                            icon={<AddIcon width={28} height={28} fill={theme.colors.text.main} />}
                        />
                    )
                }}
            />
            <Stack.Screen
                name="Room"
                component={Room}
                options={({ route }) => ({
                    header: (props) => <Header type={HeaderType.Stack} headerProps={props} />,
                    title: route.params.room.roomName
                })}
            />
            <Stack.Screen
                name="AddRoom"
                component={AddRoom}
                options={{
                    title: 'Add Room',
                    header: (props) => <Header type={HeaderType.Stack} headerProps={props} />
                }}
            />
        </Stack.Navigator>
    );
}
