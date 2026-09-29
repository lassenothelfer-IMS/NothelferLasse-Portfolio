import { ICONS, PALETTE } from "./iconMaps";

// Horizontal runs of one colour become a single <rect>, which keeps a
// 16×16 icon at a few dozen nodes instead of up to 256. Computed once per
// icon and reused.
const runCache = new Map();

function runsFor(name) {
    if (runCache.has(name)) return runCache.get(name);
    const runs = [];
    ICONS[name].forEach((row, y) => {
        let x = 0;
        while (x < row.length) {
            const ch = row[x];
            let end = x + 1;
            while (end < row.length && row[end] === ch) end++;
            if (ch !== ".") runs.push({ x, y, w: end - x, fill: PALETTE[ch] });
            x = end;
        }
    });
    runCache.set(name, runs);
    return runs;
}

/**
 * Crisp pixel-art icon. Decorative by default; pass `label` when the icon
 * carries meaning on its own.
 */
export default function PixelIcon({ name, size = 32, label, className, style }) {
    const rows = ICONS[name];
    const width = rows[0].length;
    const height = rows.length;
    return (
        <svg
            className={className}
            style={style}
            width={size}
            height={(size * height) / width}
            viewBox={`0 0 ${width} ${height}`}
            shapeRendering="crispEdges"
            role={label ? "img" : undefined}
            aria-label={label}
            aria-hidden={label ? undefined : true}
            focusable="false"
        >
            {runsFor(name).map((r) => (
                <rect key={`${r.x}-${r.y}`} x={r.x} y={r.y} width={r.w} height={1} fill={r.fill} />
            ))}
        </svg>
    );
}
