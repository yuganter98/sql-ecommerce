
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

async function testUpload() {
    try {
        // Create a dummy file
        const filePath = path.join(__dirname, 'test_image.txt');
        fs.writeFileSync(filePath, 'fake image content');

        const form = new FormData();
        form.append('image', fs.createReadStream(filePath), {
            filename: 'test_image.txt',
            contentType: 'text/plain', // forcing non-image to test filter first, then we try spoofing or real image if needed. 
            // Wait, my middleware checks mimetype starting with image/.
            // So this should fail with "Not an image!". 
            // Let's force proper headers to test success path if logic allows, 
            // or better, actually make a file that passes the filter if I can mock the mime.
        });

        // Let's try with a real-ish header or just see if connection works.
        // Actually, let's try to mock it as an image for the filter.

        const form2 = new FormData();
        form2.append('image', Buffer.from('fake image data'), {
            filename: 'test.png',
            contentType: 'image/png'
        });

        console.log('Attempting upload...');
        const response = await axios.post('http://localhost:3000/api/upload', form2, {
            headers: {
                ...form2.getHeaders()
            }
        });

        console.log('Success:', response.data);
    } catch (error: any) {
        if (error.response) {
            console.error('Error Response:', error.response.status, error.response.data);
        } else {
            console.error('Error:', error.message);
        }
    }
}

testUpload();
