const Client = require("../../models/Client");

exports.getSection = async (req, res) => {
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

    let WholeMembers = [{ id: 1, name: client.name }, ...Data];

    const sectionSize = 10;
    const totalSections = Math.ceil(WholeMembers.length / sectionSize);

    const sections = Array.from({ length: totalSections }, (_, i) => ({
      id: i + 1,
      name: `memberlist${i + 1}`,
    }));

    const sectionWithMembers = sections.map((section, index) => ({
      ...section,
      // members: WholeMembers.slice(
      //   index * sectionSize,
      //   index * sectionSize + sectionSize
      // ),
    }));
    res.json({ sections: sectionWithMembers });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getSectiontoMemberId = async (req, res) => {
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

    let WholeMembers = [{ id: 1, name: client.name }, ...Data];

    const sectionSize = 10;
    const totalSections = Math.ceil(WholeMembers.length / sectionSize);

    const sections = Array.from({ length: totalSections }, (_, i) => ({
      id: i + 1,
      name: `memberlist${i + 1}`,
    }));

    const sectionWithMembers = sections.map((section, index) => ({
      ...section,
      members: WholeMembers.slice(
        index * sectionSize,
        index * sectionSize + sectionSize
      ),
    }));
    let findSection = sectionWithMembers.find(
      (section) => section.name == req.params.sectionId
    );
    res.json({ members: findSection.members });

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
    console.log(client.documents);
    let doc = {};
    if (req.params.person === client.name) {
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
        .find((member) => member.name === req.params.person)
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
    console.log(client);

    let dataRecord = null;
    if (req.params.person === client.name) {
      dataRecord = { name: client.name, documents: client.documents };
    } else {
      const person = client.familyMembers.find(
        (member) => member.name === req.params.person,
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
