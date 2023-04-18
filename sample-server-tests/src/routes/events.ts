import express from "express";
import mongoose from "mongoose";
import { body, header, param, query } from "express-validator";
import { Evento, Biglietto } from "../models/Events";
const router = express.Router();

const app = express();

interface FiltroEvento {
    tipo?: string;
    postiDisponibili?: number;
  }

app.use(express.json());




// endpoint per ottenere tutti gli eventi
app.get("/eventi", async (req, res) => {
    try {
      const filtro: FiltroEvento = req.query;
      const query = filtro.tipo
        ? { tipo: filtro.tipo }
        : filtro.postiDisponibili
        ? { postiDisponibili: { $gte: filtro.postiDisponibili } }
        : {};
      const eventi = await Evento.find(query).populate("biglietti");
      res.json(eventi);
    } catch (error) {
      console.error(error);
      res.status(500).send("Errore nel recupero degli eventi");
    }
  });
  

// endpoint per ottenere un singolo evento in base all'id
app.get("/eventi/:id", async (req, res) => {
  try {
    const evento = await Evento.findById(req.params.id).populate("biglietti");
    if (!evento) {
      res.status(404).send("Evento non trovato");
    } else {
      res.json(evento);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Errore nel recupero dell'evento");
  }
});


// endpoint per ottenere tutti i biglietti di un evento
app.get("/eventi/:id/tickets", async (req, res) => {
    try {
      const evento = await Evento.findById(req.params.id).populate("biglietti");
      if (!evento) {
        res.status(404).send("Evento non trovato");
      } else {
        res.json(evento.biglietti);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Errore nel recupero dei biglietti");
    }
  });
  
  // endpoint per acquistare i biglietti di un evento
  app.post("/eventi/:id/tickets", async (req, res) => {
    const { nome, prezzo } = req.body;
  
    try {
      const evento = await Evento.findById(req.params.id);
      if (!evento) {
        res.status(404).send("Evento non trovato");
      } else {
        if (evento.postiDisponibili <= 0) {
          res.status(400).send("Posti esauriti per questo evento");
        } else {
          const biglietto = new Biglietto({
            nome,
            prezzo,
            evento: evento._id,
          });
  
          evento.biglietti.push(biglietto._id);
          evento.postiDisponibili--;
  
          await biglietto.save();
          await evento.save();
  
          res.status(201).json(biglietto);
        }
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Errore nell'acquisto del biglietto");
    }
  });
  
  // endpoint per la modifica di un evento specifico
  app.put("/eventi/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const evento = await Evento.findById(id);
      if (!evento) {
        res.status(404).send("Evento non trovato");
        return;
      }
      evento.titolo = req.body.titolo;
      evento.descrizione = req.body.descrizione;
      evento.tipo = req.body.tipo;
      evento.data = req.body.data;
      evento.postiDisponibili = req.body.postiDisponibili;
      await evento.save();
      res.sendStatus(200);
    } catch (error) {
      console.error(error);
      res.status(500).send("Errore nell'aggiornamento dell'evento");
    }
  });

  // endpoint per l'eliminazione di un evento specifico
  app.delete("/eventi/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const evento = await Evento.findById(id);
      if (!evento) {
        res.status(404).send("Evento non trovato");
        return;
      }
      await evento.deleteOne();
      res.sendStatus(200);
    } catch (error) {
      console.error(error);
      res.status(500).send("Errore nell'eliminazione dell'evento");
    }
  });
  
  export default app;