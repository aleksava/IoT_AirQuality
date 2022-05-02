import styled from 'styled-components/native';

const Card = styled.View<{
    width?: string;
    height?: string;
    backgroundColor?: string;
    padding?: number;
}>((props) => ({
    width: props.width || '100%',
    height: props.height || 'auto',
    backgroundColor: props.backgroundColor || props.theme.colors.neutrals.gray1,
    padding: props.padding || '8px',
    borderRadius: props.theme.borderRadius
}));

export default Card;
