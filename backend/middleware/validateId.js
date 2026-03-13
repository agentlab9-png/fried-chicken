const mongoose = require('mongoose');

const validateId = (paramName = 'id') => (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params[paramName])) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }
  next();
};

module.exports = validateId;
