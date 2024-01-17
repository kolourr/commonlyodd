import fs from "fs";
import { Parser } from "json2csv";
import dotenv from "dotenv";
import OpenAI from "openai";

// Load environment variables from .env file
dotenv.config();

console.log(process.env.OPENAI_API_KEY);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Pre-defined categories
const categories = [
  "Spain",
  "France",
  "Italy",
  "Germany",
  "United Kingdom",
  "Russia",
  "Scotland",
  "Sweden",
  "Switzerland",
  "Netherlands",
  "Belgium",
  "Austria",
  "Norway",
  "Denmark",
  "Finland",
  "Poland",
  "Ukraine",
  "Australia",
  "New Zealand",
  "Canada",
  "Mexico",
  "Brazil",
  "Argentina",
  "Chile",
  "Colombia",
  "Peru",
  "Venezuela",
  "Ecuador",
  "Paraguay",
  "Uruguay",
  "Bolivia",
  "China",
  "Japan",
  "South Korea",
  "Indonesia",
  "Thailand",
  "Malaysia",
  "Singapore",
  "United Arab Emirates",
  "Saudi Arabia",
  "Qatar",
  "Egypt",
  "Turkey",
];

// Function to parse the table string into an array of objects
function parseTable(tableString) {
  const rows = tableString.split("\n").slice(2); // split by newline and ignore the header row
  return rows.map((row) => {
    const rowData = row
      .split("|")
      .map((item) => item.trim())
      .filter(Boolean);
    return {
      obj_1: rowData[0],
      obj_2: rowData[1],
      obj_3: rowData[2],
      odd: rowData[3],
      reason_for_similarity: rowData[4],
    };
  });
}

// Main function to generate data and save to CSV
async function generateDataAndSaveCSV() {
  const totalIterations = 43;
  let allData = [];

  for (let i = 0; i < totalIterations; i++) {
    console.log(`Running iteration ${i + 1} of ${totalIterations}...`);
    // Randomly select a category for this iteration
    const category = categories[i]; // No modulo operation needed, as we already ensure i < categories.length

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content: `I need to develop a game that presents a user with 3 objects. Two of those objects needs to have something in common and the third one needs to be the odd one out.. \\n\\nI need you to generate a table with the following columns: \\n\\n1. obj_1\\n2. obj_2\\n3. obj_3\\n4. odd \\n5. reason_for_similarity\\n\\nThis part is very important: The objects need to be very similar to each other so its difficult to guess. The goal is to make guessing the reason_for_similarity difficult.  \\n\\nThe first three columns will have the name of the three different objects. The fourth will have the odd one from the three. The fifth will have the reason for similarity between the other two \\n\\nI need you to generate 10 rows. \\n\\nPlease generate a unique set of items from the category: ${category}.`,
        },
      ],

      temperature: 0.5,
      max_tokens: 4000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    if (response && response.choices && response.choices.length > 0) {
      const tableString = response.choices[0].message.content;
      const newData = parseTable(tableString);

      // Save current iteration data to CSV
      const fields = [
        "obj_1",
        "obj_2",
        "obj_3",
        "odd",
        "reason_for_similarity",
      ];
      const opts = { fields };
      const parser = new Parser(opts);
      const csv = parser.parse(newData);

      // Use the iteration number to create a unique filename for each CSV
      const filename = `output1_${i + 1}.csv`;
      fs.writeFileSync(filename, csv);
      console.log(`CSV file saved as ${filename}.`);
    } else {
      console.error("Failed to retrieve data from OpenAI");
    }
  }
}

// Run the function
generateDataAndSaveCSV().catch(console.error);
