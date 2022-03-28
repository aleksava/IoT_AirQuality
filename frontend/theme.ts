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
            red: '#FBEAE5',
            blue: '#E6EFFC'
        },
        border: '#EBEBEB',
        notification: '#E36E6E',
        chart: {
            gridLine: '#F0F2F3',
            label: '#BABABA',
            line: ['#527ebe', '#ffa600', '#bc5090']
        }
    },
    borderRadius: '4px',
    transitionDuration: 150
};
