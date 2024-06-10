const auth = require("./auth/authRoute");
const profile = require("./auth/profileRoute")
const tugasAkhir = require("./mhs/tugasAkhirRoute")
const bimbinganTa = require("./mhs/bimbinganTaRoute")
const konsultasiKaprodi = require("./mhs/konsultasiKaprodiRoute")

const server = {};
server.auth = auth;
server.profile = profile;
server.tugasAkhir = tugasAkhir;
server.bimbinganTa = bimbinganTa;
server.konsultasiKaprodi = konsultasiKaprodi;



module.exports = server;
