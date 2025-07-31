import React, { useState, useEffect, useRef } from 'react';

const blueprintConfig = {
  annotations: [
    { from: 'Technical', to: '0x', position: { top: '-40%', left: '-20%' }, alignment: 'right' },
    { from: 'AI', to: 'AI', position: { top: '-20%', left: '35%' }, alignment: 'center' },
    { from: 'Founders', to: 'F', position: { top: '110%', left: '55%' }, alignment: 'left' },
    { from: 'Europe', to: 'eu', position: { top: '60%', left: '110%' }, alignment: 'left' },
  ],
  lineColor: 'rgba(139, 92, 246, 0.7)', // purple-500 with opacity
  lineWidth: 1.5,
};

const BlueprintHero = () => {
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const measurePositions = () => {
      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const newPositions: Record<string, { x: number; y: number }> = {};
      
      containerRef.current.querySelectorAll('[data-title-id], [data-from-id]').forEach(el => {
        const id = (el as HTMLElement).dataset.titleId || (el as HTMLElement).dataset.fromId;
        if (id) {
          const rect = el.getBoundingClientRect();
          newPositions[id] = {
            x: rect.left - containerRect.left + rect.width / 2,
            y: rect.top - containerRect.top + rect.height / 2,
          };
        }
      });
      setPositions(newPositions);
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
              <div className="text-purple-300/80 text-sm md:text-base whitespace-nowrap">{anno.from}</div>
              {anno.from === 'AI' && <div className="text-purple-400/60 text-xs md:text-sm">(Artificial Inference)</div>}
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
            <div className="text-purple-300/80 text-sm md:text-base whitespace-nowrap">{anno.from}</div>
            {anno.from === 'AI' && <div className="text-purple-400/60 text-xs md:text-sm">(Artificial Inference)</div>}
          </div>
        ))}

        {/* SVG Lines */}
        <svg className="absolute inset-0 w-full h-full overflow-visible">
          <defs>
            <marker id="dot" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5">
              <circle cx="5" cy="5" r="2.5" fill={blueprintConfig.lineColor} />
            </marker>
          </defs>
          {Object.keys(positions).length > 0 && blueprintConfig.annotations.map(anno => {
            const fromPos = positions[anno.from];
            const toPos = positions[anno.to];
            if (!fromPos || !toPos) return null;

            return (
              <path
                key={`line-${anno.from}`}
                d={`M ${fromPos.x} ${fromPos.y} L ${toPos.x} ${toPos.y}`}
                stroke={blueprintConfig.lineColor}
                strokeWidth={blueprintConfig.lineWidth}
                fill="none"
                strokeDasharray="4 4"
                markerEnd="url(#dot)"
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default BlueprintHero;
