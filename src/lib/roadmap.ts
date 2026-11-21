/**
 * Reads the roadmap that the app repository publishes and turns it into sections.
 *
 * The markdown is fetched once per build by `scripts/fetch-roadmap.mjs` and cached in
 * `src/data/roadmap.json`, so a failed fetch reuses the last good copy instead of failing the
 * build. Parsing lives here (not in the script) so it can be unit tested.
 */

import roadmapJson from '../data/roadmap.json';

export type RoadmapStatus = 'done' | 'in-progress' | 'planned';

export interface RoadmapSection {
  number: number;
  title: string;
  status: RoadmapStatus;
  /** Trailing note from the line, e.g. "shipped in v1.2.0". Empty when absent. */
  note: string;
}

export interface Roadmap {
  sections: RoadmapSection[];
  fetchedAt: string | null;
  /** True when the markdown came from the network during this build. */
  fromNetwork: boolean;
}

interface RoadmapCache {
  fetchedAt?: string | null;
  source?: string;
  markdown?: string;
}

const SECTION_LINE =
  /^-\s+\[(?<checked>[ xX])\]\s+\*\*(?<number>\d+)\.\s*(?<title>[^*]+?)\*\*\s*(?:[-–—]\s*(?<note>.*))?$/;

function statusFor(checked: boolean, note: string): RoadmapStatus {
  if (/\*\*next\*\*/i.test(note) || /\bnext\b/i.test(note)) return 'in-progress';
  if (checked) return 'done';
  return 'planned';
}

/** Strips the "**next**" emphasis marker so it can be rendered as a badge instead. */
function cleanNote(note: string): string {
  return note
    .replace(/\*\*next\*\*/gi, '')
    .replace(/^[\s,;:–—-]+|[\s,;:–—-]+$/g, '')
    .trim();
}

export function parseRoadmap(markdown: string): RoadmapSection[] {
  if (!markdown) return [];

  const sections: RoadmapSection[] = [];

  for (const line of markdown.split(/\r?\n/)) {
    const match = SECTION_LINE.exec(line.trim());
    if (!match?.groups) continue;

    const number = Number.parseInt(match.groups.number, 10);
    const title = match.groups.title.trim();
    if (!Number.isFinite(number) || !title) continue;

    const note = (match.groups.note ?? '').trim();
    sections.push({
      number,
      title,
      status: statusFor(match.groups.checked.toLowerCase() === 'x', note),
      note: cleanNote(note),
    });
  }

  // The source file lists sections in order, but sort defensively so a reordered list still reads
  // correctly on the page.
  sections.sort((a, b) => a.number - b.number);
  return sections;
}

const cache = roadmapJson as unknown as RoadmapCache;

export const roadmap: Roadmap = {
  sections: parseRoadmap(cache.markdown ?? ''),
  fetchedAt: cache.fetchedAt ?? null,
  fromNetwork: cache.source === 'github',
};

export const hasRoadmap = roadmap.sections.length > 0;

export const roadmapCounts = {
  done: roadmap.sections.filter((section) => section.status === 'done').length,
  inProgress: roadmap.sections.filter((section) => section.status === 'in-progress').length,
  planned: roadmap.sections.filter((section) => section.status === 'planned').length,
};

export const statusLabel: Record<RoadmapStatus, string> = {
  done: 'Done',
  'in-progress': 'In progress',
  planned: 'Planned',
};

export const roadmapSourceUrl = 'https://github.com/IAM-GROOT1/ctrlz/blob/main/ROADMAP.md';
