import { Theme } from '@react-navigation/native';
import 'styled-components';

interface Shades {
    [key: string]: string;
}

interface Palette {
    main: string;
    background: string;
}

declare module 'styled-components' {
    export interface DefaultTheme {
        colors: {
            primary: Palette;
            text: {
                main: string;
                subtitle: string;
            };
            chart: string[];
            neutrals: Shades;
            error: Palette;
            info: Palette;
        };
        borderRadius: string;
        transitionDuration: number;
    }
}
