import styled from 'styled-components';
import { Link } from 'react-router';
import { GlitchWordmark } from '../../atoms/GlitchWordmark/GlitchWordmark';
import { Tagline } from '../../atoms/Tagline/Tagline';
import { StreakButton } from '../../atoms/StreakButton/StreakButton';
import { PageLink } from '../../atoms/PageLink/PageLink';

const Stage = styled.div`
    background: ${({ theme }) => theme.colors.neutralDark[500]};
    width: 100%;
    min-height: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: ${({ theme }) => theme.spacing.xl};

    @media (max-width: 480px) {
        padding: ${({ theme }) => theme.spacing.lg};
    }
`;

const CtaGroup = styled.div`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    text-align: center;
    gap: ${({ theme }) => theme.spacing.sm};
    width: 320px;
    max-width: 100%;
    margin-top: ${({ theme }) => theme.spacing.xl};
`;

export const LandingHero = () => (
    <Stage>
        <GlitchWordmark>WAFFLER</GlitchWordmark>
        <Tagline>Your conversations, rewound.</Tagline>
        <CtaGroup>
            <StreakButton as={Link} to="/register">⏵ Create Account</StreakButton>
            <PageLink to="/login">Already have an account? Login</PageLink>
        </CtaGroup>
    </Stage>
);

export default LandingHero;
