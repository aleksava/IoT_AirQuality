import React from 'react';
import { Dimensions, TouchableOpacity } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import { Room } from '../../screens/Rooms';
import Card from '../common/Card';
import { Body1, Body2, Subheading2 } from '../common/Text';
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

    return (
        <TouchableOpacity onPress={() => alert('Go to room')}>
            <Container
                index={index}
                backgroundColor={
                    item.notifications.length > 0 ? theme.colors.background.red : undefined
                }
            >
                <TitleContainer>
                    <RoomName numberOfLines={1}>{item.name}</RoomName>
                    {item.notificationsOn && (
                        <NotificationIcon
                            width={14}
                            height={14}
                            fill={theme.colors.text.subtitle}
                            style={{ marginLeft: 4 }}
                        />
                    )}
                </TitleContainer>

                <Subheading2 numberOfLines={1}>{item.building}</Subheading2>

                <NotificationContainer>
                    {item.notifications.length > 0 && (
                        <>
                            {/* Show first notification */}
                            <ExclamationIcon
                                width={14}
                                height={14}
                                fill={theme.colors.notification}
                            />
                            <NotificationText numberOfLines={1} style={{ flexShrink: 1 }}>
                                {item.notifications[0]}
                            </NotificationText>

                            {/* Count the rest of the notifications, if any */}
                            {item.notifications.length > 1 && (
                                <NotificationText numberOfLines={1}>
                                    +{item.notifications.length - 1}
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
