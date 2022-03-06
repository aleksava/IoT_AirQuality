import * as React from 'react';
import Svg, { SvgProps, G, Path, Defs, ClipPath } from 'react-native-svg';

const SvgNotificationOff = (props: SvgProps) => (
    <Svg width={512} height={512} viewBox="0 0 24 24" {...props}>
        <G clipPath="url(#notification-off_svg__a)">
            <Path
                d="m22.555 13.662-1.9-6.836A9.321 9.321 0 0 0 2.576 7.3l-1.471 6.615A5 5 0 0 0 5.986 20H7.1a5 5 0 0 0 9.8 0h.838a5 5 0 0 0 4.818-6.338h-.001ZM12 22a3 3 0 0 1-2.816-2h5.632A3 3 0 0 1 12 22Zm8.126-5.185A2.978 2.978 0 0 1 17.737 18H5.986a3 3 0 0 1-2.928-3.65l1.47-6.617a7.321 7.321 0 0 1 14.2-.372l1.9 6.836a2.978 2.978 0 0 1-.502 2.618Z"
                fill="#374957"
            />
        </G>
        <Path stroke="#374957" strokeWidth={2} strokeLinecap="round" d="M2 21.586 21.586 2" />
        <Defs>
            <ClipPath id="notification-off_svg__a">
                <Path fill="#fff" d="M0 0h24v24H0z" />
            </ClipPath>
        </Defs>
    </Svg>
);

export default SvgNotificationOff;
