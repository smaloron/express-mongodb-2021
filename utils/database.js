const { MongoClient, ObjectID } = require('mongodb');
// L'URL de la base et les infos de connexion sont stockées dans un fichier
// qui doit être ignoré par Git pour ne pas pousser des infos confidentielles sur Github
const mongoURL = 'mongodb://localhost:27017';

let mongoConnection;

// La connexion au serveur retourne une promesse
// ici on stocke la connexion dans une variable
const getConnection = async () => {
  if (!mongoConnection) {
    mongoConnection = await MongoClient(mongoURL).connect({
      useUnifiedTopology: true,
    });
  }
  return mongoConnection;
};
// Une fois la connexion établie il faut sélectionner la base de données
// et la collection sur laquelle on veut travailler
const getCollection = async (database, collection) => {
  const cn = await getConnection();
  return cn.db(database).collection(collection);
};
const getMovies = async () => {
  return await getCollection('sample_mflix', 'movies');
};

module.exports = {
  getConnection,
  getCollection,
  getMovies,
  ObjectID,
};
