// ====================
// Puerto
//=====================
process.env.PORT = process.env.PORT || 3000;



// ====================
// Entorno
//=====================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';



// ====================
// Vencimiento del Token
//=====================
// 60 segundos
// 60 mintutos
// 24 horas
// 1 días
process.env.CADUCIDAD_TOKEN = '1d';


// ====================
// SEED de autenticación
//=====================
process.env.SEED = process.env.SEED || 'seed+de+desarrollo__102316';


// ====================
// Base de datos
//=====================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    urlDB = process.env.MONGO_URL;
}

process.env.URLBD = urlDB;

// ====================
// Google Cliente ID
//=====================

process.env.CLIENT_ID = process.env.CLIENT_ID || '942344024580-66f3iatg5jru6b4s3plf1e7j5fbbaje7.apps.googleusercontent.com';