import fs from "fs";
import csv from "csv-parser";
import sharp from "sharp";

const csvFilePath = "./output/math.csv";
const outputFolder = "./output/";

// Ensure the output directory exists
fs.mkdirSync(outputFolder, { recursive: true });

// Function to create an image with text
async function createImageWithText(text, filename) {
  let fontSize = 160; // Default font size
  const maxLength = 8; // Max length of text before reducing font size
  const textLength = text.length;

  if (textLength > maxLength) {
    // Reduce font size for longer texts
    fontSize = Math.max(100, fontSize - (textLength - maxLength) * 5); // Adjust the reduction factor as needed
  }

  const svgImage = `
    <svg width="1000" height="1000">
      <rect width="100%" height="100%" fill="#CCCCCC" />
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="JetBrains Mono" font-size="${fontSize}" fill="black">${text}</text>
    </svg>
  `;

  await sharp(Buffer.from(svgImage)).toFile(`${outputFolder}${filename}.png`);
}

// Read the CSV file and process each row
fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on("data", (row) => {
    if (row.items) {
      // Generate a safe filename from the item text
      const safeFilename = row.items.replace(/[^a-zA-Z0-9]/g, "_");
      createImageWithText(row.items, safeFilename)
        .then(() => console.log(`Image created for: ${row.items}`))
        .catch((err) => console.error("Error creating image:", err));
    }
  })
  .on("end", () => {
    console.log("CSV file processing completed.");
  });
