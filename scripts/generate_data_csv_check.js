import fs from "fs";
import { parse } from "csv-parse/sync"; // Correct import for csv-parse
import { stringify } from "csv-stringify/sync"; // Correct import for csv-stringify
import dotenv from "dotenv";
import OpenAI from "openai";

// Load environment variables from .env file
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Simplified function to parse CSV to JSON synchronously
function parseCSV(fileContent) {
  return parse(fileContent, { columns: true });
}

// Simplified function to stringify JSON to CSV synchronously
function stringifyJSON(data) {
  return stringify(data, { header: true });
}

// Main function to read CSV, check validity, and update CSV
async function updateCSV() {
  const filename = "initial.csv";
  const content = fs.readFileSync(filename, "utf8");
  const data = await parseCSV(content);

  console.log(`Total rows to process: ${data.length}`); // Display total number of rows

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const { obj_1, obj_2, obj_3, obj_4, odd, reason_for_similarity } = row;

    // Display current row being processed
    console.log(`Processing row ${i + 1} of ${data.length}`);

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content: `I have developed a game called Commonly Odd. The user is presented with 4 objects. They need to figure out which one of the four is odd and what the other three have in common.  I have the following objects: ${obj_1}, ${obj_2}, ${obj_3}, ${obj_4}. The odd one out is ${odd}. The reason for similarity between the other three is: ${reason_for_similarity}. I want you to let me know if this is valid or not. I need you to take your time and assess the logic of each statement and if it passes all the tests, let me know if it is valid. Reply yes when valid, otherwise, reply no. But do take you time to perform each logical assessment.`,
        },
      ],
      temperature: 0.5,
      max_tokens: 100,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const isValid = response.choices?.[0]?.message?.content
      ?.trim()
      .toLowerCase()
      .includes("yes")
      ? "yes"
      : "no";
    row.valid = isValid;
  }

  try {
    const updatedCSV = stringifyJSON(data);
    fs.writeFileSync(`updated_${filename}`, updatedCSV);
    console.log(`CSV file updated and saved as updated_${filename}.`);
  } catch (err) {
    console.error("Error writing the updated CSV:", err);
  }
}

// Run the function
updateCSV().catch(console.error);
