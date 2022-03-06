import { Theme } from '@react-navigation/native';
import 'styled-components';

declare module 'styled-components' {
    export interface DefaultTheme {
        colors: {
            primary: string;
            text: {
                main: string;
                subtitle: string;
            };
            background: {
                white: string;
                gray: string;
                red: string;
            };
            border: string;
            notification: string;
            chart: {
                gridLine: string;
                label: string;
            };
        };
        borderRadius: string;
        transitionDuration: number;
    }
}
