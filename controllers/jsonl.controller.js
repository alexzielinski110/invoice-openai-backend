require("dotenv").config();

const path = require("path");
const fs = require("fs");

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  organization: process.env.ORGANIZATION_ID,
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const dir = "public/jsonl";

exports.getJsonlList = async (req, res) => {
  const result = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((item) => !item.isDirectory())
    .map((item) => item.name);

  res.send(JSON.stringify(result));
};

exports.uploadJsonl = async (req, res) => {
  const { file } = req.params;

  const resp = await openai.createFile(
    fs.createReadStream(`${dir}/${file}`),
    'fine-tune'
  );

  res.send({ success: true });
};
