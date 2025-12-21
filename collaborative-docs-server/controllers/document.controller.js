import Document from "../models/Document.model.js";

export const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find({
      $or: [{ owner: req.user.id }, { "sharedWith.user": req.user.id }],
    })
      .populate("owner", "username email")
      .populate("sharedWith.user", "username email")
      .sort({ createdAt: -1 });

    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDocumentById = async (req, res) => {
  try {
    const { id } = req.params;

    let document = await Document.findOne({
      _id: id,
      $or: [{ owner: req.user.id }, { "sharedWith.user": req.user.id }],
    })
      .populate("owner", "username email")
      .populate("sharedWith.user", "username email");

    if (!document) {
      const newDoc = await Document.create({
        title: "Untitled Document",
        content: "",
        owner: req.user.id,
      });

      // Populate after creation
      document = await Document.findById(newDoc._id)
        .populate("owner", "username email")
        .populate("sharedWith.user", "username email");
    }

    res.status(200).json(document);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const createDocument = async (req, res) => {
  try {
    const { title, content } = req.body;

    const newDocument = new Document({
      title,
      content,
      owner: req.user.id,
    });
    console.log("REQ.USER:", req.user);

    const savedDocument = await newDocument.save();
    res.status(201).json(savedDocument);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateDocument = async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.id;

    const document = await Document.findOne({
      _id: req.params.id,
      $or: [
        { owner: userId },
        { sharedWith: { $elemMatch: { user: userId, role: "editor" } } },
      ],
    });

    if (!document) {
      return res
        .status(404)
        .json({ message: "Document not found or you don’t have permission" });
    }

    if (title !== undefined) document.title = title;
    if (content !== undefined) document.content = content;

    const updatedDocument = await document.save();
    res.json(updatedDocument);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      owner: req.user.id,
    });

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    await document.deleteOne();
    res.json({ message: "Document removed", id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const shareDocument = async (req, res) => {
  try {
    const { documentId, userId, role } = req.body;

    const document = await Document.findOne({
      _id: documentId,
      owner: req.user.id,
    });

    if (!document)
      return res.status(404).json({ message: "Document not found" });

    const alreadyShared = document.sharedWith.some(
      (entry) => entry.user.toString() === userId
    );
    if (alreadyShared) {
      return res.status(400).json({ message: "User already has access" });
    }

    document.sharedWith.push({ user: userId, role: role || "editor" });
    await document.save();

    res.status(200).json({ message: "Document shared successfully", document });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
