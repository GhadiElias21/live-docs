import { Router } from "express";
import {
  getDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
  shareDocument,
  removeDocumentAccess,
  updateDocumentAccess,
} from "../controllers/document.controller.js";
import { authenticateToken } from "../middlewares/auth.js";

const router = Router();

router.use(authenticateToken);

router.get("/", getDocuments);

router.get("/:id", getDocumentById);

router.post("/share", shareDocument);

router.post("/", createDocument);

router.put("/:id", updateDocument);

router.delete("/:id", deleteDocument);

router.delete("/:documentId/access/:userId", removeDocumentAccess);

router.put("/:documentId/access/:userId", updateDocumentAccess);

export default router;
