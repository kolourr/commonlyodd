import fs from "fs";
import path from "path";
import csv from "csv-parser";
import axios from "axios";
import OpenAI from "openai";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateAndSaveImages() {
  const imagesDir = path.join(process.cwd(), "images");
  const csvFile = path.join(imagesDir, "image_create.csv");

  // Check if the directory exists
  if (!fs.existsSync(imagesDir)) {
    console.error(`Directory does not exist: ${imagesDir}`);
    return;
  }

  // Read and parse CSV file
  const imageNames = [];
  fs.createReadStream(csvFile)
    .pipe(csv())
    .on("data", (row) => imageNames.push(row.obj_name)) // assuming the column name is obj_name
    .on("end", () => {
      console.log("CSV file successfully processed");
      // Generate images for each name
      imageNames.forEach(async (name, index) => {
        if (index === 0) return; // skip header
        try {
          const prompt = `a clean and clear picture of a ${name}.`; // modified prompt
          const response = await openai.images.generate({
            prompt,
            size: "1024x1024",
          }); // assuming the API accepts a size parameter
          if (response.data && response.data.length > 0) {
            const imageUrl = response.data[0].url; // get the first image URL
            const imageResponse = await axios.get(imageUrl, {
              responseType: "stream",
            });
            const outputPath = path.join(
              imagesDir,
              `${name.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.png`
            ); // sanitize name for file usage
            const writer = fs.createWriteStream(outputPath);
            imageResponse.data.pipe(writer);
            console.log(`Image saved at ${outputPath}`);
          } else {
            console.error(`No image data received for ${name}`);
          }
        } catch (error) {
          console.error(`Error generating image for ${name}:`, error);
        }
      });
    })
    .on("error", (error) => console.error("Error reading CSV file:", error));
}

generateAndSaveImages().catch(console.error);
