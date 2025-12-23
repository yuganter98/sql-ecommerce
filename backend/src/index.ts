import dotenv from 'dotenv';
dotenv.config();

import app from './app';

const PORT = process.env.PORT || 3000;

import { initializeSearchIndex } from './services/searchService';

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    await initializeSearchIndex();
});
