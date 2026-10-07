import assert from 'node:assert/strict';
import { findCandidates, poisson95, thresholdImage } from '../src/analysis.ts';
const width = 32, height = 24, data = new Uint8ClampedArray(width * height * 4);
for (let y = 8; y < 13; y++) for (let x = 10; x < 15; x++) {
  const i = (y * width + x) * 4; data[i] = 50; data[i + 1] = 220; data[i + 2] = 90; data[i + 3] = 255;
}
const image = { width, height, data };
const mask = thresholdImage(image, 'green');
const objects = findCandidates(image, mask, 5);
assert.equal(objects.length, 1);
assert.equal(objects[0].areaPx, 25);
assert.equal(findCandidates(image, mask, 1).length, 0);
assert.ok(Math.abs(poisson95(0)[1] - 3.6889) < 0.001);
assert.ok(poisson95(10)[0] < 10 && poisson95(10)[1] > 10);
