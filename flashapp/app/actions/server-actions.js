'use server'
import path from 'path'
import fs from 'fs-extra'
import { redirect } from 'next/navigation'

export async function getFlashcardHistory() {
    const filepath = path.join(process.cwd(), 'public/data.json');
    const fileContents = await fs.readFile(filepath, 'utf-8');
    const jsonData = JSON.parse(fileContents);
    return jsonData
}