import { expect, it } from 'vitest';
import { PracticeClock } from './practiceTiming';
it('counts only after start, caps inactive time and resumes on activity', () => {
  const clock = new PracticeClock();
  expect(clock.sample(50_000)).toBe(0);
  clock.activity(50_000);
  expect(clock.sample(250_000)).toBe(120_000);
  clock.activity(300_000);
  expect(clock.sample(310_000)).toBe(130_000);
  clock.stop(310_000);
  expect(clock.sample(900_000)).toBe(130_000);
  clock.restore(42_000);
  clock.activity(1_000_000);
  expect(clock.sample(1_001_000)).toBe(43_000);
});
