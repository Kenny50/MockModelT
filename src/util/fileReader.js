const fs = require('fs');
const path = require('path');

const rpath = "/Users/chang/freelance/mock-tnn-modelt/data/"
const directoryPath = rpath + "warning"; // Replace with the actual path to your directory

// Read the contents of the directory
fs.readdir(directoryPath, (err, files) => {
  if (err) {
    console.error('Error reading directory:', err);
    return;
  }

  // Sort the file names
  files.sort();

  // Iterate through the sorted file names and rename each file
  files.forEach((file, index) => {
    const oldFilePath = path.join(directoryPath, file);
    const newFileName = `${index + 1}.json`;
    const newFilePath = path.join(directoryPath, newFileName);

    // Rename the file
    fs.rename(oldFilePath, newFilePath, (renameErr) => {
      if (renameErr) {
        console.error(`Error renaming ${file}:`, renameErr);
      } else {
        console.log(`Renamed ${file} to ${newFileName}`);
      }
    });
  });
});
