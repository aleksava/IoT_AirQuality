import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Suspense, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useSetRecoilState } from 'recoil';
import styled, { useTheme } from 'styled-components/native';
import CurrentValue from '../components/room/CurrentValue';
import LineChart from '../components/room/LineChart';
import LookbackSelect from '../components/room/LookbackSelect';
import MeasurementTabs from '../components/room/MeasurementTabs';
import Notification from '../components/room/Notification';
import { NotificationsStackParamList, RoomsStackParamList } from '../navigation/types';
import { currentMeasurementState, roomIdState } from '../state/room';
import { Measurement } from '../state/types';

const Container = styled.View({
    width: '100%',
    padding: '0 16px 16px 16px'
});

const Subcontainer = styled.View({
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end'
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
    const measurement = route.params.measurement;

    const setRoomId = useSetRecoilState(roomIdState);
    const setCurrentMeasurement = useSetRecoilState(currentMeasurementState);

    useEffect(() => {
        navigation.setOptions({ title: `${roomParams.roomName}` });
        setRoomId(roomParams.id);
    }, []);

    useEffect(() => {
        if (measurement) {
            setCurrentMeasurement(measurement as Measurement);
        }
    }, [measurement]);

    return (
        <View>
            <MeasurementTabs />
            <Container>
                <Notification />
                <Subcontainer>
                    <CurrentValue />
                    <LookbackSelect />
                </Subcontainer>
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
