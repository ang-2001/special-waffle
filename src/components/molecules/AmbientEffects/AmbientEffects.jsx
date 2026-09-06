import styled from 'styled-components';
import { Scanlines } from '../../atoms/Scanlines/Scanlines';
import { Grain } from '../../atoms/Grain/Grain';
import { Vignette } from '../../atoms/Vignette/Vignette';

const Layer = styled.div`
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 9999;
`;

// Subtle-tier scanlines from the mockup's effects doc run at half opacity —
// full-strength is the maximalist tier, not built here.
const AmbientScanlines = styled(Scanlines)`
    opacity: 0.5;
`;

// Ambient VHS texture, mounted once at the app root, fixed to the viewport.
export const AmbientEffects = () => (
    <Layer>
        <Vignette />
        <Grain />
        <AmbientScanlines />
    </Layer>
);

export default AmbientEffects;
