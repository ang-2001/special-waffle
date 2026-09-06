import styled from 'styled-components';

// Same Material Symbols export convention as PowerIcon/AddFriendIcon/
// RequestsIcon (viewBox 0 -960 960 960) — matches that family rather than
// hand-drawing an arrow shape that wouldn't sit right alongside them.
// fill: currentColor (not a fixed theme color like those three) since this
// one sits inline next to link text and should always match its color,
// not a fixed hue independent of where it's placed.
const Svg = styled.svg`
    fill: currentColor;
`;

export const BackArrowIcon = (props) => (
    <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="24px" height="24px" {...props}>
        <path d="M313-440l224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
    </Svg>
);

export default BackArrowIcon;
