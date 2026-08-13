import styled from 'styled-components';
import { Avatar } from '../Avatar/Avatar';
import { LogoutButton } from '../../atoms/LogoutButton/LogoutButton';

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
`;

export const UserRow = ({ name, ...props }) => (
    <UserRowContainer {...props}>
        <UserContent>
            <Avatar name={name} />
            <span>{name}</span>
        </UserContent>
        <LogoutButton />
    </UserRowContainer>
);

export default UserRow;
