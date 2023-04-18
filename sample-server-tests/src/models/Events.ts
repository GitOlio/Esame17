import mongoose from "mongoose";

const EventoSchema = new mongoose.Schema({
  titolo: { type: String, required: true },
  descrizione: { type: String, required: true },
  tipo: { type: String, required: true },
  data: { type: Date, required: true },
  postiDisponibili: { type: Number, required: true },
  biglietti: [{ type: mongoose.Schema.Types.ObjectId, ref: "Biglietto" }],
});


const BigliettoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  prezzo: { type: Number, required: true },
  evento: { type: mongoose.Schema.Types.ObjectId, ref: "Evento" },
});


export const Evento = mongoose.model("Evento", EventoSchema);
export const Biglietto = mongoose.model("Biglietto", BigliettoSchema);
