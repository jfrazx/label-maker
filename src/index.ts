import type { LabelMaker } from './interfaces';
import { Labeler } from './labeler';

const label = new Labeler();

export const labelMaker: LabelMaker = label.labeler;

labelMaker.toString = label.toString;

export type { LabelMaker, LabelOptions, LabelerOptions } from './interfaces';
