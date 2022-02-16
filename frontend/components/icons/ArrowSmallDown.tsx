import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

const SvgArrowSmallDown = (props: SvgProps) => (
    <Svg viewBox="0 0 24 24" width={512} height={512} {...props}>
        <Path d="M18.71 8.21a1 1 0 0 0-1.42 0l-4.58 4.58a1 1 0 0 1-1.42 0L6.71 8.21a1 1 0 0 0-1.42 0 1 1 0 0 0 0 1.41l4.59 4.59a3 3 0 0 0 4.24 0l4.59-4.59a1 1 0 0 0 0-1.41Z" />
    </Svg>
);

export default SvgArrowSmallDown;
