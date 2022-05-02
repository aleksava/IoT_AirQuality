import * as React from 'react';
import Svg, { SvgProps, Path, Circle } from 'react-native-svg';

const SvgInfo = (props: SvgProps) => (
    <Svg viewBox="0 0 24 24" width={512} height={512} {...props}>
        <Path d="M12,0A12,12,0,1,0,24,12,12.013,12.013,0,0,0,12,0Zm0,22A10,10,0,1,1,22,12,10.011,10.011,0,0,1,12,22Z" />
        <Path d="M12,10H11a1,1,0,0,0,0,2h1v6a1,1,0,0,0,2,0V12A2,2,0,0,0,12,10Z" />
        <Circle cx="12" cy="6.5" r="1.5" />
    </Svg>
);

export default SvgInfo;
