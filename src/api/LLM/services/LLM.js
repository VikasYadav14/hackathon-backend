const axios = require('axios');
require('dotenv').config();
const openaiApiKey = process.env.OPENAI_API_KEY
const endpoint = process.env.OPENAI_ENDPOINT

let gptResponse = {

    gptResponse: async (messages) => {
        try {
            
            const data = {
                model: 'gpt-4o',
                messages: messages,
                max_tokens: 1000,
                temperature: 0.3,
            };

            const response = await axios.post(endpoint, data, {
                headers: {
                    'Authorization': `Bearer ${openaiApiKey}`,
                    'Content-Type': 'application/json',
                },
            });

            return response;

        } catch (error) {
            console.log(error);
            throw new Error('Failed to get response from OpenAI API');
        }
    },

    gptStreamResponse: async (messages, res) => {
        try {
            const data = {
                model: 'gpt-4o',
                messages: messages,
                max_tokens: 1000,
                temperature: 0.3,
                stream: true
            };

            const response = await axios({
                method: 'post',
                url: endpoint,
                data: data,
                responseType: 'stream',
                headers: {
                    'Authorization': `Bearer ${openaiApiKey}`,
                    'Content-Type': 'application/json',
                },
            });

            // Set headers for chunked transfer
            res.setHeader('Content-Type', 'text/plain');
            res.setHeader('Transfer-Encoding', 'chunked');

            // Pipe the response stream to the client response
            let resdata = [];
            response.data.on('data', (chunk) => {
                let strChunk = chunk.toString();
                const lines = chunk.toString().split('\n').filter(line => line.trim() !== '');
                console.log(lines);
                for (const line of lines) {
                    if (line.includes('data:')) {
                        const jsonData = line.replace(/^data: /, '');
                        if (jsonData !== '[DONE]') {
                            try {
                                const parsed = JSON.parse(jsonData);
                                const content = parsed.choices[0].delta.content;
                                if (content) {

                                    res.write(`data: ${JSON.stringify({ content })}\n\n`);
                                }
                            } catch (error) {
                                console.error('Error parsing JSON:', error);
                            }
                        }
                    }
                }
            });

            response.data.on('end', () => {
                res.end();
            });

            response.data.on('error', (err) => {
                console.error('Error in stream:', err);
                if (!res.headersSent) {
                    res.status(500).json({ error: 'Error in streaming response from OpenAI API' });
                } else {
                    res.end();
                }
            });

        } catch (error) {
            console.error('Error:', error.message);
            if (!res.headersSent) {
                res.status(500).json({ error: 'Failed to get stream response from OpenAI API' });
            }
        }
    }
    

};

module.exports = gptResponse;

