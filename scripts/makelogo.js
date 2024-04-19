import fs from "fs";
import sharp from "sharp";

// Define the SVG content with an angled rectangle and enhanced shadow
const svgContent = `
<svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <linearGradient id="gradient-bg" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#0f172a; stop-opacity:1" />
            <stop offset="50%" style="stop-color:#020617; stop-opacity:1" />
            <stop offset="100%" style="stop-color:#0f172a; stop-opacity:1" />
        </linearGradient>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="4" dy="4" stdDeviation="5" flood-color="#f9fafb"/>
        </filter>
    </defs>
    <style>
        .heavy {
            font: bold 180px sans-serif;
            fill: black; // Text color
            text-transform: uppercase;
            letter-spacing: 0.1em;
        }
        .border {
            fill: url(#gradient-bg);
            stroke: black;
            stroke-width: 4; // Matches border-2 at a larger scale
        }
        .shadow {
            filter: url(#shadow);
        }
    </style>
    <g transform="rotate(-12 512 512)">
        <rect x="206" y="412" width="600" height="200" rx="20" ry="20" class="border shadow"/>
        <text x="512" y="512" class="heavy" text-anchor="middle" dominant-baseline="middle">ODD</text>
    </g>
</svg>
`;

// Write the SVG to a file
fs.writeFileSync("logo.svg", svgContent);

// Convert SVG to PNG using Sharp
sharp("logo.svg")
  .png()
  .toFile("logo.png")
  .then(() => {
    console.log("SVG has been converted to PNG.");
  })
  .catch((err) => {
    console.error("Error converting SVG to PNG:", err);
  });
