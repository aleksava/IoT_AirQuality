import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useRef, useState } from 'react';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { useRecoilRefresher_UNSTABLE, useRecoilValue, useResetRecoilState } from 'recoil';
import styled, { useTheme } from 'styled-components/native';
import { RoomsStackParamList } from '../../navigation/types';
import { currentRoomDevicesState, roomIdState } from '../../state/room';
import { roomSubscriptionState } from '../../state/subscription';
import Container from '../common/Container';
import IconButton from '../common/IconButton';
import IconCard from '../common/IconCard';
import { Body1, Heading2 } from '../common/Text';
import { ExclamationIcon, InfoIcon, NotificationIcon, NotificationOffIcon } from '../icons';
import DateTimePicker, { Event } from '@react-native-community/datetimepicker';
import { View } from 'react-native';
import Button from '../common/Button';
import { getExpoPushTokenAsync } from 'expo-notifications';
import axios from 'axios';
import { roundToNearestMinute } from '../../utils/time';
import { useRoomSubcriptionState } from '../../hooks/useRoomSubscription';

const InputContainer = styled.View({
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 32
});

const Input = styled.TouchableOpacity<{ active?: boolean }>((props) => ({
    borderBottomWidth: 1,
    borderBottomColor: props.active
        ? props.theme.colors.neutrals.gray3
        : props.theme.colors.neutrals.gray2,
    color: props.theme.colors.text.main,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 4,
    paddingRight: 4,
    alignSelf: 'flex-start'
}));

const Error = styled.View({
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16
});

interface SubscriptionResponse {
    baseUser_room_composite: any;
    notificationToken: string;
    expiresTimestamp: number;
}

