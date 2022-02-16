import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

const SvgAdd = (props: SvgProps) => (
    <Svg height={512} viewBox="0 0 24 24" width={512} {...props}>
        <Path d="M12 0a12 12 0 1 0 12 12A12.013 12.013 0 0 0 12 0zm0 22a10 10 0 1 1 10-10 10.011 10.011 0 0 1-10 10zm5-10a1 1 0 0 1-1 1h-3v3a1 1 0 0 1-2 0v-3H8a1 1 0 0 1 0-2h3V8a1 1 0 0 1 2 0v3h3a1 1 0 0 1 1 1z" />
    </Svg>
);

export default SvgAdd;
