import React from 'react';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Logo({ className = '', iconOnly = false, size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: { 
      icon: 'w-8 h-8', 
      text: 'text-xl', 
      subtext: 'text-[8px]',
      gap: 'gap-2.5'
    },
    md: { 
      icon: 'w-11 h-11', 
      text: 'text-2xl', 
      subtext: 'text-[10px]',
      gap: 'gap-3'
    },
    lg: { 
      icon: 'w-14 h-14', 
      text: 'text-4xl', 
      subtext: 'text-xs',
      gap: 'gap-4'
    },
    xl: { 
      icon: 'w-20 h-20', 
      text: 'text-5xl', 
      subtext: 'text-sm',
      gap: 'gap-5'
    },
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={`flex items-center ${currentSize.gap} ${className}`}>
      {/* Unique Geometric Neural Lock Design */}
      <div className={`relative ${currentSize.icon} flex-shrink-0`}>
        <svg 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            {/* Vibrant gradient */}
            <linearGradient id="uniqueGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
            
            {/* Secondary gradient */}
            <linearGradient id="uniqueGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            
            {/* Neon glow */}
            <filter id="neonGlow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            
            {/* Outer glow */}
            <filter id="outerGlow">
              <feGaussianBlur stdDeviation="2" result="blur"/>
              <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Rotating ring base */}
          <circle cx="50" cy="50" r="42" fill="none" stroke="url(#uniqueGrad1)" strokeWidth="1.5" opacity="0.2" strokeDasharray="4 4"/>
          
          {/* Outer hexagonal frame */}
          <path 
            d="M50 8 L75 22 L75 48 L50 62 L25 48 L25 22 Z" 
            fill="none"
            stroke="url(#uniqueGrad1)"
            strokeWidth="2"
            opacity="0.6"
            filter="url(#outerGlow)"
          />

          {/* Inner geometric shapes - unique layered design */}
          <path 
            d="M50 18 L68 28 L68 48 L50 58 L32 48 L32 28 Z" 
            fill="url(#uniqueGrad2)"
            opacity="0.3"
          />

          {/* Central diamond lock body */}
          <g>
            {/* Lock base */}
            <rect x="38" y="48" width="24" height="20" rx="2" fill="url(#uniqueGrad1)" opacity="0.9"/>
            <rect x="38" y="48" width="24" height="20" rx="2" fill="none" stroke="#06b6d4" strokeWidth="1.5" filter="url(#neonGlow)"/>
            
            {/* Lock shackle - unique angular design */}
            <path 
              d="M42 48 L42 38 Q42 32 50 32 Q58 32 58 38 L58 48" 
              fill="none"
              stroke="url(#uniqueGrad1)"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path 
              d="M42 48 L42 38 Q42 32 50 32 Q58 32 58 38 L58 48" 
              fill="none"
              stroke="#22d3ee"
              strokeWidth="2"
              strokeLinecap="round"
              filter="url(#neonGlow)"
            />
          </g>

          {/* Keyhole with neural design */}
          <g>
            <circle cx="50" cy="56" r="3.5" fill="#0c4a6e"/>
            <circle cx="50" cy="56" r="2.5" fill="#22d3ee" filter="url(#neonGlow)"/>
            <rect x="48.5" y="56" width="3" height="6" rx="1.5" fill="#22d3ee" opacity="0.8"/>
          </g>

          {/* Orbiting particles - unique floating elements */}
          <g fill="#22d3ee" opacity="0.8">
            <circle cx="50" cy="15" r="2" filter="url(#neonGlow)"/>
            <circle cx="78" cy="35" r="1.5" filter="url(#neonGlow)"/>
            <circle cx="78" cy="55" r="1.5" filter="url(#neonGlow)"/>
            <circle cx="50" cy="72" r="2" filter="url(#neonGlow)"/>
            <circle cx="22" cy="55" r="1.5" filter="url(#neonGlow)"/>
            <circle cx="22" cy="35" r="1.5" filter="url(#neonGlow)"/>
          </g>

          {/* Neural connection lines */}
          <g stroke="#06b6d4" strokeWidth="0.8" opacity="0.4">
            <line x1="50" y1="15" x2="50" y2="25"/>
            <line x1="78" y1="35" x2="70" y2="38"/>
            <line x1="78" y1="55" x2="70" y2="52"/>
            <line x1="50" y1="72" x2="50" y2="62"/>
            <line x1="22" y1="55" x2="30" y2="52"/>
            <line x1="22" y1="35" x2="30" y2="38"/>
          </g>

          {/* Corner tech brackets - unique angular design */}
          <g stroke="#22d3ee" strokeWidth="1.8" strokeLinecap="round" opacity="0.7">
            {/* Top left */}
            <path d="M20 25 L20 20 L25 20"/>
            {/* Top right */}
            <path d="M80 25 L80 20 L75 20"/>
            {/* Bottom left */}
            <path d="M20 65 L20 70 L25 70"/>
            {/* Bottom right */}
            <path d="M80 65 L80 70 L75 70"/>
          </g>

          {/* Central cross pattern - unique "X" with depth */}
          <g opacity="0.3">
            <line x1="35" y1="35" x2="45" y2="45" stroke="#22d3ee" strokeWidth="2"/>
            <line x1="65" y1="35" x2="55" y2="45" stroke="#22d3ee" strokeWidth="2"/>
            <line x1="35" y1="65" x2="45" y2="55" stroke="#22d3ee" strokeWidth="2"/>
            <line x1="65" y1="65" x2="55" y2="55" stroke="#22d3ee" strokeWidth="2"/>
          </g>

          {/* Scanning line effect */}
          <g opacity="0.5">
            <line x1="32" y1="43" x2="68" y2="43" stroke="#22d3ee" strokeWidth="0.8" strokeDasharray="2 2"/>
            <line x1="32" y1="50" x2="68" y2="50" stroke="#06b6d4" strokeWidth="1.2"/>
            <line x1="32" y1="57" x2="68" y2="57" stroke="#22d3ee" strokeWidth="0.8" strokeDasharray="2 2"/>
          </g>

          {/* Data flow indicators */}
          <g fill="#22d3ee" opacity="0.6">
            <rect x="29" y="42" width="2" height="2" rx="0.5"/>
            <rect x="69" y="42" width="2" height="2" rx="0.5"/>
            <rect x="29" y="56" width="2" height="2" rx="0.5"/>
            <rect x="69" y="56" width="2" height="2" rx="0.5"/>
          </g>

          {/* Outer accent rings */}
          <g fill="none" stroke="#06b6d4" strokeWidth="0.5" opacity="0.3">
            <circle cx="50" cy="50" r="46"/>
            <circle cx="50" cy="50" r="44" strokeDasharray="3 3"/>
          </g>

          {/* Energy pulse at corners */}
          <g fill="#22d3ee" opacity="0.5">
            <circle cx="25" cy="22" r="1.2"/>
            <circle cx="75" cy="22" r="1.2"/>
            <circle cx="25" cy="68" r="1.2"/>
            <circle cx="75" cy="68" r="1.2"/>
          </g>
        </svg>
      </div>

      {!iconOnly && (
        <div className="flex flex-col -space-y-0.5">
          {/* ThreadXAi Text - Modern Bold Style */}
          <div className="flex items-center">
            <span className={`font-bold ${currentSize.text} text-white tracking-tight`}>
              Thread
            </span>
            <span className={`font-bold ${currentSize.text} tracking-tight bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent`}>
              X
            </span>
            <span className={`font-bold ${currentSize.text} text-white tracking-tight`}>
              Ai
            </span>
          </div>
          
          {/* Tagline with unique accent */}
          <div className="flex items-center gap-2">
            <div className="h-px w-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-transparent"></div>
            <span className={`font-semibold ${currentSize.subtext} bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent uppercase tracking-widest`}>
              Neural Defense
            </span>
          </div>
        </div>
      )}
    </div>
  );
}