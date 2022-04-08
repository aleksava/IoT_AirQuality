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
        primary: {
            main: '#527EBE',
            background: '#E6EFFC'
        },
        text: {
            main: '#374957',
            subtitle: '#676767'
        },
        chart: ['#527ebe', '#ffa600', '#bc5090'],
        neutrals: {
            black: '#000000',
            gray4: '#676767', // Subtitle
            gray3: '#BABABA', // Label
            gray2: '#EBEBEB', // Border, loading indicator
            gray1: '#F4F4F4', // Background, grid line
            white: '#FFFFFF'
        },
        error: {
            main: '#E36E6E',
            background: '#FBEAE5'
        },
        info: {
            main: '#527EBE',
            background: '#E6EFFC'
        }
    },
    borderRadius: '4px',
    transitionDuration: 150
};
