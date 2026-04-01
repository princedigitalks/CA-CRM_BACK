const path = require('path');
const fs = require('fs');

function getUploadedPath(filename) {
  return `/uploads/${filename}`;
}

function deleteFile(filename) {
  const filePath = path.join(__dirname, '..', 'uploads', path.basename(filename));
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return true;
  }
  return false;
}

module.exports = {
  getUploadedPath,
  deleteFile
};
