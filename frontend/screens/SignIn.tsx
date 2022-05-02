import { useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, View } from 'react-native';
import { useSetRecoilState } from 'recoil';
import styled, { useTheme } from 'styled-components/native';
import { AuthService } from '../api/auth';
import Button from '../components/common/Button';
import Container from '../components/common/Container';
import { Body2, Heading1, Subheading1 } from '../components/common/Text';
import TextInput from '../components/common/TextInput';
import { AtIcon, ExclamationIcon, LockIcon } from '../components/icons';
import { authState } from '../state/auth';

const Error = styled.View({
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 20
});

const emailRegExp =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default function SignIn() {
    const theme = useTheme();

    const [email, setEmail] = useState<string>('');
    const [emailError, setEmailError] = useState<string>();
    const [password, setPassword] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string>();

    const [error, setError] = useState<string>();

    const [loading, setLoading] = useState<boolean>(false);

    const setAuth = useSetRecoilState(authState);

    const handleEmailChange = (email: string) => {
        setEmailError(undefined);
        setError(undefined);
        setEmail(email);
    };

    const handlePasswordChange = (password: string) => {
        setPasswordError(undefined);
        setError(undefined);
        setPassword(password);
    };

    const validateEmail = () => {
        if (email === '') {
            setEmailError('E-mail cannot be blank');
            return false;
        } else if (!emailRegExp.test(email)) {
            setEmailError('Invalid e-mail address');
            return false;
        }

        return true;
    };

    const validatePassword = () => {
        if (password === '') {
            setPasswordError('Password cannot be blank');
            return false;
        }

        return true;
    };

    const signIn = async () => {
        setEmailError(undefined);
        setPasswordError(undefined);
        setError(undefined);

        if ([validateEmail(), validatePassword()].every(Boolean)) {
            Keyboard.dismiss();
            setLoading(true);

            await AuthService.signIn(email, password)
                .then(async (response) => {
                    if (response.access_token) {
                        setAuth({ accessToken: response.access_token });
                    }
                })
                .catch((error) => {
                    const status = error.response.status;
                    const errorType = error.response.data.error;

                    if (status === 400 && errorType === 'invalid_request') {
                        setError('Invalid login request');
                    } else if (status === 403 && errorType === 'invalid_grant') {
                        setError('Wrong e-mail or password');
                    } else if (status === 429 && errorType === 'too_many_requests') {
                        setError('Too many login attempts');
                    } else if (status === 500) {
                        setError('Could not connect to authentication server');
                    }

                    setLoading(false);
                });
        }
    };

    return (
        <Container style={{ flex: 1 }}>
            <KeyboardAvoidingView
                style={{ flex: 1, justifyContent: 'center' }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View style={{ marginBottom: 20 }}>
                    <Heading1 style={{ marginBottom: 4 }} align="center">
                        EITAQ
                    </Heading1>
                    <Subheading1 align="center">Monitor your indoor environment</Subheading1>
                </View>
                <TextInput
                    inputProps={{
                        editable: !loading,
                        placeholder: 'E-mail',
                        value: email,
                        onChangeText: handleEmailChange
                    }}
                    Icon={AtIcon}
                    style={{ marginBottom: 20 }}
                    error={emailError}
                />

                <TextInput
                    inputProps={{
                        editable: !loading,
                        placeholder: 'Password',
                        value: password,
                        onChangeText: handlePasswordChange,
                        secureTextEntry: true
                    }}
                    Icon={LockIcon}
                    style={{ marginBottom: error ? 20 : 32 }}
                    error={passwordError}
                />

                {error && (
                    <Error>
                        <ExclamationIcon
                            width={12}
                            height={12}
                            fill={theme.colors.error.main}
                            style={{ marginRight: 8 }}
                        />
                        <Body2 color={theme.colors.error.main}>{error}</Body2>
                    </Error>
                )}
                <Button
                    disabled={loading}
                    loading={loading}
                    onPress={signIn}
                    backgroundColor={theme.colors.primary.main}
                    color={theme.colors.neutrals.white}
                >
                    Sign in
                </Button>
            </KeyboardAvoidingView>
        </Container>
    );
}
