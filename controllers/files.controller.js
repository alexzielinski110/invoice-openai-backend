require("dotenv").config();

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  organization: process.env.ORGANIZATION_ID,
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

exports.getFiles = async (req, res) => {
  const body = await openai.listFiles();
  const { data } = body.data;

  res.send(JSON.stringify(data));
};

exports.deleteFile = async (req, res) => {
  const { id } = req.params;

  const body = await openai.deleteFile(id);
  const { data } = body;

  res.send({ success: data.deleted });
}