require("dotenv").config();

const path = require("path");
const fs = require("fs");

// Imports the Google Cloud client library
const { Storage } = require("@google-cloud/storage");

// Google Doc AI
const projectId = "prj-d-contract-doc-ai-1";
const location = "us"; // Format is 'us' or 'eu'
const processorId = "76201d7043ecc8af"; // Create processor in Cloud Console
const { DocumentProcessorServiceClient } =
  require("@google-cloud/documentai").v1;

const filters = [
  "supplier_name",
  "supplier_address",
  "receiver_name",
  "receiver_address",
  "invoice_date",
  "due_date",
  "delivery_date",
  "total_amount",
  "currency",
];

// Instantiates a client
const client = new DocumentProcessorServiceClient();

const googleDocAI = async (encodedPdf) => {
  // The full resource name of the processor, e.g.:
  // projects/project-id/locations/location/processor/processor-id
  // You must create new processors in the Cloud Console first
  const name = `projects/${projectId}/locations/${location}/processors/${processorId}`;

  const request = {
    name,
    rawDocument: {
      content: encodedPdf,
      mimeType: "application/pdf",
    },
  };

  // Recognizes text entities in the PDF document
  const [metadata] = await client.processDocument(request);

  // Read the text recognition output from the processor
  // For a full list of Document object attributes,
  // please reference this page: https://googleapis.dev/nodejs/documentai/latest/index.html
  const { document } = metadata;
  const { entities } = document;

  // Read the text recognition output from the processor
  const params = new Array();
  entities.forEach((entity) => {
    if (filters.includes(entity.type)) {
      const value =
        entity.normalizedValue && entity.normalizedValue.text.length > 0
          ? entity.normalizedValue.text
          : entity.mentionText;
      params[entity.type] = value.replace(/\s+/g, " ").trim();
    }
  });

  return params;
};

exports.uploadInvoice = async (req, res) => {
  const { filename, invoice } = req.body;
  const dir = "public/invoices";
  await fs.mkdirSync(dir, { recursive: true });
  const filePath = `${dir}/${filename}`;
  await fs.writeFileSync(filePath, invoice, "base64");

  const result = await googleDocAI(invoice);
  const metadata = Object.assign({}, result);

  res.send(JSON.stringify(metadata));
};

exports.createJSONL = async (req, res) => {
  const { metadata } = req.body;

  let trains = [];
  metadata.forEach((value) => {
    let tmp = [];
    Object.keys(value).map((key) => {
      tmp.push(`${key}=${value[key]}`);
    });

    const dt = value["invoice_date"].split("-");
    const yy = parseInt(dt[0]),
      mm = parseInt(dt[1]) - 1,
      dd = parseInt(dt[2]);

    const date = new Date(yy, mm, dd);
    const month = date.toLocaleString("default", { month: "long" });

    trains.push({
      prompt: tmp.join(", ") + "->",
      completion: `The invoice amount is ${value["total_amount"]} on ${dd} ${month} ${yy}`,
    });
  });

  const dir = "public/jsonl";
  await fs.mkdirSync(dir, { recursive: true });

  const now = new Date();
  const filePath = `${dir}/${now.getTime()}.jsonl`;
  trains.forEach((value, index) => {
    const content = JSON.stringify(value);
    if (index == 0) {
      fs.writeFileSync(filePath, content + "\n");
    } else {
      fs.appendFileSync(filePath, content + "\n");
    }
  });

  res.send({ success: true });
};
