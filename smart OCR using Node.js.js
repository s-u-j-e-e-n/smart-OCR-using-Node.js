const Tesseract = require('tesseract.js');
const fs = require('fs');

async function processImage(imagePath) {
  try {
    const { data } = await Tesseract.recognize(imagePath, 'eng');
    return extractDetails(data.text);
  } catch (error) {
    console.error('Error processing image:', error);
    throw error; // rethrow the error to be caught by the error event listener
  }
}
function extractDetails(text) {
  const lines = text.split('\n');
  const idType = 'panCard';
  const idNumberRegex = /[A-Z]{5}\d{4}[A-Z]{1}/;
  const dobRegex = /\d{2}[/]\d{2}[/]\d{4}/;

  let idNumber = '';
  let name = '';
  let fatherName = '';
  let dob = '';

  for (const line of lines) {
    if (!idNumber && idNumberRegex.test(line)) {
      idNumber = line.match(idNumberRegex)[0];
    }

    if (!dob && dobRegex.test(line)) {
      dob = line.match(dobRegex)[0];
    }

    if (/^Name:/.test(line)) {
      name = line.split(':')[1]?.trim();
    }

    if (/^Father's Name:/.test(line)) {
      fatherName = line.split(':')[1]?.trim();
      f
    }
  }

  return {
    idType,
    idNumber,
    info: {
      Name: name,
      "Father's Name": fatherName,
      dob,
    },
  };
}

const imagePath = 'pan1.jpg';
processImage(imagePath)
  .then((result) => console.log(JSON.stringify(result, null, 2)))
  .catch((error) => console.error('Error:', error));

// Add an 'error' event listener to catch any errors emitted by `processImage`
process.on('unhandledRejection', error => {
  console.error('Unhandled promise rejection:', error);
  process.exit(1);
});
