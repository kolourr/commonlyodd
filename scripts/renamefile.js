import fs from "fs";
import path from "path";

async function renameFiles() {
  const directoryPath = path.join(process.cwd(), "final_output_3");

  try {
    // Check if the directory exists
    if (!fs.existsSync(directoryPath)) {
      console.error(`Directory does not exist: ${directoryPath}`);
      return;
    }

    // Read all files in the directory
    const files = await fs.promises.readdir(directoryPath);

    // Filter CSV files
    const csvFiles = files.filter((file) => file.endsWith(".csv"));

    // Process each CSV file
    for (const file of csvFiles) {
      // Extract the number from the filename
      const match = file.match(/output_(\d+)\.csv/);
      if (match) {
        const number = parseInt(match[1], 10) + 980;
        const newFilename = `output_${number}.csv`;

        // Construct full file paths
        const oldFilePath = path.join(directoryPath, file);
        const newFilePath = path.join(directoryPath, newFilename);

        // Rename the file
        await fs.promises.rename(oldFilePath, newFilePath);
        console.log(`Renamed ${file} to ${newFilename}`);
      } else {
        console.error(`File ${file} did not match the expected format`);
      }
    }

    console.log("File renaming process completed.");
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

renameFiles().catch(console.error);
