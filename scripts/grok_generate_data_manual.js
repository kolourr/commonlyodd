import fs from "fs";
import { Parser } from "json2csv";
import dotenv from "dotenv";
import Groq from "groq-sdk";

// Load environment variables from .env file
dotenv.config();
console.log(process.env.GROK_API_KEY);

const groq = new Groq({
  apiKey: process.env.GROK_API_KEY,
});

// Categories for the game
const category_words = [
  "American Football Players from 1910's",
  "American Football Players from 1910's",
  "American Football Players from 1910's",
  "American Football Players from 1910's",
  "American Football Players from 1910's",
  "American Football Players from 1910's",
  "American Football Players from 1920's",
  "American Football Players from 1920's",
  "American Football Players from 1920's",
  "American Football Players from 1920's",
  "American Football Players from 1920's",
  "American Football Players from 1920's",
  "American Football Players from 1930's",
  "American Football Players from 1930's",
  "American Football Players from 1930's",
  "American Football Players from 1930's",
  "American Football Players from 1930's",
  "American Football Players from 1930's",
  "American Football Players from 1940's",
  "American Football Players from 1940's",
  "American Football Players from 1940's",
  "American Football Players from 1940's",
  "American Football Players from 1940's",
  "American Football Players from 1940's",
  "American Football Players from 1950's",
  "American Football Players from 1950's",
  "American Football Players from 1950's",
  "American Football Players from 1950's",
  "American Football Players from 1950's",
  "American Football Players from 1950's",
  "American Football Players from 1960's",
  "American Football Players from 1960's",
  "American Football Players from 1960's",
  "American Football Players from 1960's",
  "American Football Players from 1960's",
  "American Football Players from 1960's",
  "American Football Players from 1970's",
  "American Football Players from 1970's",
  "American Football Players from 1970's",
  "American Football Players from 1970's",
  "American Football Players from 1970's",
  "American Football Players from 1970's",
  "American Football Players from 1980's",
  "American Football Players from 1980's",
  "American Football Players from 1980's",
  "American Football Players from 1980's",
  "American Football Players from 1980's",
  "American Football Players from 1980's",
  "American Football Players from 1990's",
  "American Football Players from 1990's",
  "American Football Players from 1990's",
  "American Football Players from 1990's",
  "American Football Players from 1990's",
  "American Football Players from 1990's",
  "American Football Players from 2000's",
  "American Football Players from 2000's",
  "American Football Players from 2000's",
  "American Football Players from 2000's",
  "American Football Players from 2000's",
  "American Football Players from 2000's",
  "American Football Players from 2010's",
  "American Football Players from 2010's",
  "American Football Players from 2010's",
  "American Football Players from 2010's",
  "American Football Players from 2010's",
  "American Football Players from 2010's",
];

// Function to parse the table string into an array of objects
function parseTable(tableString) {
  const rows = tableString.split("\n").slice(3);
  return rows
    .map((row) => {
      const rowData = row
        .split("|")
        .map((item) => item.trim())
        .filter(Boolean);
      if (rowData.length !== 6) return null;
      return {
        obj_1: rowData[0],
        obj_2: rowData[1],
        obj_3: rowData[2],
        obj_4: rowData[3],
        odd: rowData[4],
        reason_for_similarity: rowData[5],
      };
    })
    .filter((item) => item);
}

