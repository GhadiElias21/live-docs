import Document from "../models/Document.model.js";

export const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find().sort({ createdAt: -1 });
    res.json(documents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
export const getDocumentById = async (req, res) => {
  try {
    const { id } = req.params;

    let document = await Document.findById(id);

    if (!document) {
      document = await Document.create({
        _id: id,
        title: "Untitled Document",
        content: "",
      });
    }

    return res.status(200).json(document);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const createDocument = async (req, res) => {
  try {
    const { title, content } = req.body;
    const newDocument = new Document({ title, content });
    const savedDocument = await newDocument.save();
    return res.status(201).json(savedDocument);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
export const updateDocument = async (req, res) => {
  try {
    const { title, content } = req.body;

    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    // Update fields if provided
    if (title !== undefined) document.title = title;
    if (content !== undefined) document.content = content;

    const updatedDocument = await document.save();
    res.json(updatedDocument);
  } catch (error) {
    console.error(error);

    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid document ID" });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
export const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    await document.deleteOne();
    res.json({ message: "Document removed", id: req.params.id });
  } catch (error) {
    console.error(error);

    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid document ID" });
    }

    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
