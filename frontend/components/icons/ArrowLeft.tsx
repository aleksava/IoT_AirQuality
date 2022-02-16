import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

const SvgArrowLeft = (props: SvgProps) => (
    <Svg viewBox="0 0 24 24" width={512} height={512} {...props}>
        <Path d="M10.6 12.71a1 1 0 0 1 0-1.42l4.59-4.58a1 1 0 0 0 0-1.42 1 1 0 0 0-1.41 0L9.19 9.88a3 3 0 0 0 0 4.24l4.59 4.59a1 1 0 0 0 .7.29 1 1 0 0 0 .71-.29 1 1 0 0 0 0-1.42Z" />
    </Svg>
);

export default SvgArrowLeft;
