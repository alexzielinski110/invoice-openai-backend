require("dotenv").config();

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  organization: process.env.ORGANIZATION_ID,
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

exports.getCompletion = async (req, res) => {
  const { prompt } = req.body;
  const body = await openai.createCompletion({
    model: "curie:ft-cloudwave-inc-2023-04-21-03-40-21",
    prompt: prompt,
    temperature: 0,
    max_tokens: 10,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  const { data } = body;

  res.send(JSON.stringify(data.choices));
};