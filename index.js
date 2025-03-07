import express from "express";
import cors from "cors";
import db from "./firebase.js";  // ✅ Correct import
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// 📌 API Route to Get All Stock Items
app.get("/api/stocks", async (req, res) => {
  try {
    const stocksCollection = collection(db, "stocks");
    const stocksSnapshot = await getDocs(stocksCollection);
    const stocksList = stocksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(stocksList);
  } catch (error) {
    console.error("Error fetching stocks:", error);
    res.status(500).json({ error: "Failed to fetch stocks" });
  }
});

// 📌 API Route to Add a New Stock Item
app.post("/api/stocks", async (req, res) => {
  try {
    const { name, quantity, price, threshold } = req.body;
    const stocksCollection = collection(db, "stocks");
    await addDoc(stocksCollection, { name, quantity, price, threshold });
    res.status(201).json({ message: "Stock item added successfully" });
  } catch (error) {
    console.error("Error adding stock:", error);
    res.status(500).json({ error: "Failed to add stock item" });
  }
});

// 📌 API Route to Update Stock Quantity
app.put("/api/stocks/:id", async (req, res) => {
  try {
    const stockId = req.params.id;
    const { quantity, price, threshold } = req.body;
    const stockDoc = doc(db, "stocks", stockId);
    await updateDoc(stockDoc, { quantity, price, threshold });
    res.json({ message: "Stock item updated successfully" });
  } catch (error) {
    console.error("Error updating stock:", error);
    res.status(500).json({ error: "Failed to update stock item" });
  }
});

// 📌 API Route to Delete a Stock Item
app.delete("/api/stocks/:id", async (req, res) => {
  try {
    const stockId = req.params.id;
    const stockDoc = doc(db, "stocks", stockId);
    await deleteDoc(stockDoc);
    res.json({ message: "Stock item deleted successfully" });
  } catch (error) {
    console.error("Error deleting stock:", error);
    res.status(500).json({ error: "Failed to delete stock item" });
  }
});

// 📌 API Route to Get Stock Usage Between Two Dates
app.get("/api/stock-usage", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: "Please provide startDate and endDate" });
    }

    const stocksCollection = collection(db, "stocks");
    const stocksQuery = query(stocksCollection, where("date", ">=", startDate), where("date", "<=", endDate));
    const stocksSnapshot = await getDocs(stocksQuery);
    
    const usageList = stocksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(usageList);
  } catch (error) {
    console.error("Error fetching stock usage:", error);
    res.status(500).json({ error: "Failed to fetch stock usage data" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
