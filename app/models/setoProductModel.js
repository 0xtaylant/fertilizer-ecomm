import mongoose from 'mongoose';


const productSchema = new mongoose.Schema({
  stokKodu: String,
  stokIsmi: String,
  cinsi: String,
  birim: String,
  yogunlukOraniIsmi: String,
  anaGrupIsmi: String,
  altGrupIsmi: String,
  ureticiIsmi: String,
  markaIsmi: String,
  ambalajIsmi: String,
  formulasyonIsmi: String,
  agirlikBirimIsmi: String
});

const SetoProduct = mongoose.models.SetoProduct || mongoose.model('SetoProduct', productSchema);

export default SetoProduct;