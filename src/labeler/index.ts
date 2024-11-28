import type { LabelerOptions, LabelOptions, LabelMaker, Label, LabelMethods } from '../interfaces';

const defaultDelimiter: string = '|';
const defaultIncludeFinalDelimiter: boolean = false;

export class Labeler implements LabelMethods {
  constructor(private readonly _labels: Label[]) {}

  /**
   * @description Creates a new label maker with the specified labels
   *
   * @static
   * @param {Label[]} labels
   * @returns {LabelMaker}
   * @memberof Labeler
   */
  static create(labels: Label[]): LabelMaker {
    const labelMaker = new Labeler(labels);
    const labeler = <LabelMaker>labelMaker.labeler.bind(labelMaker);

    labeler.toString = labelMaker.toString.bind(labelMaker);
    labeler.replace = labelMaker.replace.bind(labelMaker);
    labeler.before = labelMaker.before.bind(labelMaker);
    labeler.labels = labelMaker.labels.bind(labelMaker);
    labeler.remove = labelMaker.remove.bind(labelMaker);
    labeler.after = labelMaker.after.bind(labelMaker);
    labeler.clear = labelMaker.clear.bind(labelMaker);
    labeler.get = labelMaker.get.bind(labelMaker);
    labeler.at = labelMaker.at.bind(labelMaker);

    return labeler;
  }

  /**
   * @description Converts the labels into a string representation
   *
   * @returns {string} The string representation of the labels
   */
  toString(): string {
    return this._labels.reduce(
      (memo: string, { label, delimiter }: Label, position: number) =>
        `${memo}${label}${
          this.appendDelimiter(position) ? this.applyDelimiter(delimiter, position) : ''
        }`,
      this.prependedDelimiter,
    );
  }

  /**
   * @description Creates a new label at the end of the list
   *
   * @param label
   * @param options
   * @returns {LabelMaker} A new label maker with the new label
   */
  labeler(label: string, options: LabelOptions = {}): LabelMaker {
    return this.at(this._labels.length, label, options);
  }

  /**
   * @description Creates a new label after the specified position
   *
   * @param position
   * @param label
   * @param options
   * @returns {LabelMaker} A new label maker with the new label
   */
  after(position: number, label: string, options: LabelOptions = {}): LabelMaker {
    const actualPosition = this.actualPosition(position);
    return this.at(actualPosition + 1, label, options);
  }

  /**
   * @description Creates a new label at the specified position
   *
   * @param position
   * @param label
   * @param options
   * @returns {LabelMaker} A new label maker with the new label
   */
  at(position: number, label: string, options: LabelOptions = {}): LabelMaker {
    const opts: LabelerOptions = typeof options === 'string' ? { delimiter: options } : options;

    const actualPosition = this.actualPosition(position);
    const delimiter: string = this.getDelimiter(opts.delimiter, actualPosition - 1);

    const before = this._labels.slice(0, actualPosition);
    const after = this._labels.slice(actualPosition);

    const appendDelimiter = this.assignFinalDelimiter(opts.appendDelimiter, actualPosition - 1);
    const includeFinalDelimiter = this.includeLastDelimiterAt(
      opts.includeFinalDelimiter,
      opts.appendDelimiter,
      actualPosition - 1,
    );

    const prependDelimiter = this.assignPrependedDelimiter(opts.prependDelimiter, actualPosition - 1);
    const includePrependedDelimiter = this.getIncludePrependDelimiter(
      opts.includePrependedDelimiter,
      opts.prependDelimiter,
      actualPosition - 1,
    );

    const labels: Label[] = [...before];
    const newLabel: Label = {
      // includeEmptySegments: this.getIncludeEmptySegments(opts.includeEmptySegments, actualPosition - 1),
      includePrependedDelimiter,
      includeFinalDelimiter,
      prependDelimiter,
      appendDelimiter,
      delimiter,
      label,
    };

    labels[actualPosition] = newLabel;
    labels.push(...after);

    return Labeler.create(labels);
  }

  /**
   * @description Creates a new label before the specified position
   *
   * @param position
   * @param label
   * @param options
   * @returns {LabelMaker} A new label maker with the new label
   */
  before(position: number, label: string, options: LabelOptions = {}): LabelMaker {
    const actualPosition = this.actualPosition(position);
    return this.at(actualPosition - 1, label, options);
  }

  /**
   * @description Clears all labels from the label maker
   *
   * @returns {LabelMaker} A new label maker with no labels
   */
  clear(): LabelMaker {
    return Labeler.create([]);
  }

  /**
   * @description Retrieves the label at the specified position
   *
   * @param position
   * @returns {Label | undefined} The label at the specified position
   */
  get(position: number): Label | undefined {
    const actualPosition = this.actualPosition(position);
    return this._labels[actualPosition];
  }

