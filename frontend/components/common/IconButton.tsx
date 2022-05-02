import { ReactNode } from 'react';
import { GestureResponderEvent } from 'react-native';
import styled from 'styled-components/native';

const Button = styled.TouchableOpacity({
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
});

interface Props {
    onPress: (event?: GestureResponderEvent) => void;
    icon: ReactNode;
}

export default function IconButton({ onPress, icon }: Props) {
    return <Button onPress={() => onPress()}>{icon}</Button>;
}
