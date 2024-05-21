const auth = require("./auth/authRoute");
const profile = require("./auth/profileRoute")

const server = {};
server.auth = auth;
server.profile = profile;

module.exports = server;
