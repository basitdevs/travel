import test from 'node:test';
import assert from 'node:assert/strict';
import { getApiBaseURL } from './api.js';

test('getApiBaseURL uses /api for local relative requests', () => {
  assert.equal(getApiBaseURL(''), '/api');
});

test('getApiBaseURL appends /api to deployed backend URL', () => {
  assert.equal(
    getApiBaseURL('https://travel-coral-iota.vercel.app'),
    'https://travel-coral-iota.vercel.app/api'
  );
});

test('getApiBaseURL does not duplicate /api', () => {
  assert.equal(
    getApiBaseURL('https://travel-coral-iota.vercel.app/api/'),
    'https://travel-coral-iota.vercel.app/api'
  );
});
