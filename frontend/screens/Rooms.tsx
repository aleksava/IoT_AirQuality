import React, { useCallback, useState } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import Container from '../components/common/Container';
import { Body1 } from '../components/common/Text';
import { AddIcon } from '../components/icons';
import RoomCard from '../components/rooms/RoomCard';

export interface Room {
    id: number;
    name: string;
    building: string;
    notificationsOn: boolean;
    notifications: string[];
}

// TODO: Fetch user rooms and their current notifications
const roomsExample: Room[] = [
    {
        id: 1,
        name: 'R92',
        building: 'Realfagbygget',
        notificationsOn: true,
        notifications: ['Low temperature', 'High humidity', 'Low pressure']
    },
    {
        id: 2,
        name: 'R93',
        building: 'Realfagbygget',
        notificationsOn: false,
        notifications: ['Low temperature']
    },
    {
        id: 3,
        name: 'R94',
        building: 'Realfagbygget',
        notificationsOn: false,
        notifications: []
    },
    {
        id: 4,
        name: 'R95',
        building: 'Realfagbygget',
        notificationsOn: false,
        notifications: []
    }
];

const Separator = styled.View({
    height: 8,
    width: '100%'
});

export default function Rooms() {
    const theme = useTheme();

    const [rooms, setRooms] = useState<Room[]>(roomsExample);

    const [refreshing, setRefreshing] = useState<boolean>(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);

        // TODO: Refetch rooms
        new Promise((resolve) => setTimeout(resolve, 1000)).then(() => setRefreshing(false));
    }, []);

    return (
        <Container>
            <FlatList
                bounces={rooms !== undefined && rooms.length > 0}
                contentContainerStyle={{
                    flexGrow: 1,
                    ...((rooms === undefined || rooms.length === 0) && { justifyContent: 'center' })
                }}
                data={rooms}
                renderItem={({ item, index }) => <RoomCard item={item} index={index} />}
                numColumns={2}
                extraData={rooms}
                horizontal={false}
                keyExtractor={(_, i) => i.toString()}
                ItemSeparatorComponent={() => <Separator />}
                refreshControl={
                    rooms !== undefined && rooms.length > 0 ? (
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[theme.colors.border]}
                            tintColor={theme.colors.border}
                        />
                    ) : undefined
                }
                ListEmptyComponent={
                    <>
                        <Body1 color={theme.colors.text.subtitle} align="center">
                            No rooms added.
                        </Body1>
                        <Body1 color={theme.colors.text.subtitle} align="center">
                            Tap <AddIcon width={12} height={12} fill={theme.colors.text.subtitle} />{' '}
                            to add a new room.
                        </Body1>
                    </>
                }
            />
        </Container>
    );
}
