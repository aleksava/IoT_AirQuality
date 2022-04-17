import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Keyboard } from 'react-native';
import { useRecoilRefresher_UNSTABLE } from 'recoil';
import styled, { useTheme } from 'styled-components/native';
import { RoomsService } from '../api/rooms';
import Button from '../components/common/Button';
import Container from '../components/common/Container';
import { Body2 } from '../components/common/Text';
import TextInput from '../components/common/TextInput';
import { ExclamationIcon } from '../components/icons';
import { RoomsStackParamList } from '../navigation/types';
import { roomsState } from '../state/rooms';

const Error = styled.View({
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 20
});

export default function AddRoom() {
    const theme = useTheme();

    const navigation = useNavigation<NativeStackNavigationProp<RoomsStackParamList, 'Rooms'>>();

    const refreshRooms = useRecoilRefresher_UNSTABLE(roomsState);

    const [roomName, setRoomName] = useState<string>('');
    const [roomNameError, setRoomNameError] = useState<string>();

    const [loading, setLoading] = useState<boolean>(false);

    const [error, setError] = useState<string>();

    const handleRoomNameChange = (roomName: string) => {
        setRoomNameError(undefined);
        setError(undefined);
        setRoomName(roomName);
    };

    const validateRoomName = () => {
        if (roomName === '') {
            setRoomNameError('Room name cannot be blank');
            return false;
        }

        return true;
    };

    const addRoom = async () => {
        setRoomNameError(undefined);
        setError(undefined);

        if (validateRoomName()) {
            Keyboard.dismiss();
            setLoading(true);

            await RoomsService.addRoom(roomName)
                .then(async (response) => {
                    if (response) {
                        refreshRooms();
                        navigation.replace('Room', { room: response });
                    }

                    setLoading(false);
                })
                .catch(() => {
                    setError('Unable to add room');
                    setLoading(false);
                });
        }
    };

    return (
        <Container>
            <TextInput
                inputProps={{
                    editable: !loading,
                    placeholder: 'Room name',
                    value: roomName,
                    onChangeText: handleRoomNameChange
                }}
                style={{ marginBottom: error ? 20 : 32 }}
                error={roomNameError}
            />

            {error && (
                <Error>
                    <ExclamationIcon
                        width={12}
                        height={12}
                        fill={theme.colors.error.main}
                        style={{ marginRight: 8 }}
                    />
                    <Body2 color={theme.colors.error.main}>{error}</Body2>
                </Error>
            )}

            <Button
                disabled={loading}
                loading={loading}
                onPress={addRoom}
                backgroundColor={theme.colors.primary.main}
                color={theme.colors.neutrals.white}
            >
                Add room
            </Button>
        </Container>
    );
}
