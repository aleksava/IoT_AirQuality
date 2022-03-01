import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Container from '../components/common/Container';
import { Body1 } from '../components/common/Text';
import { NotificationsStackParamList, RoomsStackParamList } from '../navigation/types';

export default function Room({
    route,
    navigation
}: NativeStackScreenProps<NotificationsStackParamList | RoomsStackParamList, 'Room'>) {
    // navigation.setOptions({ title: ROOM_NAME });

    return (
        <Container>
            <Body1>{route.params.roomId}</Body1>
        </Container>
    );
}
