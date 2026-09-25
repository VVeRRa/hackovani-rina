import test from 'node:test';
import assert from 'node:assert/strict';

import {
  extractDatoNumber,
  extractDatoString,
} from '../lib/datoValueUtils.mjs';

test('extractDatoString trims plain strings', () => {
  assert.equal(extractDatoString('  Kabelka  '), 'Kabelka');
  assert.equal(extractDatoString('   '), undefined);
});

test('extractDatoString converts primitive numbers and booleans', () => {
  assert.equal(extractDatoString(42), '42');
  assert.equal(extractDatoString(false), 'false');
});

test('extractDatoString prefers Czech localized content, then English and German', () => {
  assert.equal(
    extractDatoString({ cs: 'Červená', en: 'Red', de: 'Rot' }),
    'Červená'
  );
  assert.equal(
    extractDatoString({ cs: '', en: 'Red', de: 'Rot' }),
    'Red'
  );
});

test('extractDatoString handles nested localized objects', () => {
  assert.equal(
    extractDatoString({
      cs: {
        cs: 'Vnořená hodnota',
      },
    }),
    'Vnořená hodnota'
  );
});

test('extractDatoString reads structured text documents', () => {
  assert.equal(
    extractDatoString({
      document: {
        children: [
          {
            children: [
              { value: 'První' },
              { value: 'část' },
            ],
          },
          {
            children: [{ value: 'Druhá' }],
          },
        ],
      },
    }),
    'První část Druhá'
  );
});

test('extractDatoString reads structured text nested under value', () => {
  assert.equal(
    extractDatoString({
      value: {
        document: {
          children: [
            {
              children: [{ value: 'Text z value' }],
            },
          ],
        },
      },
    }),
    'Text z value'
  );
});

test('extractDatoString safely ignores unsupported values', () => {
  assert.equal(extractDatoString(null), undefined);
  assert.equal(extractDatoString(undefined), undefined);
  assert.equal(extractDatoString(['not', 'supported']), undefined);
});

test('extractDatoNumber accepts numbers and numeric strings', () => {
  assert.equal(extractDatoNumber(1490), 1490);
  assert.equal(extractDatoNumber('1490.50 Kč'), 1490.5);
});

test('extractDatoNumber reads localized numeric values', () => {
  assert.equal(
    extractDatoNumber({ cs: '890', en: '900' }),
    890
  );
  assert.equal(
    extractDatoNumber({ cs: null, en: 1200 }),
    1200
  );
});

test('extractDatoNumber rejects invalid or unsupported values', () => {
  assert.equal(extractDatoNumber('not-a-number'), undefined);
  assert.equal(extractDatoNumber(Number.NaN), undefined);
  assert.equal(extractDatoNumber(false), undefined);
  assert.equal(extractDatoNumber({ cs: false }), undefined);
});
