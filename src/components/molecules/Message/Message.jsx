import styled from 'styled-components';
import { Avatar } from '../Avatar/Avatar';
import { chromaHoverMixin } from '../../atoms/ChromaHover/ChromaHover';

const Row = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.xs};
    max-width: 70%;
    align-self: ${({ $own }) => ($own ? 'flex-end' : 'flex-start')};
    flex-direction: ${({ $own }) => ($own ? 'row-reverse' : 'row')};
`;

const Bubble = styled.div`
    padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
    border-radius: ${({ theme }) => theme.radii.md};
    border-bottom-left-radius: ${({ theme, $own }) => ($own ? theme.radii.md : '2px')};
    border-bottom-right-radius: ${({ theme, $own }) => ($own ? '2px' : theme.radii.md)};
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    font-size: ${({ theme }) => theme.typography.fontSize.body};
    line-height: 1.4;
    background-color: ${({ theme, $own }) => ($own ? theme.colors.accent.beige : theme.colors.neutralDark[400])};
    color: ${({ theme, $own }) => ($own ? theme.colors.text.onSurfaceAlt : theme.colors.text.onDark)};
    opacity: ${({ $pending }) => ($pending ? 0.6 : 1)};
    ${({ $own }) => $own && chromaHoverMixin}
`;

const Time = styled.span`
    display: block;
    font-family: ${({ theme }) => theme.typography.fontFamily.mono};
    font-size: ${({ theme }) => theme.typography.fontSize.caption};
    color: ${({ theme }) => theme.colors.neutralDark.highlight};
    margin-top: 3px;
`;

const smallAvatarStyle = { width: 28, height: 28, fontSize: 13 };

export const Message = ({ name, text, time, own, pending }) => (
    <Row $own={own}>
        {!own && <Avatar name={name} style={smallAvatarStyle} />}
        <div>
            <Bubble $own={own} $pending={pending}>{text}</Bubble>
            {time && <Time>{time}</Time>}
        </div>
    </Row>
);

export default Message;
