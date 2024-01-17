import fs from "fs";
import readline from "readline";

async function processCsv() {
  const fileStream = fs.createReadStream("images_uploaded.csv");
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const output = [];

  for await (const line of rl) {
    if (output.length === 0) {
      // Add header for new column
      output.push(line + ",obj_name");
    } else {
      const columns = line.split(",");
      const modifiedName = columns[0].replace(/_/g, " ");
      output.push(line + "," + modifiedName);
    }
  }

  fs.writeFileSync("modified_images_uploaded_name.csv", output.join("\n"));
}

processCsv();
