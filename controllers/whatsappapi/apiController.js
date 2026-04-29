const Client = require("../../models/Client");

exports.getContactByDataFetch = async (req, res) => {
  try {
    
    const client = await Client.findOne({
      isDeleted: false,
      phone: req.params.phone,
      serviceEnabled: true,
    });
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    let Data = client.familyMembers.map((member, index) => ({
      id: index + 2,
      name: member.name,
    }));
    
    Data = [{ id: 1, name: "Self" }, ...Data]
    let personName = Data.find((member) => member.id == req.params.person);
    console.log(personName.name);

    let dataRecord = null;
    if (personName.name === "Self") {
      dataRecord = { name: client.name, documents: client.documents };
    } else {
      const person = client.familyMembers.find(
        (member) => member.name === personName.name,
      );
      dataRecord = person
        ? { name: person.name, documents: person.documents }
        : null;
    }
    let document = null;

    if (!req.params.doc.includes("ITR") && !req.params.doc.includes("Other")) {
      console.log(req.params.doc);
      let data = dataRecord.documents.find(
        (doc) => doc.category === req.params.doc,
      );
      document = data ? data : null;
    } else {
      if (req.params.doc.includes("ITR")) {
        let data = dataRecord.documents.find(
          (doc) =>
            doc.category === req.params.doc.split(" = ")[0] &&
            doc.itrYear === req.params.doc.split(" = ")[1],
        );
        document = data ? data : null;
      } else if (req.params.doc.includes("Other")) {
        let data = dataRecord.documents.find(
          (doc) =>
            doc.category === req.params.doc.split(" = ")[0] &&
            doc.subCategory === req.params.doc.split(" = ")[1],
        );
        document = data ? data : null;
      }
    }
    res.json({
      subCategory: document.subCategory,
      category: document.category,
      filePath: process.env.backend_URL + document.filePath,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getContactByFamilyDataFetch = async (req, res) => {
  try {
    const client = await Client.findOne({
      isDeleted: false,
      phone: req.params.phone,
    });
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    let Data = client.familyMembers.map((member, index) => ({
      id: index + 2,
      name: member.name,
    }));
    res.json({ members: [{ id: 1, name: "Self" }, ...Data] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.getDocByDataFetch = async (req, res) => {
  try {
    const client = await Client.findOne({
      isDeleted: false,
      phone: req.params.phone,
    });
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    let Data = client.familyMembers.map((member, index) => ({
      id: index + 2,
      name: member.name,
    }));

    Data = [{ id: 1, name: "Self" }, ...Data]
    if (Data.length < req.params.person) {
      return res.status(404).json({ message: "Person not found" });
    }
    let person = Data.find((member) => member.id == req.params.person);


    let doc = {};
    if (person.name === "Self") {
      doc = client.documents.map((d, i) => {
        return {
          id: i,
          category:
            d.category === "ITR"
              ? `${d.category} = ${d.itrYear}`
              : d.category === "Other"
                ? `${d.category} = ${d.subCategory}`
                : d.category,
        };
      });
    } else {
      doc = client.familyMembers
        .find((member) => member.name === person.name)
        .documents.map((d, i) => {
          return {
            id: i,
            category:
              d.category === "ITR"
                ? `${d.category} = ${d.itrYear}`
                : d.category === "Other"
                  ? `${d.category} = ${d.subCategory}`
                  : d.category,
          };
        });
    }
    res.json({ categories: doc });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
