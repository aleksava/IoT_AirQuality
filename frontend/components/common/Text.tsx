import styled from 'styled-components/native';

const Text = styled.Text<{
    color?: string;
    fontSize?: string;
    align?: 'left' | 'center' | 'right';
    bold?: boolean;
}>((props) => ({
    color: props.color ? props.color : props.theme.colors.text.main,
    textAlign: props.align ? props.align : 'left',
    ...(props.fontSize && {
        fontSize: props.fontSize
    }),
    fontFamily: 'notosans-regular',
    ...(props.bold && {
        fontFamily: 'notosans-medium'
    })
}));

export const Heading1 = styled(Text)`
    ${{
        fontFamily: 'notosans-medium',
        fontSize: '24px'
    }}
`;

export const Heading2 = styled(Text)`
    ${{
        fontFamily: 'notosans-medium',
        fontSize: '16px'
    }}
`;

export const Subheading1 = styled(Text)`
    ${{
        fontSize: '12px'
    }}
`;

export const Subheading2 = styled(Text)`
    ${{
        fontSize: '10px'
    }}
`;

export const Body1 = styled(Text)`
    ${{
        fontSize: '14px'
    }}
`;

export const Body2 = styled(Text)`
    ${{
        fontSize: '12px'
    }}
`;

export const NavigationLabel = styled(Text)`
    ${{
        fontSize: '9px'
    }}
`;

export const ChartLabel = styled(Text)`
    ${{
        fontSize: '10px'
    }}
`;

export const ButtonLabel = styled(Text)`
    ${{
        fontFamily: 'notosans-medium',
        fontSize: '14px'
    }}
`;
