import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from 'styled-components';

import useCachedResources from './hooks/useCachedResources';
import Navigation from './navigation';
import { lightTheme } from './theme';

export default function App() {
    const isLoadingComplete = useCachedResources();

    if (!isLoadingComplete) {
        return null;
    } else {
        return (
            <ThemeProvider theme={lightTheme}>
                <SafeAreaProvider>
                    <Navigation />
                    <StatusBar />
                </SafeAreaProvider>
            </ThemeProvider>
        );
    }
}
