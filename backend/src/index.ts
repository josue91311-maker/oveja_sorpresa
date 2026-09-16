import { app } from './app';

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🐑 Ovejita Sorpresas Backend API running on http://localhost:${PORT}`);
  console.log(`📁 Uploads available at http://localhost:${PORT}/uploads/`);
  console.log(`✨ Public API: http://localhost:${PORT}/api/products`);
});
