// wrapping function for async handlers
export function wrap(fn) {
  return async function(req, res, next) {
    try {
      await fn(req, res, next);
    } catch(err) {
      next(err);
    }
  }
}
