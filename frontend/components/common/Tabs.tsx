import { ReactNode } from 'react';
import { TouchableOpacity } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import { Body1 } from './Text';
import { ExclamationIcon } from '../icons';

const ButtonContainer = styled.View<{ index: number }>((props) => ({
    padding: '6px 8px',
    marginLeft: props.index === 0 ? '0px' : '8px'
}));

const TabTitle = styled.View({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
});

const Underline = styled.View((props) => ({
    width: '100%',
    height: '2px',
    backgroundColor: props.theme.colors.text.main,
    borderRadius: '2px',
    position: 'absolute',
    bottom: '0px',
    left: '8px'
}));

interface TabProps {
    index: number;
    children: ReactNode;
    selected: boolean;
    warning?: boolean;
    onPress: () => void;
}

export function Tab(props: TabProps) {
    const theme = useTheme();

    return (
        <TouchableOpacity onPress={() => props.onPress()}>
            <ButtonContainer index={props.index}>
                <TabTitle>
                    <Body1
                        color={props.selected ? theme.colors.text.main : theme.colors.text.subtitle}
                    >
                        {props.children}
                    </Body1>
                    {props.warning && (
                        <ExclamationIcon
                            width={14}
                            height={14}
                            fill={theme.colors.notification}
                            style={{ marginLeft: 4 }}
                        />
                    )}
                </TabTitle>
                {props.selected && <Underline />}
            </ButtonContainer>
        </TouchableOpacity>
    );
}

const ButtonGroup = styled.ScrollView((props) => ({
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 24
}));

interface TabsProps {
    children: React.ReactNode;
}

export function Tabs(props: TabsProps) {
    return (
        <ButtonGroup
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
        >
            {props.children}
        </ButtonGroup>
    );
}
