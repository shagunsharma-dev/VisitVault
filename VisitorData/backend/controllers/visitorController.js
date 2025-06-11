const Visitor = require('../models/Visitor');

exports.createVisitor = async (req, res) => {
  try {
    console.log("Received data:", req.body);

    const { name, reason, photo, signature } = req.body;

    // Basic validation
    if (!name || !reason) {
      return res.status(400).json({ message: 'Name and reason are required.' });
    }

    // Optional: Warn if photo or signature are missing
    if (!photo) console.warn("Warning: Photo not received.");
    if (!signature) console.warn("Warning: Signature not received.");

    const newVisitor = new Visitor({ name, reason, photo, signature });
    await newVisitor.save();

    console.log("Visitor saved to DB.");
    res.status(201).json({ message: 'Visitor registered successfully' });
  } catch (error) {
    console.error("Error saving visitor:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
