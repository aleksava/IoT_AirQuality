import { ActivityIndicator, GestureResponderEvent } from 'react-native';
import styled from 'styled-components/native';
import { Body1 } from './Text';

const Touchable = styled.TouchableOpacity<{ backgroundColor: string }>((props) => ({
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: props.disabled ? 'rgba(0, 0, 0, 0.12)' : props.backgroundColor,
    borderRadius: props.theme.borderRadius,
    height: 36
}));

interface Props {
    children: string;
    onPress: (event?: GestureResponderEvent) => void;
    backgroundColor: string;
    color?: string;
    loading?: boolean;
    disabled?: boolean;
}

export default function Button({
    onPress,
    children,
    backgroundColor,
    color,
    loading,
    disabled
}: Props) {
    return (
        <Touchable onPress={() => onPress()} backgroundColor={backgroundColor} disabled={disabled}>
            {!loading ? (
                <Body1 color={disabled ? 'rgba(0, 0, 0, 0.26)' : color}>{children}</Body1>
            ) : (
                <ActivityIndicator />
            )}
        </Touchable>
    );
}
