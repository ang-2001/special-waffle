import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router';
import styled, { css, keyframes } from 'styled-components';

const GLITCH_MS = 320;

// No reference CSS exists for this — the mockup only storyboarded stills
// ("brief tracking-glitch tear, then the new page settles in"). Modeled as
// a handful of jagged clip-path/translateX jumps, stepped rather than eased
// so it reads as a tear instead of a smooth shake.
const tear = keyframes`
    0% { clip-path: inset(0 0 92% 0); transform: translateX(-2%); }
    10% { clip-path: inset(18% 0 65% 0); transform: translateX(2%); }
    20% { clip-path: inset(55% 0 20% 0); transform: translateX(-3%); }
    30% { clip-path: inset(2% 0 85% 0); transform: translateX(3%); }
    45% { clip-path: inset(0 0 0 0); transform: translateX(0); }
    100% { clip-path: inset(0 0 0 0); transform: translateX(0); }
`;

// height:100% (not min-height) — this sits directly under BrowserRouter
// (which renders no DOM element of its own), so it's the first real element
// after #root and has to carry the definite-height chain the page templates
// resolve their own 100% heights against.
const Stage = styled.div`
    height: 100%;
    overflow: hidden;

    ${({ $glitching }) => $glitching && css`
        animation: ${tear} ${GLITCH_MS}ms steps(6, jump-none);
    `}

    @media (prefers-reduced-motion: reduce) {
        animation: none !important;
    }
`;

// Plays the tracking-glitch tear on every route change (not on first mount).
export const RouteTransition = ({ children }) => {
    const location = useLocation();
    const isFirstRender = useRef(true);
    const [glitching, setGlitching] = useState(false);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        setGlitching(true);
        const timeout = setTimeout(() => setGlitching(false), GLITCH_MS);
        return () => clearTimeout(timeout);
    }, [location.pathname]);

    return <Stage $glitching={glitching}>{children}</Stage>;
};

export default RouteTransition;
