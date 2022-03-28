import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Dimensions, TouchableOpacity } from 'react-native';
import { useRecoilCallback } from 'recoil';
import styled, { useTheme } from 'styled-components/native';
import { RoomsStackParamList } from '../../navigation/types';
import { currentMeasurementState, roomIdState } from '../../state/room';
import { Notification, NotificationType, Room } from '../../state/types';
import Card from '../common/Card';
import { Body1, Body2 } from '../common/Text';
import { ExclamationIcon, NotificationIcon } from '../icons';

const window = Dimensions.get('window');

const Container = styled(Card)<{ index: number }>`
    ${(props) => ({
        width: (window.width - 32) / 2 - 4,
        marginLeft: (props.index + 1) % 2 === 0 ? 4 : 0,
        marginRight: props.index % 2 === 0 ? 4 : 0
    })}
`;

const TitleContainer = styled.View({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%'
});

const RoomName = styled(Body1).attrs({ bold: true })`
    ${{
        flexGrow: 1,
        flexShrink: 1
    }};
`;

const NotificationContainer = styled.View({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: 17,
    marginTop: 8,
    width: '100%'
});

const NotificationText = styled(Body2).attrs({ bold: true })`
    ${(props) => ({
        color: props.theme.colors.notification,
        marginLeft: 4
    })}
`;

function RoomCard({ item, index }: { item: Room; index: number }) {
    const theme = useTheme();
    const navigation = useNavigation<NativeStackNavigationProp<RoomsStackParamList, 'Rooms'>>();

    // TODO: Get current notifications for room
    const notifications: Notification[] = [];

    // TODO: Get notification status for room
    const notificationsOn: boolean = false;

    const goToRoom = useRecoilCallback(({ set, reset }) => async () => {
        set(roomIdState, item.id);
        reset(currentMeasurementState);
        navigation.navigate('Room', { room: item });
    });

    return (
        <TouchableOpacity onPress={() => goToRoom()}>
            <Container
                index={index}
                backgroundColor={notifications.length > 0 ? theme.colors.background.red : undefined}
            >
                <TitleContainer>
                    <RoomName numberOfLines={1}>{item.roomName}</RoomName>
                    {notificationsOn && (
                        <NotificationIcon
                            width={14}
                            height={14}
                            fill={theme.colors.text.subtitle}
                            style={{ marginLeft: 4 }}
                        />
                    )}
                </TitleContainer>

                {/* <Subheading2 numberOfLines={1}>{item.building}</Subheading2> */}

                <NotificationContainer>
                    {notifications.length > 0 && (
                        <>
                            {/* Show first notification */}
                            <ExclamationIcon
                                width={14}
                                height={14}
                                fill={theme.colors.notification}
                            />
                            <NotificationText numberOfLines={1} style={{ flexShrink: 1 }}>
                                {notifications[0].type === NotificationType.OverMaxThreshold
                                    ? `High ${notifications[0].measurement}`
                                    : `Low ${notifications[0].measurement}`}
                            </NotificationText>

                            {/* Count the rest of the notifications, if any */}
                            {notifications.length > 1 && (
                                <NotificationText numberOfLines={1}>
                                    +{notifications.length - 1}
                                </NotificationText>
                            )}
                        </>
                    )}
                </NotificationContainer>
            </Container>
        </TouchableOpacity>
    );
}

export default RoomCard;
