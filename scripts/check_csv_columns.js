import fs from "fs";
import { parse } from "csv-parse";
import { createObjectCsvWriter } from "csv-writer";

const csvFilePath = "./check.csv";
const outputFilePath = "./result.csv";

// Function to read and process the CSV file
const processCsv = async () => {
  const records = [];

  fs.createReadStream(csvFilePath)
    .pipe(
      parse({
        columns: true,
        skip_empty_lines: true,
      })
    )
    .on("data", (row) => {
      // Determine if item in col_1 is also in col_2
      const commonValue = row.col_2 === row.col_1 ? "yes" : "no";
      records.push({ col_1: row.col_1, col_2: row.col_2, common: commonValue });
    })
    .on("end", () => {
      // Initialize CSV writer inside the end event
      const csvWriter = createObjectCsvWriter({
        path: outputFilePath,
        header: [
          { id: "col_1", title: "COL_1" },
          { id: "col_2", title: "COL_2" },
          { id: "common", title: "COMMON" },
        ],
      });

      // Write the processed records to a new CSV file
      csvWriter
        .writeRecords(records)
        .then(() => console.log("The CSV file has been written successfully"))
        .catch((err) => console.error("Error writing to CSV:", err));
    })
    .on("error", (err) => console.error("Error processing CSV:", err));
};

// Run the process
processCsv();
