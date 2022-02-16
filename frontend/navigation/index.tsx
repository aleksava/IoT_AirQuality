import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';

import { RootStackParamList, RootTabParamList } from './types';
import LinkingConfiguration from './LinkingConfiguration';
import { useTheme } from 'styled-components';
import { Heading1 } from '../components/common/Text';
import { AddIcon, NotificationIcon, RoomsIcon, SettingsIcon } from '../components/icons';
import { TouchableOpacity } from 'react-native';
import Settings from '../screens/Settings';
import Notifications from '../screens/Notifications';
import Rooms from '../screens/Rooms';

export default function Navigation() {
    const theme = useTheme();

    return (
        <NavigationContainer linking={LinkingConfiguration} theme={theme}>
            <RootNavigator />
        </NavigationContainer>
    );
}

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Root"
                component={BottomTabNavigator}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}

const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
    const theme = useTheme();

    return (
        <BottomTab.Navigator
            initialRouteName="Rooms"
            screenOptions={{
                tabBarActiveTintColor: theme.colors.text,
                headerTitleAlign: 'left',
                headerTitle: ({ children }) => <Heading1>{children}</Heading1>,
                headerStyle: {
                    height: 93,
                    backgroundColor: 'transparent'
                },
                tabBarStyle: {
                    backgroundColor: theme.colors.card,
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
                name="Notifications"
                component={Notifications}
                options={{
                    title: 'Notifications',
                    tabBarIcon: ({ color }) => (
                        <NotificationIcon width={24} height={24} fill={color} />
                    )
                }}
            />
            <BottomTab.Screen
                name="Rooms"
                component={Rooms}
                options={{
                    title: 'My Rooms',
                    tabBarLabel: 'Rooms',
                    tabBarIcon: ({ color }) => <RoomsIcon width={24} height={24} fill={color} />,
                    headerRight: () => (
                        <TouchableOpacity onPress={() => alert('This is a button!')}>
                            <AddIcon width={32} height={32} fill={theme.colors.text} />
                        </TouchableOpacity>
                    ),
                    headerRightContainerStyle: {
                        paddingRight: 16
                    }
                }}
            />
            <BottomTab.Screen
                name="Settings"
                component={Settings}
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color }) => <SettingsIcon width={24} height={24} fill={color} />
                }}
            />
        </BottomTab.Navigator>
    );
}
