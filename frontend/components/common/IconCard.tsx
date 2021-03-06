import React from 'react';
import { SvgProps } from 'react-native-svg';
import styled from 'styled-components/native';
import Card from '../common/Card';
import { Body2 } from '../common/Text';

const CardContent = styled.View({
    flexDirection: 'row'
});

const Text = styled(Body2)`
    ${{
        alignSelf: 'center'
    }}
`;

interface Props {
    backgroundColor: string;
    icon: (props: SvgProps) => JSX.Element;
    iconColor: string;
    text: string;
    marginBottom?: number;
}

export default function IconCard({
    backgroundColor,
    icon: Icon,
    iconColor,
    text,
    marginBottom
}: Props) {
    return (
        <Card
            backgroundColor={backgroundColor}
            padding={16}
            style={{ marginBottom: marginBottom || 0 }}
        >
            <CardContent>
                <Icon
                    fill={iconColor}
                    width={18}
                    height={18}
                    style={{ marginRight: 8, marginTop: 3 }}
                />
                <Text flexShrink>{text}</Text>
            </CardContent>
        </Card>
    );
}
