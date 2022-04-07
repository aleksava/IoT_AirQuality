import styled from 'styled-components/native';

const Container = styled.View<{ yPadding?: boolean }>((props) => ({
    width: '100%',
    height: '100%',
    paddingLeft: '16px',
    paddingRight: '16px',
    ...(props.yPadding && {
        paddingTop: '32px',
        paddingBottom: '32px'
    })
}));

export default Container;
