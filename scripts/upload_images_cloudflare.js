import fs from "fs";
import path from "path";
import axios from "axios";
import FormData from "form-data";
import csvWriter from "csv-write-stream";
import dotenv from "dotenv";

dotenv.config();

const CLOUDFLARE_API_KEY = process.env.CLOUDFLARE_API_KEY;
const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;

async function uploadImages() {
  const imagesDir = path.join(process.cwd(), "images_to_upload");

  // Check if the directory exists
  if (!fs.existsSync(imagesDir)) {
    console.error(`Directory does not exist: ${imagesDir}`);
    return;
  }

  const writer = csvWriter({
    headers: ["obj_name", "obj_name_alt", "obj_name_ext", "img_link"],
  });
  writer.pipe(
    fs.createWriteStream(path.join(imagesDir, "images_uploaded.csv"))
  );

  // Read all files in the directory
  const files = await fs.promises.readdir(imagesDir);

  // Filter image files (assuming PNG files or WEBP files)
  // const imageFiles = files.filter(
  //   (file) => file.endsWith(".png") || file.endsWith(".WEBP")
  // );

  for (const image of files) {
    try {
      const imagePath = path.join(imagesDir, image);
      const form = new FormData();
      form.append("file", fs.createReadStream(imagePath));
      console.log(`Uploading image: ${image}`); // Log before upload

      const response = await axios.post(
        `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/images/v1`,
        form,
        {
          headers: {
            Authorization: `Bearer ${CLOUDFLARE_API_KEY}`,
            ...form.getHeaders(),
          },
        }
      );

      if (response.data.success) {
        const objName = path.basename(image, path.extname(image));
        const objNameAlt = `Image of ${objName}`;
        const objNameExt = image;
        const imgLink = response.data.result.variants[0];

        writer.write([objName, objNameAlt, objNameExt, imgLink]);
        console.log(`Uploaded successfully: ${image}`); // Log after successful upload
      } else {
        console.error("Upload failed for", image, response.data.errors);
      }
    } catch (error) {
      console.error("Error uploading image:", image, error);
    }
  }

  writer.end();
  console.log("Image upload process completed.");
}

uploadImages().catch(console.error);
