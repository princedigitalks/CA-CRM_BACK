const Client = require('../../models/Client');



exports.getContactByDataFetch = async (req, res) => {
    try {
        const client = await Client.findOne({ isDeleted: false, phone: req.params.phone, serviceEnabled: true });
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }
        let dataRecord = null;
        if (req.params.person === 'Self') {
            dataRecord = { name: client.name, documents: client.documents };
        } else {
            const person = client.familyMembers.find(member => member.name === req.params.person);
            dataRecord = person ? { name: person.name, documents: person.documents } : null;
        }
        let document = null;
        if (req.params.doc != 'ITR' && req.params.doc != 'Other') {
            let data = dataRecord.documents.find(doc => doc.category === req.params.doc);
            document = data ? data : null;
        } else {
            if (req.params.doc === 'ITR') {
                let data = dataRecord.documents.find(doc => doc.category === req.params.doc && doc.itrYear === req.query.year);
                document = data ? data : null;
            } else if (req.params.doc === 'Other') {
                let data = dataRecord.documents.find(doc => doc.category === req.params.doc && doc.subCategory === req.query.cat);
                document = data ? data : null;
            }
        }
        res.json({ subCategory: document.subCategory, category: document.category, filePath: process.env.backend_URL + document.filePath });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getContactByFamilyDataFetch = async (req, res) => {
    try {
        const client = await Client.findOne({ isDeleted: false, phone: req.params.phone });
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }
        let Data = client.familyMembers.map(member => member.name);
        res.json(['Self', ...Data]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};