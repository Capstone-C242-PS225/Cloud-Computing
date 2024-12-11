const { Firestore } = require('@google-cloud/firestore');

const path = require('path');

const pathKey = path.resolve(__dirname, '../credential-example.json');

async function storeData(id, data) {
    const db = new Firestore({
        projectId: 'apalahartiprojectid',
        keyFilename: pathKey,
    });

    const predictCollection = db.collection('predictions');
    return predictCollection.doc(id).set(data);
}

module.exports = storeData;