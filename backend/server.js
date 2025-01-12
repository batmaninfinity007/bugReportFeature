const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT  3000;

app.use(cors());
app.use(express.static('uploads'));

const upload = multer({ dest 'uploads' });

app.post('report', upload.single('recording'), (req, res) = {
    const { browserInfo, errorDetails } = req.body;
    const recording = req.file;

    const report = {
        id Date.now(),
        timestamp new Date(),
        browserInfo,
        errorDetails,
        recordingPath recording  recording.path  null
    };

    fs.writeFileSync(`uploadsreport_${report.id}.json`, JSON.stringify(report, null, 2));
    res.status(200).json({ message 'Bug report submitted successfully!' });
});

app.listen(PORT, () = console.log(`Server running on port ${PORT}`));
