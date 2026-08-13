import styled from 'styled-components';

const AvatarCircle = styled.span`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    flex: none;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.colors.background.surfaceAlt};
    color: ${({ theme }) => theme.colors.text.onSurfaceAlt};
    font-family: ${({ theme }) => theme.typography.fontFamily.displayBold};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

// Placeholder avatar until real profile images exist — renders the first
// initial of `name` rather than hotlinking a stand-in image.
export const Avatar = ({ name, ...props }) => (
    <AvatarCircle {...props}>{name ? name.charAt(0).toUpperCase() : '?'}</AvatarCircle>
);

export default Avatar;
