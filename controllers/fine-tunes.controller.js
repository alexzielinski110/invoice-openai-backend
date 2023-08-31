require("dotenv").config();

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  organization: process.env.ORGANIZATION_ID,
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

exports.getFineTunes = async (req, res) => {
  const body = await openai.listFineTunes();
  const { data } = body.data;

  res.send(JSON.stringify(data));
};

exports.createFineTunes = async (req, res) => {
  await openai.createFineTune(req.body);
  res.send({ success: true });
};

exports.deleteFineTunes = async (req, res) => {
  const { id } = req.params;
  console.log(id);

  const resp = await openai.cancelFineTune(id);
  // const resp = await openai.deleteModel(id);
  const { data } = resp;

  console.log(data);

  res.send({ success: true });
};

exports.moderation = async (req, res) => {
  const resp = await openai.createModeration({
    input: "What's the invoice amount for 2023?",
  });

  const { data } = resp;

  console.log(data.results);
};
