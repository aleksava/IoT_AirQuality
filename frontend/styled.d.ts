import { Theme } from '@react-navigation/native';
import 'styled-components';

declare module 'styled-components' {
    export interface DefaultTheme extends Theme {
        colors: Theme['colors'] & {};
        borderRadius: string;
        transitionDuration: number;
    }
}
