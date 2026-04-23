const express = require('express');
const promClient = require('prom-client');

const app = express();

// Create a Registry which registers the metrics
const register = new promClient.Registry();

// Add a default label which is added to all metrics
promClient.collectDefaultMetrics({
    app: 'monitoring-dashboard-api',
    prefix: 'node_',
    timeout: 10000,
    gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5],
    register
});

// Create a custom histogram metric
const httpRequestDurationMicroseconds = new promClient.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in microseconds',
    labelNames: ['method', 'route', 'code'],
    buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
});

// Register the histogram
register.registerMetric(httpRequestDurationMicroseconds);

// Middleware to track request duration
app.use((req, res, next) => {
    const end = httpRequestDurationMicroseconds.startTimer();
    res.on('finish', () => {
        end({ route: req.path, code: res.statusCode, method: req.method });
    });
    next();
});

// Example route
app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello World!' });
});

app.get('/api/slow', (req, res) => {
    setTimeout(() => {
        res.json({ message: 'This was a slow response!' });
    }, Math.random() * 2000);
});

app.get('/api/error', (req, res) => {
    res.status(500).json({ error: 'Internal Server Error' });
});

// Metrics endpoint
app.get('/metrics', async (req, res) => {
    try {
        res.set('Content-Type', register.contentType);
        res.end(await register.metrics());
    } catch (ex) {
        res.status(500).end(ex);
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Metrics are available at http://localhost:${PORT}/metrics`);
});