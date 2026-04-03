const Client = require('../models/Client');
const { getUploadedPath, deleteFile } = require('../utils/fileHelper');

exports.getAllClients = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const search = req.query.search || '';
    const paymentStatus = req.query.paymentStatus || '';
    const serviceEnabled = req.query.serviceEnabled;

    const filter = {
      isDeleted: false // Only show non-deleted clients
    };

    // Search filter (name, email, phone)
    if (search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { name: regex },
        { email: regex },
        { phone: regex },
      ];
    }

    // Payment status filter
    if (paymentStatus && paymentStatus !== 'ALL') {
      filter.paymentStatus = paymentStatus;
    }

    // Service enabled filter
    if (serviceEnabled !== undefined && serviceEnabled !== '' && serviceEnabled !== 'ALL') {
      filter.serviceEnabled = serviceEnabled === 'true' || serviceEnabled === 'ON';
    }

    const totalItems = await Client.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / limit) || 1;
    const skip = (page - 1) * limit;

    const clients = await Client.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      clients,
      totalItems,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllClientsData = async (req, res) => {
  try {
   

    const clients = await Client.find()

    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.json(client);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getClientByIdData = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    
    res.json(client);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.createClient = async (req, res) => {
  try {
    const { name, email, phone, paymentStatus, serviceEnabled } = req.body;
    const client = new Client({
      name,
      email,
      phone,
      paymentStatus: paymentStatus || 'PENDING',
      serviceEnabled: serviceEnabled !== undefined ? serviceEnabled : true,
      createdAt: new Date().toISOString().slice(0, 10),
      documents: [],
      familyMembers: [],
    });
    await client.save();
    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateClient = async (req, res) => {
  try {
    const { name, email, phone, paymentStatus, serviceEnabled } = req.body;
    const client = await Client.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, paymentStatus, serviceEnabled },
      { new: true, runValidators: true }
    );
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.json(client);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Soft delete
    client.isDeleted = true;
    client.deletedAt = new Date();
    await client.save();

    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addFamilyMember = async (req, res) => {
  try {
    const { name, relation, phone, email } = req.body;
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    client.familyMembers.push({
      name,
      relation,
      phone,
      email,
      documents: [],
    });
    await client.save();
    res.json(client);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteFamilyMember = async (req, res) => {
  try {
    const { memberId } = req.params;
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    client.familyMembers = client.familyMembers.filter(m => m._id.toString() !== memberId);
    await client.save();
    res.json(client);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addDocument = async (req, res) => {
  try {
    const { name, type, size, category, itrYear, memberId, filePath } = req.body;
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    const doc = {
      name,
      type,
      size,
      uploadedAt: new Date().toISOString().slice(0, 10),
      category,
      itrYear,
      ...(filePath && { filePath }),
    };
    if (memberId) {
      const member = client.familyMembers.find(m => m._id.toString() === memberId);
      if (member) {
        member.documents.push(doc);
      } else {
        return res.status(404).json({ message: 'Family member not found' });
      }
    } else {
      client.documents.push(doc);
    }
    await client.save();
    res.json(client);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    const { docId, memberId } = req.params;
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    let docToDelete = null;
    if (memberId) {
      const member = client.familyMembers.find(m => m._id.toString() === memberId);
      if (member) {
        docToDelete = member.documents.find(d => d._id.toString() === docId);
        member.documents = member.documents.filter(d => d._id.toString() !== docId);
      }
    } else {
      docToDelete = client.documents.find(d => d._id.toString() === docId);
      client.documents = client.documents.filter(d => d._id.toString() !== docId);
    }

    if (docToDelete && docToDelete.filePath) {
      deleteFile(docToDelete.filePath);
    }

    await client.save();
    res.json(client);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.uploadDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, itrYear, memberId } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const client = await Client.findById(id);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    const doc = {
      name: name || req.file.originalname,
      type: req.file.mimetype.includes('pdf') ? 'PDF' :
        req.file.mimetype.includes('image') ? 'Image' :
          req.file.mimetype.includes('word') ? 'Word' :
            req.file.mimetype.includes('excel') ? 'Excel' : 'Other',
      size: (req.file.size / (1024 * 1024)).toFixed(2) + ' MB',
      uploadedAt: new Date().toISOString().slice(0, 10),
      category,
      itrYear,
      filePath: getUploadedPath(req.file.filename),
    };

    if (memberId) {
      const member = client.familyMembers.find(m => m._id.toString() === memberId);
      if (member) {
        member.documents.push(doc);
      } else {
        return res.status(404).json({ message: 'Family member not found' });
      }
    } else {
      client.documents.push(doc);
    }
    await client.save();
    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Search clients
 * @route   GET /api/clients/search
 * @access  Private
 */
exports.searchClients = async (req, res) => {
  try {
    const query = req.query.q || '';
    const limit = parseInt(req.query.limit) || 10;

    if (!query.trim()) {
      return res.json([]);
    }

    const filter = {
      isDeleted: false, // Only search non-deleted clients
      $or: [
        { name: new RegExp(query.trim(), 'i') },
        { phone: new RegExp(query.trim(), 'i') },
        { email: new RegExp(query.trim(), 'i') },
      ]
    };

    const clients = await Client.find(filter)
      .select('name phone email paymentStatus')
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateDocument = async (req, res) => {
  try {
    const { docId, memberId } = req.params;
    const { name, category, itrYear } = req.body;

    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    let doc = null;
    if (memberId) {
      const member = client.familyMembers.find(m => m._id.toString() === memberId);
      if (member) {
        doc = member.documents.find(d => d._id.toString() === docId);
      }
    } else {
      doc = client.documents.find(d => d._id.toString() === docId);
    }

    if (doc) {
      const oldFilePath = doc.filePath;
      if (req.file) {
        if (oldFilePath) {
          deleteFile(oldFilePath);
        }
        doc.name = name || req.file.originalname;
        doc.type = req.file.mimetype.includes('pdf') ? 'PDF' :
          req.file.mimetype.includes('image') ? 'Image' :
            req.file.mimetype.includes('word') ? 'Word' :
              req.file.mimetype.includes('excel') ? 'Excel' : 'Other';
        doc.size = (req.file.size / (1024 * 1024)).toFixed(2) + ' MB';
        doc.filePath = getUploadedPath(req.file.filename);
      }
      if (name) doc.name = name;
      if (category) doc.category = category;
      if (itrYear) doc.itrYear = itrYear;
    }

    await client.save();
    res.json(client);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};