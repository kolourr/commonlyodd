import fs from "fs";
import path from "path";
import axios from "axios";
import OpenAI from "openai";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateAndSaveImage(prompt) {
  const imagesDir = path.join(process.cwd(), "images_to_upload");

  // Check if the directory exists
  if (!fs.existsSync(imagesDir)) {
    console.error(`Directory does not exist: ${imagesDir}`);
    return;
  }

  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      n: 1,
      prompt,
      size: "1024x1024",
    }); // assuming the API accepts a size parameter

    if (response.data && response.data.length > 0) {
      const imageUrl = response.data[0].url; // get the first image URL
      const imageResponse = await axios.get(imageUrl, {
        responseType: "stream",
      });

      // Extract a name from the prompt (for file naming)
      const promptWords = prompt.split(" ");
      const name = promptWords
        .slice(promptWords.lastIndexOf("a") + 1)
        .join("_");

      const outputPath = path.join(
        imagesDir,
        `${name.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.png`
      ); // sanitize name for file usage

      const writer = fs.createWriteStream(outputPath);
      imageResponse.data.pipe(writer);
      console.log(`Image saved at ${outputPath}`);
    } else {
      console.error(`No image data received for the prompt: ${prompt}`);
    }
  } catch (error) {
    console.error(`Error generating image for the prompt: ${prompt}`, error);
  }
}

async function processTerms(terms) {
  const imagesDir = path.join(process.cwd(), "images");

  // Check if the directory exists
  if (!fs.existsSync(imagesDir)) {
    console.error(`Directory does not exist: ${imagesDir}`);
    return;
  }

  for (const term of terms) {
    const prompt = `${term}`;
    console.log(`Generating image for: ${term}`);
    await generateAndSaveImage(prompt).catch(console.error);
  }
}

const terms = ["bbc"];

processTerms(terms).catch(console.error);
