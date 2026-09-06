import styled, { css, keyframes } from 'styled-components';

const shimmer = keyframes`
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
`;

const Row = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
    padding: ${({ theme }) => theme.spacing.xs};
`;

// Interpolating a keyframes result into a plain template literal (rather
// than one tagged with css``) breaks styled-components' style injection —
// see ChromaHover for the same css`` requirement.
const shimmerMixin = css`
    background: linear-gradient(90deg, #333 25%, #454545 37%, #333 63%);
    background-size: 400% 100%;
    animation: ${shimmer} 1.6s ease-in-out infinite;

    @media (prefers-reduced-motion: reduce) {
        animation: none;
        background: #3a3a3a;
    }
`;

const SkeletonAvatar = styled.span`
    width: 40px;
    height: 40px;
    flex: none;
    border-radius: 50%;
    ${shimmerMixin}
`;

const Lines = styled.span`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;
`;

const NameLine = styled.span`
    height: 22px;
    width: 70%;
    border-radius: ${({ theme }) => theme.radii.sm};
    ${shimmerMixin}
`;

const PreviewLine = styled.span`
    height: 10px;
    width: 45%;
    border-radius: ${({ theme }) => theme.radii.sm};
    ${shimmerMixin}
`;

// Shown while the real friend/chat list is being fetched — same row shape
// as ChatListItem so the layout doesn't jump once real data lands.
export const ChatListSkeleton = ({ rows = 4 }) => (
    <>
        {Array.from({ length: rows }).map((_, i) => (
            <Row key={i}>
                <SkeletonAvatar />
                <Lines>
                    <NameLine />
                    <PreviewLine />
                </Lines>
            </Row>
        ))}
    </>
);

export default ChatListSkeleton;
