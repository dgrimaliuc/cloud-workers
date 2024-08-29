function validateRequest(props) {
  const { req, payload, validations } = props;

  // Iterate over the validation functions
  for (const validation of validations) {
    // Call the validation function

    if (!runCatch(validation.action, req, payload)) {
      // If validation fails, send an error response and stop execution
      const exception = {
        message: payload.error ?? 'Something went wrong.',
        status: validation.status,
      };
      throw exception;
    }
  }
  return payload;
}

function runCatch(func, req, payload) {
  try {
    return func(req, payload);
  } catch (e) {
    console.error(e);
    return false;
  }
}

module.exports = {
  validateRequest,
};
