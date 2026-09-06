import styled from 'styled-components';
import { Link } from 'react-router';
import { Avatar } from '../Avatar/Avatar';
import { LogoutButton } from '../../atoms/LogoutButton/LogoutButton';
import { chromaHoverMixin } from '../../atoms/ChromaHover/ChromaHover';
import { ChevronRightIcon } from '../../atoms/ChevronRightIcon/ChevronRightIcon';

const UserRowContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${({ theme }) => theme.spacing.xs};
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    background-color: ${({ theme }) => theme.colors.neutralDark[400]};
    color: ${({ theme }) => theme.colors.text.onDark};
    font-family: ${({ theme }) => theme.typography.fontFamily.display};
`;

const UserContent = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
    min-width: 0;
`;

// Opens /profile. Reuses ChromaHover's flicker; chevron fades in on hover as a clickability cue.
const ProfileLink = styled(Link)`
    display: inline-flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xxs};
    color: inherit;
    text-decoration: none;
    border-radius: ${({ theme }) => theme.radii.sm};
    padding: 2px ${({ theme }) => theme.spacing.xxs};
    margin: -2px calc(${({ theme }) => theme.spacing.xxs} * -1);
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    ${chromaHoverMixin}

    &:hover {
        background-color: rgba(255, 255, 255, 0.06);
    }

    .chevron {
        opacity: 0;
        transform: translateX(-3px);
        transition: opacity 150ms ease, transform 150ms ease;
        color: ${({ theme }) => theme.colors.accent.gold};
        flex: none;
    }
    &:hover .chevron,
    &:focus-visible .chevron {
        opacity: 1;
        transform: translateX(0);
    }
`;

export const UserRow = ({ name, ...props }) => (
    <UserRowContainer {...props}>
        <UserContent>
            <Avatar name={name} />
            <ProfileLink to="/profile" aria-label="Open your profile">
                {name}
                <ChevronRightIcon className="chevron" aria-hidden="true" width="17px" height="17px" />
            </ProfileLink>
        </UserContent>
        <LogoutButton />
    </UserRowContainer>
);

export default UserRow;
