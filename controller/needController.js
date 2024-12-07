const need = require("../models/need");

exports.getAllCases = async (req, res) => {
  try {
    const cases = await need.find();
    res.status(200).json(cases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCaseById = async (req, res) => {
  try {
    const { id } = req.params;
    const caseItem = await need.findById(id);
    if (!caseItem) {
      return res.status(500).send("case not found");
    }
    res.status(200).json(caseItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.updateCaseById = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCase = await Case.findByIdAndUpdate(id, req.body, {
      new: true, // Return the updated document
    });
    if (!updatedCase) {
      return res.status(500).send("Case not found");
    }
    res.send("done");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.deleteCaseById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCase = await Case.findByIdAndDelete(id);
    if (!deletedCase) {
      return res.status(500).send("Case not found");

      }
      res.send("done");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
