import RNPickerSelect from 'react-native-picker-select';
import { useRecoilState } from 'recoil';
import styled, { useTheme } from 'styled-components/native';
import { lookbackState } from '../../state/room';
import { ArrowSmallDownIcon } from '../icons';

export default function LookbackSelect() {
    const theme = useTheme();

    const [lookback, setLookback] = useRecoilState(lookbackState);

    return (
        <RNPickerSelect
            onValueChange={(value) => setLookback(value)}
            value={lookback}
            placeholder={{}}
            style={{
                inputIOSContainer: {
                    minWidth: 100,
                    alignSelf: 'flex-end'
                },
                inputAndroidContainer: {
                    alignSelf: 'flex-end'
                },
                inputIOS: {
                    backgroundColor: theme.colors.background.gray,
                    color: theme.colors.text.main,
                    fontFamily: 'notosans-regular',
                    paddingRight: 30,
                    fontSize: 12,
                    paddingTop: 8,
                    paddingBottom: 8,
                    paddingLeft: 8,
                    borderRadius: 4
                },
                inputAndroid: {
                    backgroundColor: theme.colors.background.gray,
                    color: theme.colors.text.main,
                    fontFamily: 'notosans-regular',
                    paddingRight: 30,
                    fontSize: 12,
                    paddingTop: 8,
                    paddingBottom: 8,
                    paddingLeft: 8,
                    borderRadius: 4
                },
                iconContainer: {
                    right: 8,
                    height: '100%',
                    justifyContent: 'center'
                }
            }}
            items={[
                { label: '3 hours', value: 3 },
                { label: '6 hours', value: 6 },
                { label: '12 hours', value: 12 },
                { label: '1 day', value: 24 },
                { label: '1 week', value: 168 },
                { label: '2 weeks', value: 336 },
                { label: '1 month', value: 720 }
            ]}
            Icon={() => <ArrowSmallDownIcon fill={theme.colors.text.main} width={16} height={16} />}
        />
    );
}