export default function PushNotificationsSettings() {
    const theme = useTheme();

    const roomId = useRecoilValue(roomIdState);
    const roomDevices = useRecoilValue(currentRoomDevicesState);

    const [roomSubscription, setRoomSubscription] = useRoomSubcriptionState(roomId);
    const refreshRoomSubscription = useRecoilRefresher_UNSTABLE(roomSubscriptionState(roomId));
    const resetRoomSubscription = useResetRecoilState(roomSubscriptionState(roomId));

    const navigation = useNavigation<NativeStackNavigationProp<RoomsStackParamList, 'Rooms'>>();

    const modalizeRef = useRef<Modalize>(null);

    const [dateTime, setDateTime] = useState<Date>(new Date());
    const [dateTimeError, setDateTimeError] = useState<string | undefined>();

    const [mode, setMode] = useState<'date' | 'time' | undefined>();

    const [loading, setLoading] = useState<boolean>(false);

    const onChangeDate = (event: Event, selectedDate?: Date) => {
        if (selectedDate) {
            setDateTime((prevValue) => {
                const target = new Date(prevValue.getTime());

                target.setFullYear(selectedDate.getFullYear());
                target.setMonth(selectedDate.getMonth());
                target.setDate(selectedDate.getDate());

                return target;
            });
        }
    };

    const onChangeTime = (event: Event, selectedDate?: Date) => {
        if (selectedDate) {
            setDateTime((prevValue) => {
                const target = new Date(prevValue.getTime());

                target.setHours(selectedDate.getHours());
                target.setMinutes(selectedDate.getMinutes());

                return target;
            });
        }
    };

    useEffect(() => {
        if (dateTime < new Date()) {
            setDateTimeError('Date and time must be in the future');
        } else {
            setDateTimeError(undefined);
        }
    }, [dateTime]);

    const resetDateTime = () => {
        const now = new Date();
        now.setHours(now.getHours() + 1);
        now.setSeconds(0);
        setDateTime(now);
    };

    const onOpen = () => {
        refreshRoomSubscription();
        resetDateTime();
        setMode(undefined);
        modalizeRef.current?.open();
    };

    const updateSubscription = async () => {
        if (dateTimeError === undefined) {
            setLoading(true);

            const pushNotificationToken = (await getExpoPushTokenAsync()).data;

            var diff = Math.abs(new Date().getTime() - dateTime.getTime());
            var minutes = Math.floor(diff / 1000 / 60);

            // Call API to register subscription
            await axios
                .post<SubscriptionResponse>(
                    `${process.env.API_URL}/notifications/subscribe_for_room`,
                    {
                        roomId: roomId,
                        token: pushNotificationToken,
                        lastForMinutes: minutes
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${process.env.BEARER_TOKEN}`
                        }
                    }
                )
                .then(() => {
                    setRoomSubscription(dateTime.getTime());
                    setLoading(false);
                })
                .catch((error) => {
                    console.log(error);
                    setLoading(false);
                });
        }
    };

    const resetSubscription = async () => {
        setLoading(true);
        // Subscription is reset before expiration, remove from backend and local storage
        const pushNotificationToken = (await getExpoPushTokenAsync()).data;

        // Call API to reset subscription (set last for minutes to 0)
        await axios
            .post<SubscriptionResponse>(
                `${process.env.API_URL}/notifications/subscribe_for_room`,
                {
                    roomId: roomId,
                    token: pushNotificationToken,
                    lastForMinutes: 0
                },
                {
                    headers: {
                        Authorization: `Bearer ${process.env.BEARER_TOKEN}`
                    }
                }
            )
            .then(() => {
                resetRoomSubscription();
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    };

    useEffect(() => {
        if (roomDevices.length > 0) {
            if (roomSubscription) {
                // Existing subscription on room
                navigation.setOptions({
                    headerRight: () => (
                        <IconButton
                            onPress={() => onOpen()}
                            icon={
                                <NotificationIcon
                                    width={28}
                                    height={28}
                                    fill={theme.colors.text.main}
                                />
                            }
                        />
                    )
                });
            } else {
                // No subscription on room
                navigation.setOptions({
                    headerRight: () => (
                        <IconButton
                            onPress={() => onOpen()}
                            icon={
                                <NotificationOffIcon
                                    width={28}
                                    height={28}
                                    fill={theme.colors.text.main}
                                />
                            }
                        />
                    )
                });
            }
        }
    }, [roomDevices, roomSubscription]);

    return (
        <Portal>
            <Modalize
                ref={modalizeRef}
                handlePosition="inside"
                adjustToContentHeight
                scrollViewProps={{ scrollEnabled: false }}
            >
                <Container yPadding>
                    <Heading2 style={{ marginBottom: 16 }}>Push notifications</Heading2>
                    {roomSubscription ? (
                        <>
                            <Body1>Push notifications for this room are turned on until:</Body1>
                            <Body1 bold style={{ marginTop: 4, marginBottom: 32 }}>
                                {roundToNearestMinute(new Date(roomSubscription)).toLocaleString(
                                    'en-GB',
                                    {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    }
                                )}
                            </Body1>

                            <Button
                                onPress={() => resetSubscription()}
                                backgroundColor={theme.colors.error.main}
                                color={theme.colors.neutrals.white}
                                loading={loading}
                                disabled={loading}
                            >
                                Turn off
                            </Button>
                        </>
                    ) : (
                        <>
                            <IconCard
                                marginBottom={32}
                                backgroundColor={theme.colors.info.background}
                                icon={InfoIcon}
                                iconColor={theme.colors.info.main}
                                text={
                                    'Turn on push notifications for this room by entering a date and time. You will receive notifications until the date and time expire.'
                                }
                            />

                            <InputContainer>
                                <Input
                                    active={mode === 'date'}
                                    disabled={loading}
                                    onPress={() =>
                                        setMode((prevValue) =>
                                            prevValue != 'date' ? 'date' : undefined
                                        )
                                    }
                                    style={{ marginRight: 8 }}
                                >
                                    <Body1
                                        color={
                                            mode == 'date' ? theme.colors.primary.main : undefined
                                        }
                                    >
                                        {dateTime.toLocaleDateString()}
                                    </Body1>
                                </Input>

                                <Input
                                    active={mode === 'time'}
                                    disabled={loading}
                                    onPress={() =>
                                        setMode((prevValue) =>
                                            prevValue != 'time' ? 'time' : undefined
                                        )
                                    }
                                >
                                    <Body1
                                        color={
                                            mode == 'time' ? theme.colors.primary.main : undefined
                                        }
                                    >
                                        {dateTime.toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </Body1>
                                </Input>
                            </InputContainer>

                            {mode != undefined && (
                                <View
                                    style={{
                                        borderBottomColor: theme.colors.neutrals.gray2,
                                        borderBottomWidth: 1
                                    }}
                                />
                            )}

                            {mode == 'date' ? (
                                <DateTimePicker
                                    display="spinner"
                                    value={dateTime}
                                    mode="date"
                                    onChange={onChangeDate}
                                    themeVariant="light"
                                />
                            ) : mode == 'time' ? (
                                <DateTimePicker
                                    display="spinner"
                                    value={dateTime}
                                    mode="time"
                                    is24Hour={true}
                                    onChange={onChangeTime}
                                    themeVariant="light"
                                />
                            ) : (
                                <></>
                            )}

                            {mode != undefined && (
                                <View
                                    style={{
                                        borderBottomColor: theme.colors.neutrals.gray2,
                                        borderBottomWidth: 1,
                                        marginBottom: 16
                                    }}
                                />
                            )}

                            {dateTimeError && (
                                <Error>
                                    <ExclamationIcon
                                        width={12}
                                        height={12}
                                        fill={theme.colors.error.main}
                                        style={{ marginRight: 4 }}
                                    />
                                    <Body1 color={theme.colors.error.main}>{dateTimeError}</Body1>
                                </Error>
                            )}

                            <Button
                                onPress={updateSubscription}
                                backgroundColor={theme.colors.primary.main}
                                color={theme.colors.neutrals.white}
                                loading={loading}
                                disabled={loading || dateTimeError !== undefined}
                            >
                                Turn on
                            </Button>
                        </>
                    )}
                </Container>
            </Modalize>
        </Portal>
    );
}