// Main function to generate data and save to CSV
async function generateDataAndSaveCSV() {
  let allData = [];

  for (const category of category_words) {
    let fullContent = "";
    console.log(`Running for category: ${category}`);
    try {
      const response = await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: `I need to develop a game that presents a user with 4 objects. Three of those objects need to have something in common and the fourth needs to be the odd one out. Focus on the topic of ${category}.\\n\\n My goal is to make the game very hard and challenging. The odd one out shouldn't be too obvious. It has to be difficult to tell. This is very important, the game has to be very challenging otherwise I will be wasting people's time, so take your time to make it difficult. Everything has to be very closely related, it cannot be something like The Beatles, The Rolling Stones, The Who, Pablo Picasso where Pablo Picasso is the odd one out for being a painter. Here's an example of the input provided, Anakin Skywalker, Luke Skywalker and Han Solo. The output returned was Anakin Skywalker, Luke Skywalker, Leia Organa and Han Solo. Han Solo was the odd one out and the reason for similarity for the others was: The others are Skywalkers. As you can see, one of the objects was replaced to make it more challenging and fun. Another thing to note is not to use fancy terms but rather simple terms for items. For example, Crocus, Saffron, Colchicum, Corn where Corn is the odd one out and the others are Iridaceae. Instead of Iridaceae, say iris family. Another example would be  Sunflower, Zinnia , Marigold , Lettuce where Lettuce is odd and The others are heliophytes. Instead of heliophytes, say sun-loving plants. Also, no object must be said twice. I need something similar.\\n\\n Just output the result in a table with the following columns: obj_1, obj_2, obj_3, obj_4, odd, reason_for_similarity.  I also want to make sure that you don't always put the odd one out as obj_4. It should be mixed randomly between obj_1, obj_2, obj_3 and obj_4. Also for the odd one out, don't put obj_1 or obj_4, etc. use the actual name. For the reason for similarity, all you need to say is 'The others are blank' where blank is the reason for similarity. Nothing too long. You dont need to provide any written explanation of your thought process.\\n\\n I need you to generate 30 rows of items for this.`,
          },
        ],
        model: "llama3-70b-8192",
        temperature: 1,
        max_tokens: 1024,
        top_p: 1,
        stream: true,
        stop: null,
      });

      for await (const chunk of response) {
        fullContent += chunk.choices[0]?.delta?.content || "";
        if (chunk.x_groq?.usage?.finish_reason === "stop") break;
      }

      const newData = parseTable(fullContent);
      if (newData.length > 0) {
        allData.push(...newData);
      }
    } catch (error) {
      console.error(`Error calling GROQ API for category ${category}:`, error);
    }
  }

  if (allData.length === 0) {
    console.log("No valid data to save.");
    return;
  }

  // Write all data to a CSV file
  const fields = [
    "obj_1",
    "obj_2",
    "obj_3",
    "obj_4",
    "odd",
    "reason_for_similarity",
  ];
  const parser = new Parser({ fields });
  const csv = parser.parse(allData);
  fs.writeFileSync("output.csv", csv);
  console.log(`CSV file saved as output.csv.`);
}

// Run the function
generateDataAndSaveCSV().catch(console.error);

// import fs from "fs";
// import { Parser } from "json2csv";
// import dotenv from "dotenv";
// import Groq from "groq-sdk";

// // Load environment variables from .env file
// dotenv.config();

// console.log(process.env.GROK_API_KEY);

// const groq = new Groq({
//   apiKey: process.env.GROK_API_KEY,
// });

// // Function to parse the table string into an array of objects
// function parseTable(tableString) {
//   const rows = tableString.split("\n").slice(2); // split by newline and ignore the header row
//   return rows.map((row) => {
//     const rowData = row
//       .split("|")
//       .map((item) => item.trim())
//       .filter(Boolean);
//     return {
//       obj_1: rowData[0],
//       obj_2: rowData[1],
//       obj_3: rowData[2],
//       obj_4: rowData[3],
//       odd: rowData[4],
//       reason_for_similarity: rowData[5],
//     };
//   });
// }

// const category_words = ["flowers"];
// // Main function to generate data and save to CSV
// async function generateDataAndSaveCSV() {
//   let allData = []; // Accumulate all iteration data here

//   for (let i = 0; i < category_words.length; i++) {
//     console.log(`Running iteration ${i + 1} of ${category_words.length}...`);
//     // Randomly select a category for this iteration
//     const category = category_words[i];
//     let fullContent = ""; // Initialize an empty string to accumulate the chunks

