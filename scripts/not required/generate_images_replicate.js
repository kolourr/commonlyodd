import fs from "fs";
import path from "path";
import csv from "csv-parser";
import axios from "axios";
import Replicate from "replicate";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

async function generateAndSaveImages() {
  const imagesDir = path.join(process.cwd(), "object_images.csv");
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
    .on("end", async () => {
      console.log("CSV file successfully processed");
      // Generate images for each name
      for (const name of imageNames) {
        try {
          const prompt = `${name}.`; // modified prompt
          const output = await replicate.run(
            "stability-ai/sdxl:c221b2b8ef527988fb59bf24a8b97c4561f1c671f73bd389f866bfb27c061316",
            {
              input: {
                prompt,
              },
            }
          );

          if (output && output.length > 0) {
            const imageUrl = output[0]; // get the first image URL
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
      }
    })
    .on("error", (error) => console.error("Error reading CSV file:", error));
}

generateAndSaveImages().catch(console.error);
