import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ✅ Load environment variables safely
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ ERROR: Supabase URL or Key is missing! Check environment variables.");
  process.exit(1); // Stop the server if env variables are missing
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ✅ Test API
app.get("/", (req, res) => {
  res.send("✅ Service is Running!");
});

// ✅ Get all stocks
app.get("/api/stocks", async (req, res) => {
  const { data, error } = await supabase.from("stocks").select("*");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// ✅ Add stock entry
app.post("/api/stocks", async (req, res) => {
  const { stock_name, quantity, date } = req.body;
  if (!stock_name || !quantity || !date) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const { data, error } = await supabase.from("stocks").insert([{ stock_name, quantity, date }]);
  if (error) return res.status(500).json({ error: error.message });

  res.json({ message: "Stock added successfully", data });
});

// ✅ Update stock quantity (Addition/Reduction)
app.put("/api/stocks/:id", async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  if (!quantity) return res.status(400).json({ error: "Quantity is required" });

  const { data, error } = await supabase
    .from("stocks")
    .update({ quantity })
    .eq("id", id);

  if (error) return res.status(500).json({ error: error.message });

  res.json({ message: "Stock updated successfully", data });
});

// ✅ Delete a stock entry
app.delete("/api/stocks/:id", async (req, res) => {
  const { id } = req.params;
  
  const { error } = await supabase.from("stocks").delete().eq("id", id);
  if (error) return res.status(500).json({ error: error.message });

  res.json({ message: "Stock deleted successfully" });
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
