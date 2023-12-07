const fs = require('fs');
const path = require('path');

const readAndMergeJSONFiles = (folderPath) => {
  return new Promise((resolve, reject) => {
    fs.readdir(folderPath, (err, files) => {
      if (err) {
        reject(err);
        return;
      }

      let mergedData = [];
      files.forEach(file => {
        if (path.extname(file) === '.json') {
          try {
            const data = fs.readFileSync(path.join(folderPath, file), 'utf8');
            mergedData = mergedData.concat(JSON.parse(data));
          } catch (error) {
            reject(error);
          }
        }
      });

      resolve(mergedData);
    });
  });
};

module.exports = readAndMergeJSONFiles;
