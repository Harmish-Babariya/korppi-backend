// // const transporter = nodemailer.createTransport({
// //     service: "Gmail",
// //     auth: {
// //         user: "bolstersys@gmail.com",
// //         pass: "zvgm pkkc jyzq iwty"
// //     }
// // });
// const nodemailer = require('nodemailer')

// const transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 587,
//     secure: false,
//     auth: {
//         user: "bolstersys@gmail.com",
//         pass: "zvgm pkkc jyzq iwty"
//     },
//     tls: {
//       rejectUnauthorized: false,
//     },
//   });

//   const mailOptions = {
//     from: 'bolstersys@gmail.com',
//     to: 'bolstersys@gmail.com',
//     subject: 'Test Email',
//     text: 'This is a test email sent using Nodemailer.'
// };

// // Send email
// transporter.sendMail(mailOptions, function(error, info){
//     if (error) {
//         console.error('Error occurred:', error);
//     } else {
//         console.log('Email sent:', info.response);
//     }
// });

const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: "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",
});

let goal_of_email = ""
async function main() {
  const chatCompletion = await openai.chat.completions.create({
    messages: [{role: "system", content: `Your system prompt here ${goal_of_email}`},{ role: "user", content: "" }],
    model: "gpt-4-1106-preview",
    max_tokens: 500,
    temperature: 1,
  });

  console.log(
    chatCompletion["choices"][0]["message"]["content"],
    chatCompletion
  );
}

main();
// const jsonData = {
//     key1: "value1",
//     key2: "value2"
//   };
  
//   // Convert JSON object to a string
//   const jsonString = JSON.stringify(jsonData);
  
//   // Your prompt template
//   const systemPromptTemplate = "{json_data}";
  
//   // Replace the placeholder with the JSON string
//   const systemPrompt = systemPromptTemplate.replace("{json_data}", jsonString);
  
//   console.log(systemPrompt);