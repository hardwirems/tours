import type { BlogPost } from '../../lib/blog';

// Registered blog posts. The publishing automation appends a new import + entry
// here; display order is by `published` date (see lib/blog.ts). Empty is a valid
// state — the index renders an empty-state until the first post ships.
import { post as bestTimeToVisit } from './best-time-to-visit-guanacaste';
import { post as rinconGuide } from './rincon-de-la-vieja-volcano-guide';
import { post as gettingAround } from './getting-around-guanacaste-transport';

import { post as tamarindoThingsToDo } from './tamarindo-things-to-do';
import { post as lirVsSjoAirportGuide } from './lir-vs-sjo-airport-guide';
export const POSTS: BlogPost[] = [
  lirVsSjoAirportGuide,
  tamarindoThingsToDo,
  bestTimeToVisit,
  rinconGuide,
  gettingAround,
];
