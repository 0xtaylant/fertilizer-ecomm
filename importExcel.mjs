import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import xlsx from 'xlsx';
import mongooseConnect from './lib/mongoose.mjs';
import SetoProduct from './app/models/setoProductModel.mjs';

async function importProducts() {
    await mongooseConnect();

    // Read Excel file
    const workbook = xlsx.readFile('/Users/taylanturker/Documents/setoDocuments/Stok Kartları.xlsx');
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convert sheet to JSON
    const data = xlsx.utils.sheet_to_json(sheet);

    try {
        for (const item of data) {
            const product = new SetoProduct({
                stokKodu: item['STOK KODU'],
                stokIsmi: item['STOK İSMİ'],
                cinsi: item['CİNSİ'],
                birim: item['BİRİM'],
                yogunlukOraniIsmi: item['YOĞUNLUK ORANI İSMİ'],
                anaGrupIsmi: item['ANA GRUP İSMİ'],
                altGrupIsmi: item['ALT GRUP İSMİ'],
                ureticiIsmi: item['ÜRETİCİ İSMİ'],
                markaIsmi: item['MARKA İSMİ'],
                ambalajIsmi: item['AMBALAJ İSMİ'],
                formulasyonIsmi: item['FORMÜLASYON İSMİ'],
                agirlikBirimIsmi: item['AĞIRLIK-BİRİM İSMİ']
            });

            await product.save();
            console.log(`Imported: ${product.stokIsmi}`);
        }
        console.log('Data import completed');
    } catch (error) {
        console.error('Error importing data:', error);
    } finally {
        await mongoose.connection.close();
    }
}

importProducts().then(() => console.log('Import process finished'));