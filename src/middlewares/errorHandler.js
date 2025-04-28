export default function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500; 
  const message = status === 500 ? 'Something went wrong' : err.message; // Якщо статус 500, повідомлення про помилку буде "Something went wrong"

    console.error(`Error occurred: ${err.message}, Status: ${status}`); // Виводимо повідомлення про помилку в консоль
    

 // Відправляємо відповідь клієнту
  res.status(status).json({
    status,
    message,
    data: err.message,
  });
}