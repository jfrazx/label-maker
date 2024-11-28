import type { LabelMaker } from './interfaces';
import { Labeler } from './labeler';

export const labelMaker: LabelMaker = Labeler.create([]);
export type { LabelMaker, LabelOptions, LabelerOptions, Label } from './interfaces';
