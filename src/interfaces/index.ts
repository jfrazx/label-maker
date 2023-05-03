export type LabelOptions = string | LabelerOptions;

export interface LabelerOptions {
  delimiter?: string;
  includeFinalDelimiter?: boolean;
}

export interface Label extends Required<LabelerOptions> {
  label: string;
}

export type LabelMaker = (label: string, options?: LabelOptions) => LabelMaker;
