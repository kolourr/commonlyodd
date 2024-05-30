import fs from "fs";
import { parse } from "csv-parse/sync"; // Correct import for csv-parse
import { stringify } from "csv-stringify/sync"; // Correct import for csv-stringify
import dotenv from "dotenv";
import Groq from "groq-sdk";

// Load environment variables from .env file
dotenv.config();
console.log(process.env.GROK_API_KEY);

const groq = new Groq({
  apiKey: process.env.GROK_API_KEY,
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
  const data = parseCSV(content);

  console.log(`Total rows to process: ${data.length}`); // Display total number of rows

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const { obj_1, obj_2, obj_3, obj_4, odd, reason_for_similarity } = row;

    // Display current row being processed
    console.log(`Processing row ${i + 1} of ${data.length}`);

    try {
      const response = await groq.chat.completions.create({
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
        model: "llama3-70b-8192",
        temperature: 0.5,
        max_tokens: 100,
        top_p: 1,
        stream: true,
        stop: null,
      });

      let fullContent = "";
      for await (const chunk of response) {
        fullContent += chunk.choices[0]?.delta?.content || "";
        if (chunk.x_groq?.usage?.finish_reason === "stop") break;
      }

      const isValid = fullContent.trim().toLowerCase().includes("yes")
        ? "yes"
        : "no";
      row.valid = isValid;
    } catch (error) {
      console.error(`Error validating row ${i + 1}:`, error);
      row.valid = "error";
    }
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
