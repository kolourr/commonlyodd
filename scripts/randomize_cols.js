import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { createObjectCsvWriter as createCsvWriter } from "csv-writer";

async function shuffleRowItems() {
  const inputFilePath = path.join(process.cwd(), "main_final_output.csv");
  const outputFilePath = path.join(
    process.cwd(),
    "final_output_randomized.csv"
  );

  // Check if the input file exists
  if (!fs.existsSync(inputFilePath)) {
    console.error(`File does not exist: ${inputFilePath}`);
    return;
  }

  const rows = [];
  try {
    // Read and parse CSV file
    const data = await new Promise((resolve, reject) => {
      fs.createReadStream(inputFilePath)
        .pipe(csv())
        .on("data", (row) => rows.push(row))
        .on("end", () => resolve(rows))
        .on("error", (error) => reject(error));
    });

    // Function to shuffle array
    const shuffleArray = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    };

    // Process and shuffle items in each row
    const processedData = data.map((row) => {
      const items = [row.obj_1, row.obj_2, row.obj_3];
      shuffleArray(items);
      return {
        ...row,
        obj_1: items[0],
        obj_2: items[1],
        obj_3: items[2],
      };
    });

    // Create a new CSV writer
    const csvWriter = createCsvWriter({
      path: outputFilePath,
      header: [
        { id: "obj_1", title: "obj_1" },
        { id: "obj_2", title: "obj_2" },
        { id: "obj_3", title: "obj_3" },
        { id: "odd", title: "odd" },
        { id: "reason_for_similarity", title: "reason_for_similarity" },
      ],
    });

    // Write processed data to a new CSV file
    await csvWriter.writeRecords(processedData);
    console.log(`Data successfully written to ${outputFilePath}`);
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

shuffleRowItems().catch(console.error);
