const fileValidatorMultiUse =
  (fieldName, allowedTypes, maxSize, required = true) =>
  (value, { req }) => {
    const fieldDisplayName =
      fieldName.charAt(0).toUpperCase() + fieldName.slice(1);

    let filesToValidate = [];

    if (req.files && req.files[fieldName]) {
      filesToValidate = req.files[fieldName];
    } else if (req.file && req.file.fieldname === fieldName) {
      filesToValidate = [req.file];
    }

    if (required && filesToValidate.length === 0) {
      throw new Error(`${fieldDisplayName} is required`);
    }

    if (!required && filesToValidate.length === 0) {
      return true;
    }

    const maxSizeMB = maxSize / (1024 * 1024);
    const typeNames = allowedTypes
      .map((type) => type.split("/")[1].toUpperCase())
      .join(", ");

    for (const file of filesToValidate) {
      const fileName = file.originalname || "a file";

      if (!allowedTypes.includes(file.mimetype)) {
        throw new Error(
          `${fieldDisplayName} error: File "${fileName}" has an invalid type. Only ${typeNames} are allowed.`
        );
      }

      if (file.size > maxSize) {
        throw new Error(
          `${fieldDisplayName} error: File "${fileName}" is too large. It must be less than ${maxSizeMB}MB.`
        );
      }
    }

    return true;
  };

export { fileValidatorMultiUse };
