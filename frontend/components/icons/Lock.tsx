import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

const SvgLock = (props: SvgProps) => (
    <Svg height={512} viewBox="0 0 24 24" width={512} {...props}>
        <Path d="M19,8.424V7A7,7,0,0,0,5,7V8.424A5,5,0,0,0,2,13v6a5.006,5.006,0,0,0,5,5H17a5.006,5.006,0,0,0,5-5V13A5,5,0,0,0,19,8.424ZM7,7A5,5,0,0,1,17,7V8H7ZM20,19a3,3,0,0,1-3,3H7a3,3,0,0,1-3-3V13a3,3,0,0,1,3-3H17a3,3,0,0,1,3,3Z" />
        <Path d="M12,14a1,1,0,0,0-1,1v2a1,1,0,0,0,2,0V15A1,1,0,0,0,12,14Z" />
    </Svg>
);

export default SvgLock;
