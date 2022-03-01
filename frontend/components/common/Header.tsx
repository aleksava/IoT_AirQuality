import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { ReactNode } from 'react';
import { View } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import styled, { useTheme } from 'styled-components/native';
import { ArrowLeftIcon } from '../icons';
import IconButton from './IconButton';
import { Body1, Heading1, Subheading2 } from './Text';

const Container = styled.View((props) => ({
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    padding: `${getStatusBarHeight() + 24}px 16px 24px 16px`,
    backgroundColor: props.theme.colors.background.white
}));

const TitleContainer = styled.View((props) => ({
    display: 'flex',
    flexGrow: 1
}));

export enum HeaderType {
    Main,
    Stack
}

interface Props {
    type: HeaderType;
    headerProps: BottomTabHeaderProps | NativeStackHeaderProps;
    headerRight?: ReactNode;
}

export function Header({ type, headerProps, headerRight }: Props) {
    const theme = useTheme();

    const hasSubtitle = headerProps.options.title?.includes('|');
    const titleList = hasSubtitle ? headerProps.options.title?.split('|') : undefined;
    const title = titleList ? titleList[0] : headerProps.options.title || headerProps.route.name;
    const subtitle = titleList && titleList[1];

    return (
        <Container>
            {type === HeaderType.Stack && (
                <IconButton
                    onPress={() => headerProps.navigation.goBack()}
                    icon={<ArrowLeftIcon width={32} height={32} fill={theme.colors.text.main} />}
                />
            )}
            {hasSubtitle ? (
                <TitleContainer>
                    <Body1 bold align={type === HeaderType.Stack ? 'center' : 'left'}>
                        {title}
                    </Body1>
                    <Subheading2 align={type === HeaderType.Stack ? 'center' : 'left'}>
                        {subtitle}
                    </Subheading2>
                </TitleContainer>
            ) : (
                <Heading1
                    style={{ flexGrow: 1 }}
                    align={type === HeaderType.Stack ? 'center' : 'left'}
                >
                    {title}
                </Heading1>
            )}

            {headerRight || <View style={{ flexBasis: 32 }}></View>}
        </Container>
    );
}
