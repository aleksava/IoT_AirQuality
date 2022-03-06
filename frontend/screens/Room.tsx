import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Suspense, useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, View } from 'react-native';
import { useSetRecoilState } from 'recoil';
import styled, { useTheme } from 'styled-components/native';
import IconButton from '../components/common/IconButton';
import { NotificationIcon, NotificationOffIcon } from '../components/icons';
import LineChart from '../components/room/LineChart';
import LookbackSelect from '../components/room/LookbackSelect';
import MeasurementTabs from '../components/room/MeasurementTabs';
import Notification from '../components/room/Notification';
import useLoadable from '../hooks/useLoadable';
import { NotificationsStackParamList, RoomsStackParamList } from '../navigation/types';
import { roomIdState, roomInfoState } from '../state/room';

const Container = styled.ScrollView({
    width: '100%',
    height: '100%',
    padding: '0 16px 16px 16px'
});

const ChartPlaceholder = styled.View({
    height: 240,
    alignItems: 'center',
    justifyContent: 'center'
});

export default function Room({
    route,
    navigation
}: NativeStackScreenProps<NotificationsStackParamList | RoomsStackParamList, 'Room'>) {
    const theme = useTheme();

    const roomParams = route.params.room;

    const setRoomId = useSetRecoilState(roomIdState);
    const { data: roomInfo } = useLoadable(roomInfoState);

    const [refreshing, setRefreshing] = useState<boolean>(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);

        // TODO: Refetch roomInfo and data
        new Promise((resolve) => setTimeout(resolve, 1000)).then(() => setRefreshing(false));
    }, []);

    useEffect(() => {
        navigation.setOptions({ title: `${roomParams.name}|${roomParams.building}` });
        setRoomId(roomParams.id);
    }, []);

    useEffect(() => {
        if (roomInfo) {
            navigation.setOptions({
                headerRight: () =>
                    roomInfo.notificationsOn ? (
                        <IconButton
                            onPress={() => alert('Turn on notifications')}
                            icon={
                                <NotificationIcon
                                    width={26}
                                    height={26}
                                    fill={theme.colors.text.main}
                                />
                            }
                        />
                    ) : (
                        <IconButton
                            onPress={() => alert('Turn off notifications')}
                            icon={
                                <NotificationOffIcon
                                    width={26}
                                    height={26}
                                    fill={theme.colors.text.main}
                                />
                            }
                        />
                    )
            });
        }
    }, [roomInfo]);

    return (
        <View>
            <MeasurementTabs />
            <Container
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[theme.colors.border]}
                        tintColor={theme.colors.border}
                    />
                }
            >
                <Notification />
                <LookbackSelect />
                <Suspense
                    fallback={
                        <ChartPlaceholder>
                            <ActivityIndicator size="large" color={theme.colors.border} />
                        </ChartPlaceholder>
                    }
                >
                    <LineChart />
                </Suspense>
            </Container>
        </View>
    );
}
