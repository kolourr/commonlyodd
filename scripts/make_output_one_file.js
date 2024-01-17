import fs from "fs";
import path from "path";
import csv from "csv-parser";
import fastcsv from "fast-csv";

async function combineCSVFiles() {
  const outputDir = path.join(process.cwd(), "output");
  const outputFile = path.join(outputDir, "final_output.csv"); // Changed to put the final file back in the output folder

  // Check if the directory exists
  if (!fs.existsSync(outputDir)) {
    console.error(`Directory does not exist: ${outputDir}`);
    return;
  }

  // Read all files in the directory
  const files = await fs.promises.readdir(outputDir);

  // Filter CSV files
  const csvFiles = files.filter((file) => file.endsWith(".csv"));

  if (csvFiles.length === 0) {
    console.error("No CSV files found in the directory.");
    return;
  }

  let results = [];

  // Process each CSV file
  for (const file of csvFiles) {
    const filePath = path.join(outputDir, file);

    // Read and parse CSV file
    const data = await new Promise((resolve, reject) => {
      const rows = [];
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (row) => rows.push(row))
        .on("end", () => resolve(rows))
        .on("error", (error) => reject(error));
    });

    // Skip header for all files except the first one
    if (file !== csvFiles[0]) {
      data.shift();
    }

    results = results.concat(data);
  }

  // Write to final CSV
  const ws = fs.createWriteStream(outputFile);
  fastcsv
    .write(results, { headers: true })
    .pipe(ws)
    .on("finish", () =>
      console.log(`Data successfully written to ${outputFile}`)
    )
    .on("error", (error) =>
      console.error("Error writing data to file:", error)
    );
}

combineCSVFiles().catch(console.error);
