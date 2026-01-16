const { ElevenLabsClient } = require("@elevenlabs/elevenlabs-js");

const elevenlabs = new ElevenLabsClient({
    apiKey: process.env.ELEVENLABS_API_KEY,
});

const scribeController = async (req, res) => {
    const token = await elevenlabs.tokens.singleUse.create("realtime_scribe");

    res.json(token);
};

module.exports = scribeController;

