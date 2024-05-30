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
  "Bible characters from book Genesis",
  "Bible characters from book Exodus",
  "Bible characters from book Leviticus",
  "Bible characters from book Numbers",
  "Bible characters from book Deuteronomy",
  "Bible characters from book Joshua",
  "Bible characters from book Judges",
  "Bible characters from book Ruth",
  "Bible characters from book 1 Samuel",
  "Bible characters from book 2 Samuel",
  "Bible characters from book 1 Kings",
  "Bible characters from book 2 Kings",
  "Bible characters from book 1 Chronicles",
  "Bible characters from book 2 Chronicles",
  "Bible characters from book Ezra",
  "Bible characters from book Nehemiah",
  "Bible characters from book Esther",
  "Bible characters from book Job",
  "Bible characters from book Psalms",
  "Bible characters from book Proverbs",
  "Bible characters from book Ecclesiastes",
  "Bible characters from book Song of Solomon",
  "Bible characters from book Isaiah",
  "Bible characters from book Jeremiah",
  "Bible characters from book Lamentations",
  "Bible characters from book Ezekiel",
  "Bible characters from book Daniel",
  "Bible characters from book Hosea",
  "Bible characters from book Joel",
  "Bible characters from book Amos",
  "Bible characters from book Obadiah",
  "Bible characters from book Jonah",
  "Bible characters from book Micah",
  "Bible characters from book Nahum",
  "Bible characters from book Habakkuk",
  "Bible characters from book Zephaniah",
  "Bible characters from book Haggai",
  "Bible characters from book Zechariah",
  "Bible characters from book Malachi",
  "Bible characters from book Matthew",
  "Bible characters from book Mark",
  "Bible characters from book Luke",
  "Bible characters from book John",
  "Bible characters from book Acts",
  "Bible characters from book Romans",
  "Bible characters from book 1 Corinthians",
  "Bible characters from book 2 Corinthians",
  "Bible characters from book Galatians",
  "Bible characters from book Ephesians",
  "Bible characters from book Philippians",
  "Bible characters from book Colossians",
  "Bible characters from book 1 Thessalonians",
  "Bible characters from book 2 Thessalonians",
  "Bible characters from book 1 Timothy",
  "Bible characters from book 2 Timothy",
  "Bible characters from book Titus",
  "Bible characters from book Philemon",
  "Bible characters from book Hebrews",
  "Bible characters from book James",
  "Bible characters from book 1 Peter",
  "Bible characters from book 2 Peter",
  "Bible characters from book 1 John",
  "Bible characters from book 2 John",
  "Bible characters from book 3 John",
  "Bible characters from book Jude",
  "Bible characters from book Revelation",
];
// Main function to generate data and save to CSV
async function generateDataAndSaveCSV() {
  let allData = []; // Accumulate all iteration data here

  for (let i = 0; i < category_words.length; i++) {
    console.log(`Running iteration ${i + 1} of ${category_words.length}...`);
    // Randomly select a category for this iteration
    const category = category_words[i];

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",

          content: `I need to develop a game that presents a user with 4 objects. Three of those objects need to have something in common and the fourth needs to be the odd one out. Focus on the topic of ${category}.\\n\\n My goal is to make the game very hard and challenging. The odd one out shouldn't be too obvious. It has to be difficult to tell. This is very important, the game has to be very challenging otherwise I will be wasting people's time, so take your time to make it difficult. Everything has to be very closely related, it cannot be something like The Beatles, The Rolling Stones, The Who, Pablo Picasso where Pablo Picasso is the odd one out for being a painter. Here's an example of the input provided, Anakin Skywalker, Luke Skywalker and Han Solo. The output returned was Anakin Skywalker, Luke Skywalker, Leia Organa and Han Solo. Han Solo was the odd one out and the reason for similarity for the others was: The others are Skywalkers. As you can see, one of the objects was replaced to make it more challenging and fun. Another thing to note is not to use fancy terms but rather simple terms for items. For example, Crocus, Saffron, Colchicum, Corn where Corn is the odd one out and the others are Iridaceae. Instead of Iridaceae, say iris family. Another example would be  Sunflower, Zinnia , Marigold , Lettuce where Lettuce is odd and The others are heliophytes. Instead of heliophytes, say sun-loving plants. Also, no object must be said twice. I need something similar.\\n\\n Just output the result in a table with the following columns: obj_1, obj_2, obj_3, obj_4, odd, reason_for_similarity. Also for the odd one out, don't put obj_1 or obj_4, etc. use the actual name. For the reason for similarity, all you need to say is 'The others are blank' where blank is the reason for similarity. Nothing too long. You dont need to provide any written explanation of your thought process.\\n\\n I need you to generate 50 rows of items for this.`,
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
  const filename = `bible.csv`; // Name for the output CSV file
  fs.writeFileSync(filename, csv);
  console.log(`CSV file saved as ${filename}.`);
}

// Run the function
generateDataAndSaveCSV().catch(console.error);
