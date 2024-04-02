import fs from "fs";
import { parse } from "csv-parse";
import { createObjectCsvWriter } from "csv-writer";

const inputFile = "filtered_output.csv";
const outputFile = "filtered_output_2.csv";

const filteredRows = [];

// Read input CSV file and parse its contents
fs.createReadStream(inputFile)
  .pipe(parse({ columns: true }))
  .on("data", (row) => {
    const duplicateReason = filteredRows.some(
      (filteredRow) =>
        filteredRow.reason_for_similarity === row.reason_for_similarity
    );

    if (!duplicateReason) {
      filteredRows.push(row);
    }
  })
  .on("end", () => {
    // Define CSV column headers
    const csvWriter = createObjectCsvWriter({
      path: outputFile,
      header: [
        { id: "obj_1", title: "obj_1" },
        { id: "obj_2", title: "obj_2" },
        { id: "obj_3", title: "obj_3" },
        { id: "obj_4", title: "obj_4" },
        { id: "odd", title: "odd" },
        { id: "reason_for_similarity", title: "reason_for_similarity" },
        { id: "valid", title: "valid" },
      ],
    });

    // Write filtered rows to the output CSV file
    csvWriter
      .writeRecords(filteredRows)
      .then(() =>
        console.log("Filtered CSV file has been written successfully")
      )
      .catch((error) => console.error("Error writing CSV file:", error));
  });
