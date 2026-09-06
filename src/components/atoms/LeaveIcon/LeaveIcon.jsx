import styled from 'styled-components';

const Svg = styled.svg`
    fill: currentColor;
`;

// Same "exit through a door" glyph used in the Leave & Added Mockups
// artifact's destructive rows — kept as its own atom (rather than inlined
// in ChatInfoPanel) so it can pick up currentColor from whichever
// container colors it red.
export const LeaveIcon = (props) => (
    <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="16px" height="16px" {...props}>
        <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-56-58 102-102H360v-80h326L584-622l56-58 200 200-200 200Z" />
    </Svg>
);

export default LeaveIcon;
