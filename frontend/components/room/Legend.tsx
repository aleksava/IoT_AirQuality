import { TouchableOpacity } from 'react-native';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import styled, { useTheme } from 'styled-components/native';
import { currentRoomDevicesState, currentRoomVisibleDevicesState } from '../../state/room';
import { ChartLegend } from '../common/Text';

const Container = styled.View({
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: 16,
    marginBottom: 16
});

const LegendItem = styled.View<{ visible: boolean }>((props) => ({
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    opacity: props.visible ? 1 : 0.3
}));

const Dot = styled.View<{ fill: string }>((props) => ({
    width: 10,
    height: 10,
    backgroundColor: props.fill,
    borderRadius: 5,
    marginRight: 5
}));

export default function LegendContainer() {
    const theme = useTheme();
    const currentRoomDevices = useRecoilValue(currentRoomDevicesState);

    const visibleDevices = useRecoilValue(currentRoomVisibleDevicesState);

    const toggleDeviceVisibility = useRecoilCallback(
        ({ snapshot, set }) =>
            async (deviceId: number) => {
                const prevVisibleDevices = await snapshot.getPromise(
                    currentRoomVisibleDevicesState
                );
                const updatedVisibleDevices = [...prevVisibleDevices];

                const i = updatedVisibleDevices.indexOf(deviceId);

                if (i === -1) {
                    updatedVisibleDevices.push(deviceId);
                } else {
                    updatedVisibleDevices.splice(i, 1);
                }

                set(currentRoomVisibleDevicesState, updatedVisibleDevices);
            },
        []
    );

    return (
        <Container>
            {currentRoomDevices.map((device, index) => (
                <TouchableOpacity
                    key={index}
                    onPress={() => toggleDeviceVisibility(device.id)}
                    activeOpacity={0.3}
                >
                    <LegendItem visible={visibleDevices.includes(device.id)}>
                        <Dot fill={theme.colors.chart.line[index]} />
                        <ChartLegend>{device.deviceName}</ChartLegend>
                    </LegendItem>
                </TouchableOpacity>
            ))}
        </Container>
    );
}
