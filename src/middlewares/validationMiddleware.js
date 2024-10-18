const Joi = require("joi");

const userSchema = Joi.object({
  name: Joi.string().min(3).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name should have a minimum length of 3",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format",
    "string.empty": "Email is required",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
    "string.empty": "Password is required",
  }),
  identity_type: Joi.string().required().messages({
    "string.empty": "Identity type is required",
  }),
  identity_number: Joi.string().required().messages({
    "string.empty": "Identity number is required",
  }),
});

const accountSchema = Joi.object({
  user_id: Joi.number().required().messages({
    "number.base": "User ID must be a number",
    "any.required": "User ID is required",
  }),
  bank_name: Joi.string().required().messages({
    "string.empty": "Bank name is required",
  }),
  bank_account_number: Joi.string().min(5).required().messages({
    "string.empty": "Bank account number is required",
    "string.min": "Bank account number should have a minimum length of 5",
  }),
  balance: Joi.number().min(0).required().messages({
    "number.base": "Balance must be a number",
    "number.min": "Balance must be at least 0",
    "any.required": "Balance is required",
  }),
});

const transactionSchema = Joi.object({
  source_account_id: Joi.number().required().messages({
    "number.base": "Source account ID must be a number",
    "any.required": "Source account ID is required",
  }),
  destination_account_id: Joi.number().required().messages({
    "number.base": "Destination account ID must be a number",
    "any.required": "Destination account ID is required",
  }),
  amount: Joi.number().min(1).required().messages({
    "number.base": "Amount must be a number",
    "number.min": "Amount must be at least 1",
    "any.required": "Amount is required",
  }),
});

const depositwithdrawSchema = Joi.object({
  amount: Joi.number().positive().required(),
});

const validateDepositWithdraw = (req, res, next) => {
  const { error } = depositwithdrawSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errors = error.details.map((err) => ({
      message: err.message,
      path: err.path,
    }));
    return res.status(400).json({ errors });
  }
  next();
};

const validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map((err) => ({
      message: err.message,
      path: err.path,
    }));
    return res.status(400).json({ errors });
  }
  next();
};

const validateAccount = (req, res, next) => {
  const { error } = accountSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map((err) => ({
      message: err.message,
      path: err.path,
    }));
    return res.status(400).json({ errors });
  }
  next();
};

const validateTransaction = (req, res, next) => {
  const { error } = transactionSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map((err) => ({
      message: err.message,
      path: err.path,
    }));
    return res.status(400).json({ errors });
  }
  next();
};

module.exports = {
  validateUser,
  validateAccount,
  validateTransaction,
  validateDepositWithdraw,
};
