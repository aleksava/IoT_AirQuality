import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RecoilRoot } from 'recoil';
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
            <RecoilRoot>
                <ThemeProvider theme={lightTheme}>
                    <SafeAreaProvider>
                        <Navigation />
                        <StatusBar />
                    </SafeAreaProvider>
                </ThemeProvider>
            </RecoilRoot>
        );
    }
}
