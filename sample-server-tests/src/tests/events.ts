import request from "supertest";
import express from "express";
import { app } from "../app";
require("chai").should();
import { Evento, Biglietto } from "../models/Events";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const jwtToken = "shhhhhhh"; // token per la creazione del token JWT

const basicUrl = "/v1/eventi"; // URL base per le chiamate alla API
app.use(express.json());

const event = {
    titolo: "evento1",
  descrizione: "desc",
  tipo: "tipo1",
  data: 22/10/2023,
  postiDisponibili: 8,
  biglietti: {
    nome: "biglietto1",
  prezzo: 5,
  evento: "evento"
  },
}


describe('API Test', () => {
  let eventId = '';

  // Test per la creazione di un nuovo evento
  it('Dovrebbe creare un nuovo evento', (done) => {
    request(app)
      .post('/api/events')
      .send({
        titolo: 'Evento Test',
        descrizione: 'Descrizione evento test',
        data: '2023-05-01',
        tipo: 'Concerto',
        postiDisponibili: 100,
        prezzoBiglietto: 10,
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        res.body.should.have.property('message').eql('Evento creato con successo');
        res.body.should.have.property('eventId');
        eventId = res.body.eventId;
        done();
      });
  });

  // Test per ottenere tutti gli eventi
  it('Dovrebbe ottenere tutti gli eventi', (done) => {
    request(app)
      .get('/api/events')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        res.body.should.be.an('array');
        done();
      });
  });

  // Test per ottenere un evento specifico in base all'id
  it('Dovrebbe ottenere un evento in base all\'id', (done) => {
    request(app)
      .get(`/api/events/${eventId}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        res.body.should.have.property('titolo').eql('Evento Test');
        done();
      });
  });

  // Test per ottenere tutti i biglietti di un evento specifico
  it('Dovrebbe ottenere tutti i biglietti di un evento', (done) => {
    request(app)
      .get(`/api/events/${eventId}/tickets`)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        res.body.should.be.an('array');
        done();
      });
  });

  // Test per l'acquisto dei biglietti per un evento specifico
  it('Dovrebbe acquistare i biglietti di un evento', (done) => {
    request(app)
      .post(`/api/events/${eventId}/tickets`)
      .send({
        nome: 'Mario Rossi',
        email: 'mario.rossi@example.com',
        quantita: 2,
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        res.body.should.have.property('message').eql('Acquisto effettuato con successo');
        done();
      });
  });

  // Test per la modifica delle informazioni di un evento specifico
    it('Dovrebbe modificare un evento esistente', async () => {
    const res = await request(app).put(`/api/events/${eventId}`).send({
      titolo: 'Evento modificato',
      descrizione: 'Descrizione evento modificato',
    });
    res.status.should.equal(200);
    res.body.titolo.should.equal('Evento modificato');
    res.body.descrizione.should.equal('Descrizione evento modificato');
  });

  let id: string;
  before(async () => {
    const p = await Evento.create(event);
    id = p._id.toString();
    });
// Test per l'eliminazione di un evento specifico
it.only("Test success 200", async () => {
    const { status } = await request(app)
    .delete(`${basicUrl}/${id}`)
    status.should.be.equal(200);
    });

});





