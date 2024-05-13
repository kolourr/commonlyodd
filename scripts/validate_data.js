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
  const filename = "filtered_output.csv";
  const content = fs.readFileSync(filename, "utf8");
  const data = await parseCSV(content);

  console.log(`Total rows to process: ${data.length}`); // Display total number of rows

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const { obj_1, obj_2, obj_3, obj_4, odd, reason_for_similarity } = row;

    // Display current row being processed
    console.log(`Processing row ${i + 1} of ${data.length}`);

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: `I have developed a game called Commonly Odd. The user is presented with 4 objects: ${obj_1}, ${obj_2}, ${obj_3}, ${obj_4}. The odd one out is ${odd}, and the reason for similarity between the other three is: ${reason_for_similarity}. Please carefully assess whether the logic holds for the designated odd one out and the commonality among the others. Evaluate the following aspects:
1. Factual Accuracy: Ensure that all facts about the objects are correct.
2. Consistency in Category: Check if the three similar items truly belong to the same category as stated.
3. Relevance of Similarity: Verify that the commonality stated is relevant and significant enough to distinguish the odd one out clearly.
4. Clarity and Precision: Confirm that the reason for similarity is expressed clearly and precisely without ambiguity.
Respond with "yes" if the entry is valid. If not, reply "no" and provide a brief explanation identifying the specific issue or issues. Take your time to ensure each assessment is thorough and accurate.`,
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
    fs.writeFileSync(`final_${filename}`, updatedCSV);
    console.log(`CSV file updated and saved as final_${filename}.`);
  } catch (err) {
    console.error("Error writing the updated CSV:", err);
  }
}

// Run the function
updateCSV().catch(console.error);
