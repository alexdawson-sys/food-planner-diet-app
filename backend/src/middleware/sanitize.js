function sanitizeValue(value) {
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (value && typeof value === 'object') {
    return Object.entries(value).reduce((clean, [key, nestedValue]) => {
      if (key.startsWith('$') || key.includes('.')) {
        return clean;
      }
      clean[key] = sanitizeValue(nestedValue);
      return clean;
    }, {});
  }

  return value;
}

export function sanitizeRequest(req, _res, next) {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeValue(req.body);
  }

  if (req.params && typeof req.params === 'object') {
    req.params = sanitizeValue(req.params);
  }

  if (req.query && typeof req.query === 'object') {
    const sanitizedQuery = sanitizeValue(req.query);
    Object.keys(req.query).forEach((key) => {
      if (!(key in sanitizedQuery)) {
        delete req.query[key];
      }
    });
    Object.assign(req.query, sanitizedQuery);
  }

  next();
}
