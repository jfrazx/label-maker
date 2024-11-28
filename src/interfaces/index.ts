export type LabelOptions = string | LabelerOptions;

export interface LabelerOptions {
  /**
   * @description Delimiter to utilize between label segments.
   * @default '|'
   */
  delimiter?: string;

  /**
   * @description Delimiter to append after the last label.
   * @default ''
   */
  appendDelimiter?: string;

  /**
   * @description Boolean value indicating whether to include the delimiter after the last label.
   * @default false
   */
  includeFinalDelimiter?: boolean;

  /**
   * @description Boolean indicating whether empty segments should be included.
   * @todo Implement this option.
   * @default false
   */
  // includeEmptySegments?: boolean;

  /**
   * @description Boolean value indicating whether to include the delimiter before the first label.
   * @default false
   */
  includePrependedDelimiter?: boolean;

  /**
   * @description String to prepend before the first label.
   * @default ''
   */
  prependDelimiter?: string;
}

export interface Label extends Required<LabelerOptions> {
  /**
   * @description Label text.
   */
  label: string;
}

export interface LabelMethods {
  /**
   * Inserts a label after the specified position.
   */
  after(position: number, label: string, options?: LabelOptions): LabelMaker;

  /**
   * Inserts a label at the specified position.
   */
  at(position: number, label: string, options?: LabelOptions): LabelMaker;

  /**
   * Inserts a label before the specified position.
   */
  before(position: number, label: string, options?: LabelOptions): LabelMaker;

  /**
   * Clears all labels.
   */
  clear(): LabelMaker;

  /**
   * Gets the label at the specified position.
   */
  get(position: number): Label | undefined;

  /**
   * Gets all labels.
   */
  labels(): Label[];

  /**
   * Removes the label at the specified position.
   */
  remove(position: number): LabelMaker;

  /**
   * Replaces the label at the specified position.
   */
  replace(position: number, label: string, options?: LabelOptions): LabelMaker;
}

export interface LabelMaker extends Function, LabelMethods {
  (label: string, options?: LabelOptions): LabelMaker;
}
