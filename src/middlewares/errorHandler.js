export default function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Something went wrong';

  console.error(`Error occurred: ${message}, Status: ${status}`);

  res.status(status).json({
    status,
    message,
    data: null, 
  });
}