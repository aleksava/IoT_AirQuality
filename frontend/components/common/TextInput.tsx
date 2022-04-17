import { useState } from 'react';
import { StyleProp, TextInputProps, ViewStyle } from 'react-native';
import { SvgProps } from 'react-native-svg';
import styled, { useTheme } from 'styled-components/native';
import { Body2 } from './Text';

const Container = styled.View({
    flexDirection: 'column'
});

const InputContainer = styled.View({
    flexDirection: 'row',
    alignItems: 'center'
});

const Input = styled.TextInput<{ isFocused: boolean }>((props) => ({
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: props.isFocused
        ? props.theme.colors.neutrals.gray3
        : props.theme.colors.neutrals.gray2,
    color: props.theme.colors.text.main,
    paddingTop: 8,
    paddingBottom: 8
}));

interface Props {
    inputProps: TextInputProps;
    Icon?: (props: SvgProps) => JSX.Element;
    style?: StyleProp<ViewStyle>;
    error?: string;
}

function TextInput({ inputProps, Icon, style, error }: Props) {
    const theme = useTheme();

    const [isFocused, setIsFocused] = useState<boolean>(false);

    return (
        <Container style={style}>
            <InputContainer>
                {Icon && (
                    <Icon
                        fill={theme.colors.neutrals.gray3}
                        width={20}
                        height={20}
                        style={{ marginRight: 16 }}
                    />
                )}
                <Input
                    placeholderTextColor={theme.colors.neutrals.gray3}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    isFocused={isFocused}
                    {...inputProps}
                />
            </InputContainer>
            {error && (
                <Body2 style={{ marginLeft: 36, marginTop: 2 }} color={theme.colors.error.main}>
                    {error}
                </Body2>
            )}
        </Container>
    );
}

export default TextInput;
