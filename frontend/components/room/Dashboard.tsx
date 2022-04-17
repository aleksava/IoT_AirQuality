import { Suspense } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useRecoilValue } from 'recoil';
import styled, { useTheme } from 'styled-components/native';
import { currentRoomDevicesState } from '../../state/room';
import Container from '../common/Container';
import IconCard from '../common/IconCard';
import { InfoIcon } from '../icons';
import CurrentValue from './CurrentValue';
import Legend from './Legend';
import LineChart from './LineChart';
import LookbackSelect from './LookbackSelect';
import MeasurementTabs from './MeasurementTabs';
import Notification from './Notification';
import PushNotificationsSettings from './PushNotificationsSettings';

const DashboardContainer = styled.ScrollView({
    flex: 1,
    height: '100%',
    width: '100%',
    padding: '0 16px 16px 16px'
});

const DashboardSubcontainer = styled.View({
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

export default function Dashboard() {
    const theme = useTheme();

    const roomDevices = useRecoilValue(currentRoomDevicesState);

    return (
        <View style={{ flex: 1 }}>
            {roomDevices.length > 0 ? (
                <>
                    <MeasurementTabs />
                    <DashboardContainer>
                        <Notification />
                        <DashboardSubcontainer>
                            <CurrentValue />
                            <LookbackSelect />
                        </DashboardSubcontainer>
                        <Suspense
                            fallback={
                                <ChartPlaceholder>
                                    <ActivityIndicator
                                        size="large"
                                        color={theme.colors.neutrals.gray2}
                                    />
                                </ChartPlaceholder>
                            }
                        >
                            <LineChart />
                            <Legend />
                        </Suspense>
                    </DashboardContainer>
                    <PushNotificationsSettings />
                </>
            ) : (
                <Container>
                    <IconCard
                        icon={InfoIcon}
                        backgroundColor={theme.colors.info.background}
                        iconColor={theme.colors.info.main}
                        text={'No devices found for this room.'}
                    />
                </Container>
            )}
        </View>
    );
}
