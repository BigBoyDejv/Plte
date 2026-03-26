// generate-icons.js
// Spustite: node generate-icons.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

// Získanie aktuálneho priečinka (pre ES moduly)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Konfigurácia
const SOURCE_IMAGE = path.join(__dirname, 'public', 'favicon.png');
const OUTPUT_DIR = path.join(__dirname, 'public', 'icons');

// Požadované veľkosti
const SIZES = [72, 96, 128, 144, 152, 192, 384, 512];

// Vytvorenie výstupného priečinka
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log('📁 Vytvorený priečinok: public/icons/');
}

async function generateIcons() {
    console.log('🎨 Generujem PWA ikony...\n');

    // Kontrola, či zdrojový obrázok existuje
    if (!fs.existsSync(SOURCE_IMAGE)) {
        console.error(`❌ Zdrojový obrázok neexistuje: ${SOURCE_IMAGE}`);
        console.log('💡 Uistite sa, že máte obrázok v public/favicon.png');
        return;
    }

    for (const size of SIZES) {
        const outputPath = path.join(OUTPUT_DIR, `icon-${size}x${size}.png`);

        try {
            await sharp(SOURCE_IMAGE)
                .resize(size, size)
                .png({ quality: 90, compressionLevel: 9 })
                .toFile(outputPath);

            console.log(`✅ Vygenerované: icon-${size}x${size}.png`);
        } catch (error) {
            console.error(`❌ Chyba pri generovaní ${size}x${size}:`, error.message);
        }
    }

    console.log('\n🎉 Všetky ikony boli vygenerované!');
    console.log(`📁 Umiestnenie: ${OUTPUT_DIR}`);
}

// Spustenie
generateIcons().catch(console.error);