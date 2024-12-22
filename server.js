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
                language: "vb",
                versionIndex: "0",
                clientId: "4a982b0bc07ac4fffc73a85f1839ab49",
                clientSecret: "aa85239ef5f635261b7cea065137cdcb6d8c0d711dcab2aa5e7d88c9ad7d202d"
            })
        });
        
        const result = await response.json();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
}); 