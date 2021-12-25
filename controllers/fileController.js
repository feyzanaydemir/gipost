const fs = require('fs');

exports.file2Base64 = (req, res) => {
  const media = fs.readFileSync(req.file.path);
  const base64String = Buffer.from(media).toString('base64');

  res.status(201).json(`data:image/png;base64,${base64String}`);
};
