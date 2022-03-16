import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { useRecoilRefresher_UNSTABLE, useRecoilValue } from 'recoil';
import styled, { useTheme } from 'styled-components/native';
import { roomsState } from '../../state/rooms';
import { Room } from '../../state/types';
import { Body1 } from '../common/Text';
import { AddIcon } from '../icons';
import RoomCard from './RoomCard';

const Separator = styled.View({
    height: 8,
    width: '100%'
});

export default function RoomsList() {
    const theme = useTheme();

    const rooms = useRecoilValue<Room[]>(roomsState);
    const refreshRooms = useRecoilRefresher_UNSTABLE(roomsState);

    const [refreshing, setRefreshing] = useState<boolean>(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        refreshRooms();
    }, []);

    useEffect(() => {
        setRefreshing(false);
    }, [rooms]);

    return (
        <FlatList
            bounces={rooms !== undefined && rooms.length > 0}
            contentContainerStyle={{
                paddingLeft: 16,
                paddingRight: 16,
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
                    <Separator />
                    <Body1 color={theme.colors.text.subtitle} align="center">
                        Tap <AddIcon width={12} height={12} fill={theme.colors.text.subtitle} /> to
                        add a new room.
                    </Body1>
                </>
            }
        />
    );
}
