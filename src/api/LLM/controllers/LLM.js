const { gptResponse, analyzeImageWithOpenAI } = require('../services/LLM');
const { put } = require("@vercel/blob");
const pdf = require('pdf-poppler');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const LLM = {

    imageRec: async (req, res) => {
        try {

            const files = req.files;
            if (!files || files.length === 0) {
                return res.status(400).send('No files uploaded.');
            }

            const fileUrls = await Promise.all(files.map(async file => {

                let fileBuffer = file.buffer;

                if (file.mimetype === 'image/png') {
                    fileBuffer = await sharp(file.buffer).jpeg().toBuffer();
                } else if (file.mimetype === 'application/pdf') {
                    const originalNameWithoutExt = path.basename(file.originalname, path.extname(file.originalname));
                    const tempPdfPath = path.join(__dirname, `../../../../uploads/pdfData/${originalNameWithoutExt}.pdf`);
                    const tempJpegPath = path.join(__dirname, `../../../../uploads/imgData/${originalNameWithoutExt}.jpeg`);

                    fs.writeFileSync(tempPdfPath, file.buffer);

                    const options = {
                        format: 'jpg',
                        out_dir: path.dirname(tempJpegPath),
                        out_prefix: originalNameWithoutExt,
                        page: null
                    };

                    let convertedImg = await pdf.convert(tempPdfPath, options);
                    console.log(convertedImg);

                   
                    const newFilename = addSuffixToFilename(tempJpegPath, '-1');
                    console.log(newFilename); 

                    fileBuffer = fs.readFileSync(newFilename); // Use the path of the converted image

                    fs.unlinkSync(tempPdfPath);
                    fs.unlinkSync(newFilename); // Unlink the converted image file
                }


                const result = await put(file.originalname, file.buffer, { access: 'public' });
                return result.url;
            }));

            let employeData = []

            for (let i = 0; i < fileUrls.length - 1; i++) {

                let message = [
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
                                    Extract the Father Name
                                    Extract the Address


                                    If the image is a PAN card:

                                    Extract only the PAN number



                                    Provide the extracted information in JSON format as follows:
                                    {
                                    'employeeName': <value>,
                                    'mobileNumber': <value>,
                                    'DOB': <value>,
                                    'gender': <value>,
                                    'aadharNumber': <value>,
                                    'employeesAddress': <value>,
                                    'PANNumber': <value>
                                    'fatherName': <value>
                                    }
                                If a value is not available or not applicable for the given card type, set the value to null. Ensure all fields are included in the JSON output, even if they are null.`
                    },

                    {
                        role: "user",
                        content: [
                            {
                                type: "image_url",
                                image_url: { url: fileUrls[i] },
                            },
                        ],
                    },
                ]

                let imgdata = await analyzeImageWithOpenAI(message);

                imgdata = await responseJson(imgdata);

                employeData.push(imgdata)

            }




            console.log(fileUrls);

            return res.json({ employeData });


        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: "internal server error.", error })
        }
    },

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

function responseJson(jsonString) {
    const cleanedString = jsonString.replace(/^```json\n|```$/g, '');

    try {
        const parsedData = JSON.parse(cleanedString);

        return parsedData;
    } catch (error) {
        console.error('Error parsing JSON:', error);
        return null;
    }
}

function addSuffixToFilename(filename, suffix) {
    const extensionIndex = filename.lastIndexOf('.');
    if (extensionIndex === -1) {
        return `${filename}${suffix}`;
    }
    
    const name = filename.substring(0, extensionIndex);
    const extension = filename.substring(extensionIndex);
    return `${name}${suffix}${".jpg"}`;
}