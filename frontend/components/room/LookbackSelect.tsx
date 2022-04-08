import { useState } from 'react';
import RNPickerSelect from 'react-native-picker-select';
import { useRecoilState } from 'recoil';
import { useTheme } from 'styled-components/native';
import { lookbackState } from '../../state/room';
import { ArrowSmallDownIcon } from '../icons';

export default function LookbackSelect() {
    const theme = useTheme();

    const [open, setOpen] = useState<boolean>(false);
    const [lookback, setLookback] = useRecoilState(lookbackState);

    return (
        <RNPickerSelect
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            onValueChange={(value) => setLookback(value)}
            value={lookback}
            placeholder={{}}
            style={{
                inputIOSContainer: {
                    alignSelf: 'flex-end'
                },
                inputAndroidContainer: {
                    alignSelf: 'flex-end'
                },
                inputIOS: {
                    color: theme.colors.text.subtitle,
                    fontFamily: 'notosans-regular',
                    paddingRight: 24,
                    fontSize: 14,
                    paddingTop: 8,
                    paddingBottom: 8,
                    borderBottomWidth: 1,
                    borderBottomColor: theme.colors.neutrals.gray3
                },
                inputAndroid: {
                    color: theme.colors.text.main,
                    fontFamily: 'notosans-regular',
                    paddingRight: 24,
                    fontSize: 14,
                    paddingTop: 8,
                    paddingBottom: 8,
                    borderBottomWidth: 1,
                    borderBottomColor: theme.colors.neutrals.gray3
                },
                iconContainer: {
                    height: '100%',
                    justifyContent: 'center'
                }
            }}
            items={[
                { label: '1 hour', value: 1 },
                { label: '3 hours', value: 3 },
                { label: '6 hours', value: 6 },
                { label: '12 hours', value: 12 },
                { label: '1 day', value: 24 },
                { label: '1 week', value: 168 },
                { label: '2 weeks', value: 336 },
                { label: '1 month', value: 720 }
            ]}
            Icon={() => (
                <ArrowSmallDownIcon
                    fill={open ? theme.colors.primary.main : theme.colors.neutrals.gray4}
                    width={16}
                    height={16}
                />
            )}
        />
    );
}
