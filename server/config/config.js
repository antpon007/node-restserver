process.env.PORT = process.env.PORT || 3000;
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;
process.env.SEED = process.env.SEED || 'este-es-el-seed-secreto';

// base de datos
process.env.BD = process.env.BD || 'mongodb://localhost:27017/usuarios';