//     try {
//       const response = await groq.chat.completions.create({
//         messages: [
//           {
//             role: "user",
//             content: `I need to develop a game that presents a user with 4 objects. Three of those objects needs to have something in common and the fourth needs to be the odd one out. Focus on the topic of ${category}.     \\n\\n My goal is to make the game very hard and challenging. The odd one out shouldn't be too obvious. It has to be difficult to tell. This is very important, the game has to be very challenging otherwise I will be wasting people's time, so take your time to make it difficult. Everything has to be very closely related, it cannot be something like The Beatles, The Rolling Stones, The Who, Pablo Picasso where Pablo Picasso is the odd one out for being a painter. Here's an example of the input provided, Anakin Skywalker,	Luke Skywalker and	Han Solo. The output returned was Anakin Skywalker, Luke Skywalker, Leia Organa and Han Solo. Han Solo was the odd one out and the reason for similarity for the others was: The others are Skywalkers. As you can see, one of the objects was replaced to make it more challenging and fun. No object must be said twice. I need something similar. \\n\\n  Just output the result in a table with the following columns:   obj_1, obj_2, obj_3, obj_4, odd, reason_for_similarity. For the reason for similarity, all you need to say is "The others are blank" where blank is the reason for similarity. Nothing too long. You dont need to provide any written explanation of your thought process.\\n\\n   I need you to generate 2 rows of items for this.`,
//           },
//         ],

//         model: "llama3-8b-8192",
//         temperature: 1,
//         max_tokens: 1024,
//         top_p: 1,
//         stream: true,
//         stop: null,
//       });

//       for await (const chunk of response) {
//         if (chunk.choices[0]?.delta?.content) {
//           fullContent += chunk.choices[0].delta.content; // Accumulate content
//         }
//         if (chunk.x_groq?.usage?.finish_reason === "stop") {
//           const newData = parseTable(fullContent); // Parse once all data is received
//           allData.push(...newData);
//           break; // Exit the loop once all content is processed
//         }
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   }
//   // Write all data to a CSV file
//   const fields = [
//     "obj_1",
//     "obj_2",
//     "obj_3",
//     "obj_4",
//     "odd",
//     "reason_for_similarity",
//   ];
//   const parser = new Parser({ fields });
//   const csv = parser.parse(allData);
//   fs.writeFileSync("output.csv", csv);
//   console.log(`CSV file saved as output.csv.`);
// }

// // Run the function
// generateDataAndSaveCSV().catch(console.error);

// import Groq from "groq-sdk";
// import dotenv from "dotenv";

// // Load environment variables from .env file
// dotenv.config();

// console.log(process.env.GROK_API_KEY);

// const groq = new Groq({
//   apiKey: process.env.GROK_API_KEY,
// });
// async function main() {
//   const chatCompletion = await groq.chat.completions.create({
//     messages: [
//       {
//         role: "user",
//         content: `I need to develop a game that presents a user with 4 objects. Three of those objects needs to have something in common and the fourth needs to be the odd one out. Focus on the topic of flowers.     \\n\\n My goal is to make the game very hard and challenging. The odd one out shouldn't be too obvious. It has to be difficult to tell. This is very important, the game has to be very challenging otherwise I will be wasting people's time, so take your time to make it difficult. Everything has to be very closely related, it cannot be something like The Beatles, The Rolling Stones, The Who, Pablo Picasso where Pablo Picasso is the odd one out for being a painter. Here's an example of the input provided, Anakin Skywalker,	Luke Skywalker and	Han Solo. The output returned was Anakin Skywalker, Luke Skywalker, Leia Organa and Han Solo. Han Solo was the odd one out and the reason for similarity for the others was: The others are Skywalkers. As you can see, one of the objects was replaced to make it more challenging and fun. No object must be said twice. I need something similar. \\n\\n  Just output the result in a table with the following columns:   obj_1, obj_2, obj_3, obj_4, odd, reason_for_similarity. For the reason for similarity, all you need to say is "The others are blank" where blank is the reason for similarity. Nothing too long. You dont need to provide any written explanation of your thought process.\\n\\n   I need you to generate 2 rows of items for this.`,
//       },
//     ],
//     model: "llama3-8b-8192",
//     temperature: 1,
//     max_tokens: 1024,
//     top_p: 1,
//     stream: true,
//     stop: null,
//   });

//   for await (const chunk of chatCompletion) {
//     process.stdout.write(chunk.choices[0]?.delta?.content || "");
//   }
// }

// main();
