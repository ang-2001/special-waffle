import styled from 'styled-components';

// CRT scanline texture overlay — place inside a `position: relative` parent.
export const Scanlines = styled.div`
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: repeating-linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0.12) 0px,
        rgba(0, 0, 0, 0.12) 1px,
        transparent 2px,
        transparent 3px
    );
    mix-blend-mode: multiply;
`;

export default Scanlines;