  /**
   * @description Retrieves all labels in the label maker
   *
   * @returns {Label[]} All labels in the label maker
   */
  labels(): Label[] {
    return this._labels.map((label: Label) => ({ ...label }));
  }

  /**
   * @description Removes the label at the specified position
   *
   * @param position
   * @returns {LabelMaker} A new label maker with the label removed
   */
  remove(position: number): LabelMaker {
    const actualPosition = this.actualPosition(position);
    const before = this._labels.slice(0, actualPosition);
    const after = this._labels.slice(actualPosition + 1);

    return Labeler.create([...before, ...after]);
  }

  /**
   * @description Replaces the label at the specified position
   *
   * @param position
   * @param label
   * @param options
   * @returns {LabelMaker} A new label maker with the label replaced
   */
  replace(position: number, label: string, options: LabelOptions = {}): LabelMaker {
    const actualPosition = this.actualPosition(position);
    return this.remove(actualPosition).at(actualPosition, label, options);
  }

  /**
   * @description Evaluates the insertion position of the label in the list.
   *
   * Does not correct for the value being greater than the length of the list. This should allow for
   * position based label generation
   */
  private actualPosition(position: number): number {
    if (this._labels.length === 0) {
      return 0;
    }

    if (position >= 0) {
      return position;
    }

    return this.actualPosition(position + this._labels.length);
  }

  /**
   * @description Retrieves the delimiter to use for the label at the specified position.
   *
   * @param delimiter
   * @param position
   * @returns {string} The delimiter to use for the label
   */
  private getDelimiter(delimiter: string | undefined, position: number): string {
    return delimiter ?? this.get(position)?.delimiter ?? defaultDelimiter;
  }

  /**
   * @description Retrieves the final delimiter to use for the label at the specified position.
   *
   * @param delimiter
   * @param position
   * @returns {string} The final delimiter to use for the label
   */
  private assignFinalDelimiter(delimiter: string | undefined, position: number): string {
    return delimiter ?? this.get(position)?.appendDelimiter ?? '';
  }

  /**
   * @description Retrieves the delimiter to use for the label at the specified position.
   *
   * @param delimiter
   * @param position
   * @returns {string} The delimiter to use for the label
   */
  private assignPrependedDelimiter(delimiter: string | undefined, position: number): string {
    return delimiter ?? this.get(position)?.prependDelimiter ?? '';
  }

  /**
   * @description Determines whether to include the final delimiter for the label at the specified position.
   *
   * @param include
   * @param appendDelimiter
   * @param position
   * @returns {boolean}
   */
  private includeLastDelimiterAt(
    include: boolean | undefined,
    appendDelimiter: string | undefined,
    position: number,
  ): boolean {
    return (
      include ??
      ((typeof appendDelimiter === 'string' && appendDelimiter !== '') ||
        this.get(position)?.includeFinalDelimiter) ??
      defaultIncludeFinalDelimiter
    );
  }

  private getIncludePrependDelimiter(
    prepend: boolean | undefined,
    prependDelimiter: string | undefined,
    position: number,
  ): boolean {
    return (
      prepend ??
      ((typeof prependDelimiter === 'string' && prependDelimiter !== '') ||
        this.shouldPrependDelimiter(position))
    );
  }

  /**
   * @todo Not yet implemented
   */
  // private getIncludeEmptySegments(include: boolean | undefined, position: number): boolean {
  //   return include ?? this.get(position)?.includeEmptySegments ?? false;
  // }

  /**
   * @description The delimiter to prepend before the first label.
   *
   * @readonly
   * @private
   * @type {string}
   * @memberof Labeler
   */
  private get prependedDelimiter(): string {
    const label = this.get(this._labels.length - 1);
    return label?.includePrependedDelimiter ? label.prependDelimiter || label.delimiter : '';
  }

  private shouldPrependDelimiter(position: number): boolean {
    return this.get(position)?.includePrependedDelimiter ?? false;
  }

  private get lastIncludeFinalDelimiter(): boolean | undefined {
    return this.get(this._labels.length - 1)!.includeFinalDelimiter;
  }

  private applyDelimiter(delimiter: string, position: number): string {
    return position === this._labels.length - 1
      ? this.getFinalDelimiter(delimiter, position)
      : delimiter;
  }

  private getFinalDelimiter(delimiter: string, position: number): string {
    return this.get(position)!.appendDelimiter || delimiter;
  }

  private appendDelimiter(position: number): boolean | undefined {
    return position < this._labels.length - 1 || this.lastIncludeFinalDelimiter;
  }
}
