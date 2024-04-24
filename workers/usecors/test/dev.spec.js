const { expect } = require('@jest/globals');
const { config } = require('../config');
const {
  urlHTML,
  streamURL,
  streamParams,
  requiredHeaders,
} = require('./test-data');

const dev = config.dev;

describe('dev tests', () => {
  test('dev get html test', async () => {
    const re = await fetch(`${dev.url}/${urlHTML}`, {
      headers: requiredHeaders,
    });
    const responseBody = await re.text();
    console.log('responseBody: ', responseBody);
    expect(responseBody).toContain('b-search__section_title');
  });

  test('dev get stream test', async () => {
    const re = await fetch(`${dev.url}/${streamURL}`, {
      method: 'POST',
      headers: {
        ...requiredHeaders,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(streamParams),
    });
    const responseBody = await re.json();
    console.log('responseBody: ', responseBody);
    expect(responseBody.success).toBe(true);
    expect(responseBody.url).toBeDefined();
    expect(responseBody.url.length).toBeGreaterThan(10);
  });
});
