const { Firestore } = require('@google-cloud/firestore');

const path = require('path');

const pathKey = path.resolve(__dirname, '../JSON/INI-PENTING.json');

async function storeData(id, data) {
    const db = new Firestore({
        projectId: process.env.projectId,
        keyFilename: pathKey,
    });

    const predictCollection = db.collection('predictions');
    return predictCollection.doc(id).set(data);
}

async function storeLink(id, data) {
    const db = new Firestore({
        projectId: process.env.projectId,
        keyFilename: pathKey,
    });

    const predictCollection = db.collection('reports');
    return predictCollection.doc(id).set(data);
}

module.exports = {storeData, storeLink};