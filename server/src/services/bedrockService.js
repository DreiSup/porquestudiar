//Este archivo será el único que "hable con bedrock"
require('dotenv').config();

const { BedrockRuntimeClient, ConverseCommand } = require("@aws-sdk/client-bedrock-runtime");

console.log("DEBUG: Región cargada ->", process.env.AWS_REGION);
console.log("DEBUG: Model ID cargado ->", process.env.MODEL_ID);

const client = new BedrockRuntimeClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        sessionToken: process.env.AWS_SESSION_TOKEN,
    },
});

const modelId = process.env.MODEL_ID

/* const userMessage =
  "Describe the purpose of a 'hello world' program in one line."; */
  
  //Envuelvo todo en una función async para que ESLint no se queje por el await
  const sendRequestBedrock = async (userMessage) =>{
      
      const conversation = [
        {
          role: "user",
          content: [{ text: userMessage }],
        },
      ];

      const command = new ConverseCommand({
        modelId,
        messages: conversation,
        inferenceConfig: { maxTokens: 500, temperature: 0.5, topP: 0.9 },
      });
      
      try {
        // Send the command to the model and wait for the response
        const response = await client.send(command);
      
        // Extract and print the response text.
        const responseText = response.output.message.content[0].text;
        console.log(responseText);
        return responseText
      } catch (err) {
        console.log(`ERROR: Can't invoke '${modelId}'. Reason: ${err}`);
        throw err;
      };

    }
    
module.exports = {sendRequestBedrock}