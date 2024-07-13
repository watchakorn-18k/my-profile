// place files you want to import through the `$lib` alias in this folder.
// lib/fetchData.ts
import axios from 'axios';

export async function fetchData() {
    try {
        const response = await axios.get('https://wakatime.com/share/@watchakorn_18k/3af6a287-dfcd-4bb9-a295-aa1306b37122.json');
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // ส่ง error ต่อเพื่อให้โค้ดที่เรียกใช้ได้รับการจัดการ
    }
}
