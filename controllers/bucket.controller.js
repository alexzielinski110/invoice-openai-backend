require("dotenv").config();

const path = require("path");

// Imports the Google Cloud client library
const { Storage } = require("@google-cloud/storage");

// Creates a client
const projectId = 'prj-d-contract-doc-ai-1';
// const keyFileName = 'client_secret.json';
const storage = new Storage({ projectId });

const bucketName = "cloudwaveinc-invoice";
const fileName = "Paycheck_2022-05-14_2022-05-27.pdf";
const generationMatchPrecondition = 0;

exports.upload = async (req, res) => {
  const filePath = path.resolve("assets/invoices", fileName);

  const options = {
    destination: "test.pdf",
    preconditionOpts: { ifGenerationMatch: generationMatchPrecondition },
  };

  await storage.bucket(bucketName).upload(filePath, options);

  res.send("Success!!!");
};
