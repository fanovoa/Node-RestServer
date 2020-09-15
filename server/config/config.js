// ====================
// Puerto
//=====================
process.env.PORT = process.env.PORT || 3000;



// ====================
// Entorno
//=====================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// ====================
// Base de datos
//=====================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    urlDB = 'mongodb+srv://ragnarok_fabian:WJVwwYVHpehASv5x@cluster0.pmmbg.mongodb.net/cafe'
}

process.env.URLBD = urlDB;