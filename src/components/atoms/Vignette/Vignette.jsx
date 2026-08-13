import styled from 'styled-components';

// CRT-style edge darkening — place inside a `position: relative`/`fixed`
// parent.
export const Vignette = styled.div`
    position: absolute;
    inset: 0;
    pointer-events: none;
    box-shadow: inset 0 0 140px 40px rgba(0, 0, 0, 0.55);
`;

export default Vignette;
