const Client = require('../../models/Client');



exports.getContactByDataFetch = async (req, res) => {
    try {
        const client = await Client.findOne({ isDeleted: false, phone: req.params.phone, serviceEnabled: true });
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.json(client);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getContactByFamilyDataFetch = async (req, res) => {
    try {
        const client = await Client.findOne({ isDeleted: false, phone: req.params.phone, serviceEnabled: true });
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }
        let Data = client.familyMembers.map(member => member.name);
        res.json(Data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};