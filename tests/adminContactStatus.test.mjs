import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildAdminContactStatusPayload,
  parseAdminContactStatusUpdate,
} from '../lib/adminContactStatus.mjs';

test('accepts a valid answered=true update and trims the id', () => {
  assert.deepEqual(
    parseAdminContactStatusUpdate({
      id: '  message-123  ',
      answeared: true,
    }),
    {
      ok: true,
      value: {
        id: 'message-123',
        answeared: true,
      },
    }
  );
});

test('accepts answered=false instead of treating false as missing', () => {
  const result = parseAdminContactStatusUpdate({
    id: 'message-123',
    answeared: false,
  });

  assert.deepEqual(result, {
    ok: true,
    value: {
      id: 'message-123',
      answeared: false,
    },
  });
});

test('rejects missing id or non-boolean answered state', () => {
  assert.deepEqual(
    parseAdminContactStatusUpdate({ id: '', answeared: true }),
    { ok: false }
  );
  assert.deepEqual(
    parseAdminContactStatusUpdate({ id: 'message-123', answeared: 'true' }),
    { ok: false }
  );
  assert.deepEqual(parseAdminContactStatusUpdate(null), { ok: false });
});

test('builds the exact DatoCMS update payload for answered state', () => {
  assert.deepEqual(
    buildAdminContactStatusPayload('message-123', true),
    {
      data: {
        id: 'message-123',
        type: 'item',
        attributes: {
          answeared: true,
        },
      },
    }
  );
});
