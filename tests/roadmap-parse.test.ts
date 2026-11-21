import { describe, expect, it } from 'vitest';
import { parseRoadmap } from '../src/lib/roadmap';

const SAMPLE = `# CTRL+Z roadmap

Some prose that must be ignored.

## Sections

- [x] **0. Self-update and tag-driven releases** - done, shipped in v1.2.0
- [x] **1. Safety checks before a wipe** - done, shipping in v1.3.0
- [ ] **2. AppData and settings backup and restore** - **next**
- [ ] **3. Portable app shortcuts and update tracking** - planned
`;

describe('parseRoadmap', () => {
  it('reads every section line in order', () => {
    const sections = parseRoadmap(SAMPLE);

    expect(sections.map((section) => section.number)).toEqual([0, 1, 2, 3]);
    expect(sections[0].title).toBe('Self-update and tag-driven releases');
    expect(sections[2].title).toBe('AppData and settings backup and restore');
  });

  it('maps checked lines to done and unchecked lines to planned', () => {
    const sections = parseRoadmap(SAMPLE);

    expect(sections[0].status).toBe('done');
    expect(sections[1].status).toBe('done');
    expect(sections[3].status).toBe('planned');
  });

  it('treats a "next" marker as in progress and removes the marker from the note', () => {
    const sections = parseRoadmap(SAMPLE);
    const next = sections[2];

    expect(next.status).toBe('in-progress');
    expect(next.note).toBe('');
  });

  it('keeps the trailing note verbatim', () => {
    const sections = parseRoadmap(SAMPLE);

    expect(sections[0].note).toBe('done, shipped in v1.2.0');
  });

  it('returns nothing for the old roadmap format, so the page can show an empty state', () => {
    const old = `# CTRL+Z roadmap

## Next

- General AppData/config settings backup/restore module (structured for later).
- Portable app shortcut creation and update tracking.
`;

    expect(parseRoadmap(old)).toEqual([]);
  });

  it('ignores malformed and unrelated lines', () => {
    const messy = `- [x] **not a number. Title**
- [x] **7. **
- [ ] plain markdown checkbox
- [x] **8. Real section** - done
`;

    const sections = parseRoadmap(messy);

    expect(sections).toHaveLength(1);
    expect(sections[0].number).toBe(8);
  });

  it('sorts out-of-order sections', () => {
    const shuffled = `- [ ] **5. Fifth** - planned
- [ ] **2. Second** - planned
- [x] **1. First** - done
`;

    expect(parseRoadmap(shuffled).map((section) => section.number)).toEqual([1, 2, 5]);
  });

  it('returns nothing for empty input', () => {
    expect(parseRoadmap('')).toEqual([]);
  });
});
