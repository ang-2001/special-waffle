import styled from 'styled-components';
import { ButtonDark } from '../ButtonDark/ButtonDark';

// Rainbow-stripe hover sweep, layered on top of ButtonDark — reserved for
// auth submit CTAs only (Login, Create Account). Deliberately not built into
// ButtonDark itself: LogoutButton and IconButton also extend ButtonDark and
// are small, frequent controls that shouldn't get a flourish this loud.
export const StreakButton = styled(ButtonDark)`
    position: relative;
    overflow: hidden;
    &::after {
        content: '';
        position: absolute;
        top: 0;
        left: -60%;
        width: 40%;
        height: 100%;
        background: linear-gradient(100deg, ${({ theme }) => theme.colors.accent.rainbow.join(', ')});
        opacity: 0.85;
        mix-blend-mode: screen;
        transform: skewX(-15deg);
        transition: left ${({ theme }) => theme.transitions.sweep} ease-out;
        pointer-events: none;
    }
    @media (prefers-reduced-motion: reduce) {
        &::after { transition: none; }
    }
    &:hover::after, &:focus-visible::after {
        left: 120%;
    }
`;

export default StreakButton;
