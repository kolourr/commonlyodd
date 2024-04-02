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

const category_words = [
  "flowers",
  "flowers",
  "flowers",
  "flowers",
  "flowers",
  "flowers",
  "flowers",
  "flowers",
  "flowers",
  "flowers",
  "flowers",
  "flowers",
  "flowers",
  "flowers",
  "herbs",
  "herbs",
  "herbs",
  "herbs",
  "herbs",
  "herbs",
  "herbs",
  "herbs",
  "herbs",
  "herbs",
];
// Main function to generate data and save to CSV
async function generateDataAndSaveCSV() {
  let allData = []; // Accumulate all iteration data here

  for (let i = 0; i < category_words.length; i++) {
    console.log(`Running iteration ${i + 1} of ${category_words.length}...`);
    // Randomly select a category for this iteration
    const category = category_words[i];

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content: `I need to develop a game that presents a user with 4 objects. Three of those objects needs to have something in common and the fourth needs to be the odd one out. Focus on the topic of ${category}.     \\n\\n My goal is to make the game very hard and challenging. The odd one out shouldn't be too obvious. It has to be difficult to tell. This is very important, the game has to be very challenging otherwise I will be wasting people's time, so take your time to make it difficult. Everything has to be very closely related, it cannot be something like The Beatles, The Rolling Stones, The Who, Pablo Picasso where Pablo Picasso is the odd one out for being a painter. Here's an example of the input provided, Anakin Skywalker,	Luke Skywalker and	Han Solo. The output returned was Anakin Skywalker, Luke Skywalker, Leia Organa and Han Solo. Han Solo was the odd one out and the reason for similarity for the others was: The others are Skywalkers. As you can see, one of the objects was replaced to make it more challenging and fun. No object must be said twice. I need something similar. \\n\\n  Just output the result in a table with the following columns:   obj_1, obj_2, obj_3, obj_4, odd, reason_for_similarity. For the reason for similarity, all you need to say is "The others are blank" where blank is the reason for similarity. Nothing too long. You dont need to provide any written explanation of your thought process.\\n\\n   I need you to generate 30 rows of items for this.`,
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
  const filename = `output.csv`; // Name for the output CSV file
  fs.writeFileSync(filename, csv);
  console.log(`CSV file saved as ${filename}.`);
}

// Run the function
generateDataAndSaveCSV().catch(console.error);
// const category_words = ["airports", "animals", "books", "cars", "cities", "colors", "countries", "foods", "movies", "music", "sports", "superheroes", "tv shows", "video games", "weather", "writers", "actors", "actresses", "artists", "athletes", "authors", "bands", "basketball players", "baseball players", "boxers", "chess players", "comedians", "composers", "cricketers", "cyclists", "dancers", "directors", "football players", "golfers", "hockey players", "judges", "martial artists", "musicians", "painters", "philosophers", "photographers", "pianists", "poets", "politicians", "singers", "soccer players", "swimmers", "tennis players", "wrestlers", "youtubers", "scientists", "inventors", "astronauts", "engineers", "designers", "architects", "chefs", "doctors", "nurses", "teachers", "professors", "lawyers", "judges", "pilots", "soldiers", "police officers", "firefighters", "paramedics", "veterinarians", "dentists", "psychologists", "therapists", "social workers", "artists", "writers", "poets", "musicians", "singers", "dancers", "actors", "directors", "painters", "sculptors", "photographers", "designers", "architects", "chefs", "bakers", "bartenders", "waiters", "waitresses", "cooks", "sommeliers", "baristas", "brewers", "winemakers", "distillers", "farmers", "butchers", "bakers", "fishermen", "chefs", "cooks", "bartenders", "waiters", "waitresses", "sommeliers", "baristas", "brewers", "winemakers", "distillers", "farmers", "butchers", "bakers", "fishermen", "chefs", "cooks", "bartenders", "waiters", "waitresses", "sommeliers", "baristas"];
