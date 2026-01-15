import 'dotenv/config';
import { BedrockAgentRuntimeClient, InvokeAgentCommand } from "@aws-sdk/client-bedrock-agent-runtime";

const client = new BedrockAgentRuntimeClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        sessionToken: process.env.AWS_SESSION_TOKEN,
    },
});

export const invokeAgent = async (inputText, sessionId) => {

    const command = new InvokeAgentCommand({
        agentId: process.env.AGENT_ID,
        agentAliasId: process.env.AGENT_ALIAS_ID,
        sessionId: sessionId,
        inputText: inputText,
    });

    try {

        const response = await client.send(command)
        let completion = ""

        //El agente devuelve un stream de eventos

        for await (const event of response.completion) {
            if (event.chunk) {
                // Decodificamos el trozo de texto recibido
                const chunk = Buffer.from(event.chunk.bytes).toString("utf-8");
                completion += chunk;
            }
        }

        return completion;

    } catch (error) {
        console.log("Error invocando al Agente: ", error)
        throw error
    }
}