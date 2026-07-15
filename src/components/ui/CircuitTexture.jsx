import React from 'react';

/**
 * Low-opacity circuit outline background texture.
 *
 * The path loosely traces the Silverstone circuit layout (2023+ configuration)
 * as a top-down silhouette — both outer and inner track edges — at ~4% white
 * opacity. It exists to give the hero panel depth and place the product in an
 * F1 context without competing with the timing data in the foreground.
 *
 * Usage: mount as `position: absolute, inset: 0` behind hero content.
 * Never render at full opacity — this is ambient texture, not decoration.
 */
export default function CircuitTexture({ className = '' }) {
  return (
    <svg
      className={`absolute inset-0 w-full h-full pointer-events-none select-none ${className}`}
      viewBox="0 0 1100 560"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      aria-hidden="true"
    >
      {/*
        Outer track edge — Silverstone simplified
        Key landmarks traced (roughly, not cartographically accurate):
          - Main straight / pit lane (bottom, ~120→700)
          - Copse → Maggots → Becketts esses (right side, sweeping)
          - Chapel → Hangar straight (top right)
          - Stowe corner (far right, tight)
          - Club → Abbey → Loop (left/upper-left)
          - Woodcote chicane into main straight
      */}
      <path
        d={`
          M 130 450
          L 670 450
          C 740 450 760 430 770 400
          L 775 370
          C 780 340 800 320 830 305
          C 860 290 890 290 910 270
          C 930 250 940 220 930 190
          L 920 160
          C 908 120 870 110 840 100
          C 810 90 780 95 760 115
          L 740 140
          C 720 165 700 175 670 178
          C 640 181 615 170 600 148
          L 580 110
          C 560 78 530 62 490 58
          L 380 58
          C 330 58 295 75 270 110
          L 245 150
          C 225 180 220 210 225 240
          L 235 270
          C 245 305 240 330 220 355
          L 195 385
          C 170 415 150 435 130 450
          Z
        `}
        stroke="rgba(255,255,255,0.055)"
        strokeWidth="14"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Inner track edge — ~18px inset from outer, creates track width feel */}
      <path
        d={`
          M 165 432
          L 658 432
          C 722 432 740 415 750 388
          L 755 360
          C 760 334 778 316 806 302
          C 834 288 862 288 880 270
          C 898 252 906 225 896 198
          L 887 170
          C 876 136 844 126 818 117
          C 792 108 765 113 748 130
          L 730 153
          C 711 176 692 186 664 189
          C 636 192 612 182 598 162
          L 579 126
          C 560 96 532 82 495 78
          L 387 78
          C 342 78 310 93 287 124
          L 264 161
          C 246 189 241 218 246 246
          L 255 274
          C 264 307 259 330 240 354
          L 216 382
          C 192 411 172 428 165 432
          Z
        `}
        stroke="rgba(255,255,255,0.025)"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Start/finish line marker — a single short perpendicular dash */}
      <line
        x1="395" y1="449" x2="395" y2="434"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="2"
        strokeDasharray="4 2"
      />

      {/* Pit lane outline — parallel to main straight, inset slightly */}
      <path
        d="M 200 464 L 620 464"
        stroke="rgba(255,255,255,0.03)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray="8 6"
      />
    </svg>
  );
}
