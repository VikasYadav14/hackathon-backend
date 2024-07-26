let { gptResponse } = require('../services/LLM');

const LLM = {

    aiResponse: async (req, res) => {
        try {

            let { query, image } = req.body;
            
            if (!query && !image) {
                return res.status(200).json({ msg: "please proive a valid query or image" })
            }

            // now System Prompt;
            let messages = [{
                role: 'system',
                content: ``
            },
            {
                role: 'user',
                content: `${query}`
            }
            ]

            let response = await gptResponse(messages);
            response = response.data.choices[0].message.content
            console.log(typeof (response));

            return res.status(200).json(response)


        } catch (error) {
            console.log(error);
            res.send({ error })
        }
    },

    health: async (req, res) => {
        try {
            console.log({ msg: "Api is working." });
            res.status(200).json({ msg: "Api is working." });
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: "internal server error." });
        }
    }

};

module.exports = LLM;