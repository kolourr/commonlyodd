import fs from "fs";
import { Parser } from "json2csv";
import dotenv from "dotenv";
import OpenAI from "openai";

// Load environment variables from .env file
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
      obj_4: rowData[3],
      odd: rowData[4],
      reason_for_similarity: rowData[5],
    };
  });
}

// Function to read and parse input CSV file
function readInputCSV(filename) {
  const content = fs.readFileSync(filename, "utf8");
  const lines = content.trim().split("\n");
  return lines.map((line) => line.split(","));
}

// Main function to generate data and save to CSV
async function generateDataAndSaveCSV() {
  const inputFilename = "input_6.csv"; // Name of the input CSV file
  const inputs = readInputCSV(inputFilename); // Read inputs from the CSV file
  let allData = []; // Accumulate all iteration data here

  for (let i = 0; i < inputs.length; i++) {
    console.log(`Running iteration ${i + 1} of ${inputs.length}...`);

    const [obj1, obj2, obj3] = inputs[i]; // Destructure the objects from the current row

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: `I need to develop a game that presents a user with 4 objects. Three of those objects needs to have something in common and the fourth needs to be the odd one out. Right now i have ${obj1}, ${obj2} and ${obj3}. I need you to give me a fourth and then give me the odd one out and what the other three have in common.\\n\\n  You have the option of adding or removing any object as my goal is to make the game very hard and challenging. The odd one out shouldn't be too obvious. It has to be difficult to tell. This is very important, the game has to be very challenging otherwise I will be wasting people's time, so take your time to make it difficult.\\n\\n  Just output the result in a table with the following columns:   obj_1, obj_2, obj_3, obj_4, odd, reason_for_similarity. For the reason for similarity, all you need to say is "The others are blank" where blank is the reason for similarity. Nothing too long. You dont need to provide any written explanation of your thought process.\\n\\n   Here's an example of the input provided, Anakin Skywalker,	Luke Skywalker and	Han Solo. The output returned was Anakin Skywalker, Luke Skywalker, Leia Organa and Han Solo. Han Solo was the odd one out and the reason for similarity for the others was: The others are Skywalkers. As you can see, one of the objects was replaced to make it more challenging and fun. No object must be said twice. I need something similar.`,
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
      allData.push(...newData); // Append new data to the allData array
    } else {
      console.error("Failed to retrieve data from OpenAI");
    }
  }
  // After all iterations, write allData to a single CSV file
  const fields = [
    "obj_1",
    "obj_2",
    "obj_3",
    "obj_4",
    "odd",
    "reason_for_similarity",
  ];
  const opts = { fields };
  const parser = new Parser(opts);
  const csv = parser.parse(allData);
  const filename = `output_6.csv`; // Name for the output CSV file
  fs.writeFileSync(filename, csv);
  console.log(`CSV file saved as ${filename}.`);
}

// Run the function
generateDataAndSaveCSV().catch(console.error);
