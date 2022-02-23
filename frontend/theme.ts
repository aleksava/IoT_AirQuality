import { DefaultTheme as DefaultLightTheme, Theme } from '@react-navigation/native';
import { DefaultTheme } from 'styled-components';

export const navigationLightTheme: Theme = {
    ...DefaultLightTheme,
    colors: {
        ...DefaultLightTheme.colors,
        primary: '#527EBE',
        background: '#FFFFFF',
        card: '#F4F4F4',
        text: '#374957',
        border: '#EBEBEB',
        notification: '#E36E6E'
    }
};

export const lightTheme: DefaultTheme = {
    colors: {
        primary: '#527EBE',
        text: {
            main: '#374957',
            subtitle: '#676767'
        },
        background: {
            white: '#FFFFFF',
            gray: '#F4F4F4',
            red: '#FBEAE5'
        },
        border: '#EBEBEB',
        notification: '#E36E6E'
    },
    borderRadius: '4px',
    transitionDuration: 150
};
