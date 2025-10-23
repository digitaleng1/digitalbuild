
import 'jsvectormap';
import 'jsvectormap/dist/maps/world-merc.js';
import useVectorMap from './useVectorMap';

type WorldVectorMapProps = {
    width?: string;
    height?: string;
    options?: Record<string, unknown>;
};

const WorldMapWithLine = ({ width, height, options }: WorldVectorMapProps) => {
    const { selectorId } = useVectorMap(options, 'world_merc');

    return <div id={selectorId} style={{ width: width, height: height }}></div>;
};

export default WorldMapWithLine;
