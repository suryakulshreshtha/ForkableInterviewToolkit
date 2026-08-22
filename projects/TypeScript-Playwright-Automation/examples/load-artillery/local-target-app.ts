/**
 * A tiny local Express app -- the ONLY thing this repo ever load-tests.
 *
 * Load testing a third-party site you don't own is abusive and can get you (and
 * everyone else) IP-banned. So the load-test target ships with the repo.
 *
 *     npm run load:target        # -> http://localhost:3000
 */
import express from 'express';

const app = express();
app.use(express.json());

const PRODUCTS = [
  { id: 1, name: 'Forkable Mug', price: 12 },
  { id: 2, name: 'SDET Hoodie', price: 45 },
  { id: 3, name: 'Playwright Stickers', price: 5 },
];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const jitter = (min: number, max: number) => min + Math.random() * (max - min);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/products/:id', async (req, res) => {
  // Simulated latency so the Artillery charts aren't a flat line.
  await sleep(jitter(10, 50));

  const product = PRODUCTS.find((p) => p.id === Number(req.params.id));
  if (!product) {
    res.status(404).json({ error: 'not found' });
    return;
  }
  res.json(product);
});

app.post('/checkout', async (req, res) => {
  if (!req.body || req.body.product_id === undefined) {
    res.status(400).json({ error: 'product_id required' });
    return;
  }
  await sleep(jitter(50, 150));
  res.status(201).json({
    order_id: Math.floor(1000 + Math.random() * 9000),
    status: 'confirmed',
  });
});

const PORT = Number(process.env.PORT ?? 3000);
app.listen(PORT, () => {
  console.log(`[target] listening on http://localhost:${PORT}`);
});
