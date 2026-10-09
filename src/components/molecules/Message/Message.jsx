import styled from 'styled-components';
import { Avatar } from '../Avatar/Avatar';
import { chromaHoverMixin } from '../../atoms/ChromaHover/ChromaHover';

const Row = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.xs};
    max-width: 70%;
    align-self: ${({ $own }) => ($own ? 'flex-end' : 'flex-start')};
    flex-direction: ${({ $own }) => ($own ? 'row-reverse' : 'row')};
    /* Pull follow-ups in a run up under the first, cancelling most of the list gap. */
    margin-top: ${({ theme, $grouped }) => ($grouped ? `calc(${theme.spacing.xxs} - ${theme.spacing.sm})` : 0)};
`;

// Holds the avatar's width on follow-up messages so bubbles stay aligned.
const AvatarSpacer = styled.span`
    width: 28px;
    flex: none;
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

// `grouped`: follows a message from the same sender, so it drops the avatar
// and sits closer to the one above.
export const Message = ({ name, text, time, own, pending, grouped = false }) => (
    <Row $own={own} $grouped={grouped}>
        {!own && (grouped ? <AvatarSpacer /> : <Avatar name={name} style={smallAvatarStyle} />)}
        <div>
            <Bubble $own={own} $pending={pending}>{text}</Bubble>
            {time && <Time>{time}</Time>}
        </div>
    </Row>
);

export default Message;
