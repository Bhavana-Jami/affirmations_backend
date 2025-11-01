// backend/index.js
import express from "express";
import bodyParser from "body-parser";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(bodyParser.json());

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// home route
app.post("/", async (req, res) => {
   return res.send("<h1>Hello from server!</h1>")
})
// POST endpoint to generate image from affirmation
app.post("/generate-image", async (req, res) => {
    try {
        const { affirmation } = req.body;

        if (!affirmation) {
            return res.status(400).json({ error: "Affirmation is required" });
        }

        // Call OpenAI Image API
        const response = await client.images.generate({
            model: "gpt-image-1",   // alias for DALL·E 3
            prompt: `Background image for affirmation: "${affirmation}". 
               Make it calming, aesthetic, and inspirational.`,
            size: "1024x1024", // can also be "512x512" or "256x256"
        });

        const imageUrl = response.data[0].url;
        res.json({ imageUrl });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Image generation failed" });
    }
});

app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});
