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
import { navigationLightTheme } from '../theme';

export default function Navigation() {
    return (
        <NavigationContainer linking={LinkingConfiguration} theme={navigationLightTheme}>
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
                tabBarActiveTintColor: theme.colors.text.main,
                headerTitleAlign: 'left',
                headerTitle: ({ children }) => <Heading1>{children}</Heading1>,
                headerStyle: {
                    height: 93,
                    backgroundColor: 'transparent'
                },
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
                        <TouchableOpacity onPress={() => alert('Go to add room')}>
                            <AddIcon width={32} height={32} fill={theme.colors.text.main} />
                        </TouchableOpacity>
                    ),
                    headerRightContainerStyle: {
                        paddingRight: 20
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
