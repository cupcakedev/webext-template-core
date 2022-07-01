import { css } from 'styled-components';
import NunitoSansLight from './NunitoSans-Light.ttf';
import NunitoSansRegular from './NunitoSans-Regular.ttf';
import NunitoSansSemiBold from './NunitoSans-SemiBold.ttf';
import NunitoSansBold from './NunitoSans-Bold.ttf';
import NunitoSansExtraBold from './NunitoSans-ExtraBold.ttf';

const fontFacesMixin = css`
    @font-face {
        font-family: 'Nunito Sans';
        font-style: normal;
        font-weight: 400;
        src: url(${NunitoSansLight}) format('truetype');
    }
    @font-face {
        font-family: 'Nunito Sans';
        font-style: normal;
        font-weight: 500;
        src: url(${NunitoSansRegular}) format('truetype');
    }
    @font-face {
        font-family: 'Nunito Sans';
        font-style: normal;
        font-weight: 600;
        src: url(${NunitoSansSemiBold}) format('truetype');
    }
    @font-face {
        font-family: 'Nunito Sans';
        font-style: normal;
        font-weight: 700;
        src: url(${NunitoSansBold}) format('truetype');
    }
    @font-face {
        font-family: 'Nunito Sans';
        font-style: normal;
        font-weight: 800;
        src: url(${NunitoSansExtraBold}) format('truetype');
    }
`;
export { fontFacesMixin };
