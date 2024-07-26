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

    analyzeImageWithOpenAI: async (imageUrl) => {
        try {
            const response = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    {
                        role: "system",
                        content: `Analyze the provided image and determine if it is an Aadhaar card front, Aadhaar card back, or PAN card. Then extract the relevant information as follows:
                        If the image is an Aadhaar card front:
                        
                        Extract the employee's name
                        Extract the mobile number
                        Extract the date of birth
                        Extract the gender
                        Extract the Aadhaar number
                        
                        If the image is an Aadhaar card back:
                        
                        Extract the employee's address
                        
                        If the image is a PAN card:
                        
                        Extract only the PAN number
                    
                        Provide the extracted information in a clear, organized format.`
                    },
                    {
                        role: "user",
                        content: [
                            { type: "text", text: "What’s in this image?" },
                            {
                                type: "image_url",
                                image_url: { url: imageUrl },
                            },
                        ],
                    },
                ],
            });
            return response.choices[0].message.content;
        } catch (error) {
            console.error(`Error analyzing image:`, error.response ? error.response.data : error.message);
            return null;
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

