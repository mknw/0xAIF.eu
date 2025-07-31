import React, { useState, useEffect, useRef } from 'react';

const blueprintConfig = {
  annotations: [
    { 
      from: 'Technical', 
      to: '0x', 
      position: { top: '-171%', left: '20%' }, 
      alignment: 'right', 
      fromSide: 'bottom', 
      toSide: 'top',
      color: 'text-gray-300' // Matches 0x color
    },
    { 
      from: 'Artificial Inference', 
      to: 'AI', 
      position: { top: '-101%', left: '59%' }, 
      alignment: 'center', 
      fromSide: 'bottom', 
      toSide: 'top',
      color: 'relative',
      customStyle: {
        background: 'linear-gradient(to right, #22d3ee, #3b82f6, #8b5cf6)',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
        textShadow: '0 0 12px rgba(59, 130, 246, 0.3)',
        animation: 'pulse 3s ease-in-out infinite',
      }
    },
    { 
      from: 'Founders', 
      to: 'F', 
      position: { top: '180%', left: '30%' }, 
      alignment: 'left', 
      fromSide: 'top', 
      toSide: 'bottom',
      color: 'text-white/90' // Matches F color
    },
    { 
      from: 'Europe', 
      to: 'eu', 
      position: { top: '100%', left: '81%' }, 
      alignment: 'left', 
      fromSide: 'left', 
      toSide: 'right',
      color: 'bg-gradient-to-tr from-blue-500 via-blue-400 to-yellow-300 bg-clip-text text-transparent' // European flag colors with blue in center
    },
  ],
  lineColor: 'rgba(34, 211, 238, 0.5)', // cyan-400 with opacity
  lineWidth: 2,
  shineAnimation: 'shine 3s ease-in-out infinite',
};

type Side = 'top' | 'bottom' | 'left' | 'right';

const getCurvedPath = (fromRect: DOMRect, toRect: DOMRect) => {
  const start = { x: fromRect.x + fromRect.width / 2, y: fromRect.y + fromRect.height / 2 };
  const end = { x: toRect.x + toRect.width / 2, y: toRect.y + toRect.height / 2 };

  const controlX1 = start.x;
  const controlY1 = start.y + (end.y - start.y) * 0.5;
  const controlX2 = end.x;
  const controlY2 = end.y - (end.y - start.y) * 0.5;

  return `M ${start.x} ${start.y} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${end.x} ${end.y}`;
};

const getOrthogonalPath = (fromRect: DOMRect, toRect: DOMRect, fromSide: Side, toSide: Side, rects: Record<string, DOMRect>) => {
  const offset = 20;
  const p1 = { x: 0, y: 0 };
  const p4 = { x: 0, y: 0 };

  // Determine start point (p1)
  if (fromSide === 'top') { p1.x = fromRect.left + fromRect.width / 2; p1.y = fromRect.top; }
  else if (fromSide === 'bottom') { p1.x = fromRect.left + fromRect.width / 2; p1.y = fromRect.bottom; }
  else if (fromSide === 'left') { p1.x = fromRect.left; p1.y = fromRect.top + fromRect.height / 2; }
  else { p1.x = fromRect.right; p1.y = fromRect.top + fromRect.height / 2; } // right

  // Determine end point (p4)
  const isEuAnnotation = toRect === rects['eu'];
  if (toSide === 'top') { p4.x = toRect.left + toRect.width / 2; p4.y = toRect.top; }
  else if (toSide === 'bottom') { p4.x = toRect.left + toRect.width / 2; p4.y = toRect.bottom; }
  else if (toSide === 'left') { p4.x = toRect.left; p4.y = toRect.top + toRect.height / 2; }
  else { 
    // Add extra space for the 'eu' annotation to ensure the arrow points to the right of the 'u'
    p4.x = toRect.right + (isEuAnnotation ? 30 : 0); 
    p4.y = toRect.top + toRect.height / 2; 
  } // right

  let p2, p3;
  if (fromSide === 'left' || fromSide === 'right') {
    const hOffset = fromSide === 'left' ? -offset : offset;
    p2 = { x: p1.x + hOffset, y: p1.y };
    p3 = { x: p2.x, y: p4.y };
  } else { // top or bottom
    const vOffset = fromSide === 'top' ? -offset : offset;
    p2 = { x: p1.x, y: p1.y + vOffset };
    p3 = { x: p4.x, y: p2.y };
  }

  return `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y} L ${p3.x} ${p3.y} L ${p4.x} ${p4.y}`;
};

