import fs from "fs";
import path from "path";
import axios from "axios";
import dotenv from "dotenv";
import Replicate from "replicate";

dotenv.config();

// Initialize Replicate with API key
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const imagesDir = path.join(process.cwd(), "additional_images");

// Ensure output directory exists
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir);
}

// Download image from URL and save
async function downloadAndSaveImage(imageUrl, outputPath) {
  const response = await axios.get(imageUrl, { responseType: "stream" });
  const writer = fs.createWriteStream(outputPath);
  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}

// Generate image using Replicate
async function generateImage(prompt) {
  const sanitizedFilename = `${prompt
    .replace(/[^a-z0-9]/gi, "_")
    .toLowerCase()}.png`;
  const outputPath = path.join(imagesDir, sanitizedFilename);

  try {
    const output = await replicate.run(
      "stability-ai/sdxl:c221b2b8ef527988fb59bf24a8b97c4561f1c671f73bd389f866bfb27c061316",
      {
        input: { prompt },
      }
    );

    if (output && output.length > 0) {
      const imageUrl = output[0]; // Assume this returns the direct URL to the image
      await downloadAndSaveImage(imageUrl, outputPath);
      console.log(`Image generated and saved: ${outputPath}`);
      return { outputPath, sanitizedFilename };
    }
  } catch (error) {
    console.error(`Failed with Replicate for ${prompt}: ${error.message}`);
  }

  throw new Error(`Failed to generate image for: ${prompt}`);
}

// Manually enter the prompt to generate and save the image
async function manuallyGenerateImage(prompt) {
  try {
    const { outputPath, sanitizedFilename } = await generateImage(prompt);
    console.log(`Image saved at: ${outputPath}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

// Example usage
const prompt = "An image of Karen Horney German psychoanalyst";
manuallyGenerateImage(prompt).catch(console.error);
