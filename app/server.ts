import 'dotenv/config';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import jsonServer from 'json-server';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, 'db.json');

const server = jsonServer.create();
const router = jsonServer.router(DB_PATH);
const middlewares = jsonServer.defaults({ logger: true });

const TRIM_COLLECTIONS = ['contacts'];
const MAX_RECORDS = 50;

server.use(middlewares);
server.use(jsonServer.bodyParser);
server.use(
  jsonServer.rewriter({
    '/api/:resource/:id': '/:resource/:id',
    '/api/:resource': '/:resource',
  })
);

server.use((req, res, next) => {
  const collection = req.path.slice(1);
  if (req.method === 'POST' && TRIM_COLLECTIONS.includes(collection)) {
    res.on('finish', () => {
      if (res.statusCode === 201) {
        const db = router.db;
        const items = db.get(collection).sortBy('id').value() as Array<{
          id: number;
        }>;
        if (items.length > MAX_RECORDS) {
          const toDelete = items.slice(0, items.length - MAX_RECORDS);
          toDelete.forEach((item) => {
            db.get(collection).remove({ id: item.id }).write();
          });
        }
      }
    });
  }
  next();
});

server.use(router);

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

server.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