const BlueprintHero = () => {
  const [rects, setRects] = useState<Record<string, DOMRect>>({});
  const [isMobile, setIsMobile] = useState(false);
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
    const handleResize = () => {
      measurePositions();
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // Initial check

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.9;
            text-shadow: 0 0 10px rgba(34, 211, 238, 0.5);
          }
          50% {
            opacity: 1;
            text-shadow: 0 0 20px rgba(139, 92, 246, 0.6);
          }
        }
      `}</style>
      {/* Layer 1: Visible Title */}
      <h1 className="relative z-10 font-mono font-bold text-5xl md:text-7xl lg:text-8xl tracking-tighter">
        <span className="text-gray-300">0x</span>
        <span className="inline-block relative group">
          <span className="relative z-10 text-transparent bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-500 bg-clip-text">
            AI
          </span>
          <span className="absolute inset-0 bg-gradient-to-br from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent opacity-90 blur-[2px] group-hover:opacity-100 transition-opacity duration-300">
            AI
          </span>
          <span className="absolute inset-0 bg-white/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
        </span>
        <span className="text-white/90">F</span>
        <span className="text-white/40 font-sans">.</span>
        <span className="bg-gradient-to-tr from-blue-500 via-blue-400 to-yellow-300 bg-clip-text text-transparent">eu</span>
      </h1>

      {/* Layer 2: Annotations & SVG Layer */}
      <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-none">
        {/* Measurement Layer: Invisible text for position calculation */}
        <div className="opacity-0">
          <h1 className="font-bold text-5xl md:text-7xl lg:text-8xl tracking-tighter">
            <span data-title-id="0x">0x</span><span data-title-id="AI">AI</span><span data-title-id="F">F</span><span>.</span><span data-title-id="eu">eu</span>
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
              <div 
                className={`text-lg md:text-xl whitespace-nowrap ${anno.color}`}
                style={anno.customStyle || {}}
              >
                {anno.from}
              </div>
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
            <div 
              className={`text-lg md:text-xl whitespace-nowrap ${anno.color}`}
              style={anno.customStyle || {}}
            >
              {anno.from}
            </div>
          </div>
        ))}

        {/* SVG Lines */}
        <svg className="absolute inset-0 w-full h-full overflow-visible">
          <defs>
            <marker
              id="flat-head"
              markerWidth="1"
              markerHeight="8"
              refX="0.5"
              refY="4"
              orient="auto"
            >
              <path d="M 0 0 L 0 8" stroke={blueprintConfig.lineColor} strokeWidth={blueprintConfig.lineWidth} />
            </marker>
          </defs>
          {Object.keys(rects).length > 0 && blueprintConfig.annotations.map(anno => {
            const fromRect = rects[anno.from];
            const toRect = rects[anno.to];
            if (!fromRect || !toRect) return null;

            const pathData = isMobile
              ? getCurvedPath(fromRect, toRect)
              : getOrthogonalPath(fromRect, toRect, anno.fromSide as Side, anno.toSide as Side, rects);

            return (
              <path
                key={`line-${anno.from}`}
                d={pathData}
                stroke={blueprintConfig.lineColor}
                strokeWidth={blueprintConfig.lineWidth}
                fill="none"
                strokeDasharray={isMobile ? undefined : "4 4"}
                markerEnd={isMobile ? undefined : "url(#flat-head)"}
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default BlueprintHero;
