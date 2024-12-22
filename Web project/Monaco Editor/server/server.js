const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/compile', async (req, res) => {
    try {
        const response = await fetch('https://api.jdoodle.com/v1/execute', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                script: req.body.code,
                language: "vbn",
                versionIndex: "3",
                clientId: "4a982b0bc07ac4fffc73a85f1839ab49",
                clientSecret: "aa85239ef5f635261b7cea065137cdcb6d8c0d711dcab2aa5e7d88c9ad7d202d"
            })
        });

        const result = await response.json();

        // Filter out compiler information
        const output = result.output.split('\n').filter(line =>
            !line.includes('Visual Basic.Net Compiler') &&
            !line.includes('Copyright') &&
            !line.includes('Assembly') &&
            !line.includes('Compilation successful') &&
            !line.includes('Compilation took')
        ).join('\n').trim();

        res.json({ ...result, output });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});