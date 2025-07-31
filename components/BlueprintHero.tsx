import React, { useState, useEffect, useRef } from 'react';

const blueprintConfig = {
  annotations: [
    { from: 'Technical', to: '0x', position: { top: '-171%', left: '20%' }, alignment: 'right', fromSide: 'bottom', toSide: 'top' },
    { from: 'Artificial Inference', to: 'AI', position: { top: '-101%', left: '59%' }, alignment: 'center', fromSide: 'bottom', toSide: 'top' },
    { from: 'Founders', to: 'F', position: { top: '180%', left: '30%' }, alignment: 'left', fromSide: 'top', toSide: 'bottom' },
    { from: 'Europe', to: 'eu', position: { top: '100%', left: '75%' }, alignment: 'left', fromSide: 'left', toSide: 'right' },
  ],
  lineColor: 'rgba(139, 92, 246, 0.7)', // purple-500 with opacity
  lineWidth: 2,
};

type Side = 'top' | 'bottom' | 'left' | 'right';

const getOrthogonalPath = (fromRect: DOMRect, toRect: DOMRect, fromSide: Side, toSide: Side) => {
  const offset = 20;
  let p2, p3;
  const p1 = { x: fromRect.x + fromRect.width / 2, y: fromRect.y + fromRect.height / 2 };
  const p4 = { x: toRect.x + toRect.width / 2, y: toRect.y + toRect.height / 2 };





  if (fromSide === 'top') { p1.y = fromRect.top; p2 = { x: p1.x, y: p1.y - offset }; }
  else if (fromSide === 'bottom') { p1.y = fromRect.bottom; p2 = { x: p1.x, y: p1.y + offset }; }
  else if (fromSide === 'left') { p1.x = fromRect.left; p2 = { x: p1.x - offset, y: p1.y }; }
  else { p1.x = fromRect.right; p2 = { x: p1.x + offset, y: p1.y }; } // right

  if (toSide === 'top') { p4.y = toRect.top; p3 = { x: p4.x, y: p4.y - offset }; }
  else if (toSide === 'bottom') { p4.y = toRect.bottom; p3 = { x: p4.x, y: p4.y + offset }; }
  else if (toSide === 'left') { p4.x = toRect.left; p3 = { x: p4.x - offset, y: p4.y }; }
  else { p4.x = toRect.right; p3 = { x: p4.x + offset, y: p4.y }; } // right

  // Path construction: M -> L -> L -> L
  return `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y} L ${p3.x} ${p3.y} L ${p4.x} ${p4.y}`;
};

const BlueprintHero = () => {
    const [rects, setRects] = useState<Record<string, DOMRect>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const measurePositions = () => {
      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const newRects: Record<string, DOMRect> = {};
      
      containerRef.current.querySelectorAll('[data-title-id], [data-from-id]').forEach(el => {
        const id = (el as HTMLElement).dataset.titleId || (el as HTMLElement).dataset.fromId;
        if (id) {
          const rect = el.getBoundingClientRect();
          // Store rect relative to the container
          newRects[id] = new DOMRect(
            rect.left - containerRect.left,
            rect.top - containerRect.top,
            rect.width,
            rect.height
          );
        }
      });
      setRects(newRects);
    };

    // Initial measurement after a short delay to allow for rendering
    const timeoutId = setTimeout(measurePositions, 100);

    // Remeasure on window resize
    window.addEventListener('resize', measurePositions);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', measurePositions);
    };
  }, []);
  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Layer 1: Visible Title */}
      <h1 className="relative z-10 font-bold text-5xl md:text-7xl lg:text-8xl tracking-tighter text-white/90">
        <span>0x</span>
        <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">AI</span>
        <span>F</span>
        <span>.eu</span>
      </h1>

      {/* Layer 2: Annotations & SVG Layer */}
      <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-none">
        {/* Measurement Layer: Invisible text for position calculation */}
        <div className="opacity-0">
          <h1 className="font-bold text-5xl md:text-7xl lg:text-8xl tracking-tighter">
            <span data-title-id="0x">0x</span><span data-title-id="AI">AI</span><span data-title-id="F">F</span><span data-title-id="eu">.eu</span>
          </h1>
          {blueprintConfig.annotations.map(anno => (
            <div 
              key={anno.from} 
              data-from-id={anno.from}
              className="absolute" 
              style={{
                top: anno.position.top,
                left: anno.position.left,
                textAlign: anno.alignment as 'left' | 'right' | 'center',
              }}
            >
              <div className="text-purple-300/80 text-lg md:text-xl whitespace-nowrap">{anno.from}</div>
            </div>
          ))}
        </div>

        {/* Visible Annotations */}
        {blueprintConfig.annotations.map(anno => (
          <div 
            key={anno.from} 
            className="absolute" 
            style={{
              top: anno.position.top,
              left: anno.position.left,
              textAlign: anno.alignment as 'left' | 'right' | 'center',
            }}
          >
            <div className="text-purple-300/80 text-lg md:text-xl whitespace-nowrap">{anno.from}</div>
          </div>
        ))}

        {/* SVG Lines */}
        <svg className="absolute inset-0 w-full h-full overflow-visible">
          <defs>

          </defs>
          {Object.keys(rects).length > 0 && blueprintConfig.annotations.map(anno => {
            const fromRect = rects[anno.from];
            const toRect = rects[anno.to];
            if (!fromRect || !toRect) return null;

            return (
              <path
                key={`line-${anno.from}`}
                d={getOrthogonalPath(fromRect, toRect, anno.fromSide as Side, anno.toSide as Side)}
                stroke={blueprintConfig.lineColor}
                strokeWidth={blueprintConfig.lineWidth}
                fill="none"
                strokeDasharray="4 4"
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default BlueprintHero;
