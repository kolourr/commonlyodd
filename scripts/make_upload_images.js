import fs from "fs";
import path from "path";
import axios from "axios";
import csvParser from "csv-parser";
import csvWriter from "csv-write-stream";
import FormData from "form-data";
import dotenv from "dotenv";
import {
  createReadStream,
  createWriteStream,
  promises as fsPromises,
} from "fs";

// Assuming these imports are correct; replace with actual import paths if they are different.
import OpenAI from "openai";
import Replicate from "replicate";

dotenv.config();

// Initialize OpenAI and Replicate with API keys
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const imagesDir = path.join(process.cwd(), "output");

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

// Generate image using OpenAI or Replicate
async function generateImage(name) {
  const sanitizedFilename = `${name
    .replace(/[^a-z0-9]/gi, "_")
    .toLowerCase()}.png`;
  const outputPath = path.join(imagesDir, sanitizedFilename);
  const prompt = `Baseball player ${name}`;
  let imageUrl;

  // // Try generating with OpenAI
  // try {
  //   const response = await openai.images.generate({
  //     model: "dall-e-3",
  //     n: 1,
  //     prompt: prompt,
  //     size: "1024x1024",
  //   });

  //   if (response.data && response.data.length > 0) {
  //     imageUrl = response.data[0].url; // Set imageUrl from OpenAI's response
  //     await downloadAndSaveImage(imageUrl, outputPath);
  //     return { outputPath, sanitizedFilename }; // Return both path and filename
  //   }
  // } catch (error) {
  //   console.error(`Failed with OpenAI for ${name}: ${error.message}`);
  // }

  // // If OpenAI did not generate an image, try with Replicate
  // if (!imageUrl) {
  //   try {
  //     const output = await replicate.run(
  //       "stability-ai/sdxl:c221b2b8ef527988fb59bf24a8b97c4561f1c671f73bd389f866bfb27c061316",
  //       {
  //         input: {
  //           prompt,
  //         },
  //       }
  //     );

  //     if (output && output.length > 0) {
  //       imageUrl = output[0]; // Assume this returns the direct URL to the image
  //       await downloadAndSaveImage(imageUrl, outputPath);
  //       return { outputPath, sanitizedFilename }; // Return both path and filename
  //     }
  //   } catch (error) {
  //     console.error(`Failed with Replicate for ${name}: ${error.message}`);
  //   }
  // }

  // If OpenAI did not generate an image, try with Replicate
  try {
    const output = await replicate.run(
      "stability-ai/sdxl:c221b2b8ef527988fb59bf24a8b97c4561f1c671f73bd389f866bfb27c061316",
      {
        input: {
          prompt,
        },
      }
    );

    if (output && output.length > 0) {
      imageUrl = output[0]; // Assume this returns the direct URL to the image
      await downloadAndSaveImage(imageUrl, outputPath);
      return { outputPath, sanitizedFilename }; // Return both path and filename
    }
  } catch (error) {
    console.error(`Failed with Replicate for ${name}: ${error.message}`);
  }

  // If an image URL was successfully retrieved, download and save the image
  if (imageUrl) {
    await downloadAndSaveImage(imageUrl, outputPath);
    return outputPath;
  } else {
    throw new Error(`Failed to generate image for: ${name}`);
  }
}

// Upload image to Cloudflare
async function uploadToCloudflare(filePath) {
  const fileName = path.basename(filePath);
  const form = new FormData();
  form.append("file", createReadStream(filePath));

  const response = await axios.post(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v1`,
    form,
    {
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_API_KEY}`,
        ...form.getHeaders(),
      },
    }
  );

  if (response.data.success) {
    const publicUrl = response.data.result.variants.find((url) =>
      url.includes("/public")
    );
    return publicUrl;
  } else {
    throw new Error(`Failed to upload ${fileName} to Cloudflare.`);
  }
}

// Process the CSV, generate and upload images, then update the CSV
async function processCsvAndImages() {
  const csvFilePath = path.join(imagesDir, "output.csv");
  const rows = [];

  createReadStream(csvFilePath)
    .pipe(csvParser())
    .on("data", (data) => rows.push(data))
    .on("end", async () => {
      let counter = 0;
      const total = rows.length;

      for (const row of rows) {
        counter++;
        console.log(`Processing image ${counter} of ${total}: ${row.obj_name}`);

        try {
          const { outputPath, sanitizedFilename } = await generateImage(
            row.obj_name
          );
          const imgLink = await uploadToCloudflare(outputPath);

          // Extract the base name without the extension for obj_image_name
          const baseNameWithoutExtension = sanitizedFilename.replace(
            /\.png$/i,
            ""
          );

          row.obj_image_name = baseNameWithoutExtension;
          row.obj_name_alt = `Image of ${baseNameWithoutExtension}`;
          row.obj_name_ext = sanitizedFilename; // Use the full sanitized filename here
          row.img_link = imgLink;
        } catch (error) {
          console.error(`Error processing ${row.obj_name}: `, error.message);
        }
      }

      // After all rows are processed, write the updated information back to the CSV
      const writer = csvWriter({ sendHeaders: false });
      writer.pipe(createWriteStream(csvFilePath, { flags: "w" })); // Ensure we overwrite the file

      rows.forEach((row) => {
        writer.write(row);
      });

      writer.end();
      console.log("All images processed.");
    });
}

processCsvAndImages().catch(console.error);
