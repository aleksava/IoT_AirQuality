import { ReactNode } from 'react';
import { GestureResponderEvent, TouchableOpacity } from 'react-native';

interface Props {
    onPress: (event?: GestureResponderEvent) => void;
    icon: ReactNode;
}

export default function IconButton({ onPress, icon }: Props) {
    return <TouchableOpacity onPress={() => onPress()}>{icon}</TouchableOpacity>;
}
