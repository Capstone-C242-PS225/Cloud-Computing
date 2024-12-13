const { Firestore } = require('@google-cloud/firestore');

const path = require('path');

const pathKey = path.resolve(__dirname, '../JSON/INI-PENTING.json');
const collectionName = 'materi';

const getDataByField = async (field, operator, value) => {
    const db = new Firestore({
        projectId: process.env.projectId,
        keyFilename: pathKey,
    });
    try {
      const collectionRef = db.collection(collectionName); 
      const querySnapshot = await collectionRef.where(field, operator, value).get();
  
      if (querySnapshot.empty) {
        console.log("No matching documents.");
        return [];
      }
  
      const results = [];
      querySnapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() });
      });
  
      return results;
    } catch (error) {
      console.error("Error getting documents: ", error);
      throw error;
    }
};

async function getAdv(addict) {
    try {
        const addNow = addict.charAt(0).toUpperCase() + addict.slice(1).toLowerCase();
        const data = await getDataByField("target", "==", addNow);
        const randomAns = data[Math.floor(Math.random() * data.length)];
        return randomAns;
    } catch(error) {
        throw error;
    }
}

async function getAll() {
  try {
    const db = new Firestore({
      projectId: process.env.projectId,
      keyFilename: pathKey,
    });
    const data = await db.collection(collectionName).get();
    const materiList = [];
    data.forEach((doc) => {
      materiList.push({ id: doc.id, ...doc.data() });
    });
    return materiList;
  } catch(error) {
      throw error;
}
}

module.exports = { getAdv, getAll };