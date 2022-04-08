import React, { Suspense } from 'react';
import { ActivityIndicator } from 'react-native';
import { useTheme } from 'styled-components/native';
import Container from '../components/common/Container';
import RoomsList from '../components/rooms/RoomsList';

export default function Rooms() {
    const theme = useTheme();

    return (
        <Suspense
            fallback={
                <Container>
                    <ActivityIndicator size="large" color={theme.colors.neutrals.gray2} />
                </Container>
            }
        >
            <RoomsList />
        </Suspense>
    );
}
