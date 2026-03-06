const express = require('express');
const app = express();
app.get('*', (req, res) => res.send('EXPRESS WORKING'));
app.listen(3000, () => console.log('Minimal Express on 3000'));
