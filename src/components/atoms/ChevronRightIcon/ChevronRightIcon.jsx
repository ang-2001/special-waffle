import styled from 'styled-components';

// Same Material Symbols convention as BackArrowIcon/PowerIcon/etc. (viewBox
// 0 -960 960 960) — chevron_right specifically, not arrow_forward: this is
// a lightweight "leads somewhere" hint revealed on hover, not a primary
// navigation action, so it should stay visually closer to the plain "›"
// glyph it replaces than to BackArrowIcon's heavier full-arrow shape.
const Svg = styled.svg`
    fill: currentColor;
`;

export const ChevronRightIcon = (props) => (
    <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="24px" height="24px" {...props}>
        <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
    </Svg>
);

export default ChevronRightIcon;
