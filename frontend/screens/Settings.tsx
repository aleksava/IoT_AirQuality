import { useResetRecoilState } from 'recoil';
import { useTheme } from 'styled-components/native';
import Button from '../components/common/Button';
import Container from '../components/common/Container';
import { authState } from '../state/auth';

export default function Settings() {
    const theme = useTheme();

    const resetAuth = useResetRecoilState(authState);

    return (
        <Container>
            <Button
                onPress={resetAuth}
                backgroundColor={theme.colors.primary.main}
                color={theme.colors.neutrals.white}
            >
                Sign out
            </Button>
        </Container>
    );
}
