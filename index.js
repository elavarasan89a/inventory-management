const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Supabase Client Setup
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Default Route
app.get("/", (req, res) => {
  res.send("✅ Service is running!");
});

// Fetch All Stocks
app.get("/api/stocks", async (req, res) => {
  try {
    const { data, error } = await supabase.from("stocks").select("*");
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Add New Stock Entry
app.post("/api/stocks", async (req, res) => {
  try {
    const { name, quantity, price, threshold } = req.body;
    const { data, error } = await supabase
      .from("stocks")
      .insert([{ name, quantity, price, threshold }]);

    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Update Stock Quantity
app.put("/api/stocks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const { data, error } = await supabase
      .from("stocks")
      .update({ quantity })
      .match({ id });

    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Delete a Stock Item
app.delete("/api/stocks/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("stocks")
      .delete()
      .match({ id });

    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json({ message: "Stock item deleted successfully", data });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Start the Server
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
