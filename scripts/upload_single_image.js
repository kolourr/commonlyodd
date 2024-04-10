import fs from "fs";
import path from "path";
import axios from "axios";
import csvWriter from "csv-write-stream";
import FormData from "form-data";
import dotenv from "dotenv";

dotenv.config();

const imagesDir = path.join(process.cwd(), "additional_images");

// Upload image to Cloudflare
async function uploadToCloudflare(filePath) {
  const fileName = path.basename(filePath);
  const form = new FormData();
  form.append("file", fs.createReadStream(filePath));

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
    return response.data.result.variants[0];
  } else {
    throw new Error(`Failed to upload ${fileName} to Cloudflare.`);
  }
}

// Function to write data to CSV
async function writeToCsv(data, csvFilePath) {
  const writer = csvWriter({
    headers: [
      "obj_name",
      "obj_image_name",
      "obj_name_alt",
      "obj_name_ext",
      "img_link",
    ],
    sendHeaders: true,
  });
  writer.pipe(fs.createWriteStream(csvFilePath, { flags: "a" })); // 'a' flag to append if file exists
  writer.write(data);
  writer.end();
}

async function processImagesAndUpload() {
  const imageFiles = fs
    .readdirSync(imagesDir)
    .filter((file) => /\.(png|jpg|jpeg|webp)$/i.test(file));

  for (const imageFileName of imageFiles) {
    try {
      const filePath = path.join(imagesDir, imageFileName);
      const imgLink = await uploadToCloudflare(filePath);

      // Extract name with capital letters and format accordingly
      const objName = imageFileName
        .replace(path.extname(imageFileName), "")
        .replace(/_/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
      const baseNameWithoutExtension = path
        .basename(imageFileName, path.extname(imageFileName))
        .replace(/[^a-z0-9]/gi, "_")
        .toLowerCase();

      const data = {
        obj_name: objName,
        obj_image_name: baseNameWithoutExtension,
        obj_name_alt: `Image of ${baseNameWithoutExtension}`,
        obj_name_ext: baseNameWithoutExtension + path.extname(imageFileName),
        img_link: imgLink,
      };

      const csvFilePath = path.join(imagesDir, "output.csv");
      await writeToCsv(data, csvFilePath);

      console.log(`${imageFileName} uploaded and CSV updated.`);
    } catch (error) {
      console.error(
        `Error in uploading ${imageFileName} and updating CSV: `,
        error.message
      );
    }
  }
}

processImagesAndUpload().catch(console.error);
