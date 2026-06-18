import test from 'node:test';
import assert from 'node:assert/strict';

process.env.VERCEL = '1';
process.env.CLIENT_URL = 'incredible-begonia-18e502.netlify.app,https://travel-demo.netlify.app/';

const { default: app, normalizeOrigin } = await import('../server.js');

test('server app exports an Express app for Vercel', () => {
  assert.equal(typeof app, 'function');
  assert.equal(typeof app.use, 'function');
});

test('normalizeOrigin accepts domains with or without protocol', () => {
  assert.deepEqual(normalizeOrigin('https://example.netlify.app/'), ['https://example.netlify.app']);
  assert.deepEqual(normalizeOrigin('example.netlify.app'), [
    'https://example.netlify.app',
    'http://example.netlify.app',
  ]);
});
