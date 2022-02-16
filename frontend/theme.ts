import { DefaultTheme as DefaultLightTheme } from '@react-navigation/native';
import { DefaultTheme } from 'styled-components';

export const lightTheme: DefaultTheme = {
    ...DefaultLightTheme,
    colors: {
        ...DefaultLightTheme.colors,
        primary: '#527EBE',
        background: '#FFFFFF',
        card: '#F4F4F4',
        text: '#374957',
        border: '#EBEBEB',
        notification: '#E36E6E'
    },
    borderRadius: '4px',
    transitionDuration: 150
};
