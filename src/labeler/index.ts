import type { LabelerOptions, LabelOptions, LabelMaker, Label, LabelMethods } from '../interfaces';

const defaultDelimiter: string = '|';
const defaultIncludeFinalDelimiter: boolean = false;

export class Labeler implements LabelMethods {
  constructor(private readonly _labels: Label[]) {}

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

  toString(): string {
    return this._labels.reduce(
      (memo: string, { label, delimiter }: Label, position: number) =>
        `${memo}${label}${
          this.appendDelimiter(position) ? this.applyDelimiter(delimiter, position) : ''
        }`,
      this.prependedDelimiter,
    );
  }

  labeler(label: string, options: LabelOptions = {}): LabelMaker {
    return this.at(this._labels.length, label, options);
  }

  after(position: number, label: string, options: LabelOptions = {}): LabelMaker {
    const insertPosition = this.insertionPosition(position);
    return this.at(insertPosition + 1, label, options);
  }

  at(position: number, label: string, options: LabelOptions = {}): LabelMaker {
    const opts: LabelerOptions = typeof options === 'string' ? { delimiter: options } : options;

    const insertPosition = this.insertionPosition(position);
    const delimiter: string = this.getDelimiter(opts.delimiter, insertPosition - 1);

    const before = this._labels.slice(0, insertPosition);
    const after = this._labels.slice(insertPosition);

    const appendDelimiter = this.assignFinalDelimiter(opts.appendDelimiter, insertPosition - 1);
    const includeFinalDelimiter = this.includeLastDelimiterAt(
      opts.includeFinalDelimiter,
      appendDelimiter,
      insertPosition - 1,
    );

    const prependDelimiter = this.assignPrependedDelimiter(opts.prependDelimiter, insertPosition - 1);
    const includePrependedDelimiter = this.getIncludePrependDelimiter(
      opts.includePrependedDelimiter,
      prependDelimiter,
      insertPosition - 1,
    );

    const labels: Label[] = [...before];
    const newLabel: Label = {
      // includeEmptySegments: this.getIncludeEmptySegments(opts.includeEmptySegments, insertPosition - 1),
      includePrependedDelimiter,
      includeFinalDelimiter,
      prependDelimiter,
      appendDelimiter,
      delimiter,
      label,
    };

    labels[insertPosition] = newLabel;
    labels.push(...after);

    return Labeler.create(labels);
  }

  before(position: number, label: string, options: LabelOptions = {}): LabelMaker {
    const insertPosition = this.insertionPosition(position);
    return this.at(insertPosition - 1, label, options);
  }

  clear(): LabelMaker {
    return Labeler.create([]);
  }

  get(position: number): Label | undefined {
    const insertPosition = this.insertionPosition(position);
    return this._labels[insertPosition];
  }

  labels(): Label[] {
    return this._labels.map((label: Label) => ({ ...label }));
  }

  remove(position: number): LabelMaker {
    const insertPosition = this.insertionPosition(position);
    const before = this._labels.slice(0, insertPosition);
    const after = this._labels.slice(insertPosition + 1);

    return Labeler.create([...before, ...after]);
  }

  replace(position: number, label: string, options: LabelOptions = {}): LabelMaker {
    const insertPosition = this.insertionPosition(position);
    return this.remove(insertPosition).at(insertPosition, label, options);
  }

  /**
   * @description Evaluates the insertion position of the label in the list.
   *
   * Does not correct for the value being greater than the length of the list. This should allow for
   * position based label generation
   */
  private insertionPosition(position: number): number {
    if (this._labels.length === 0) {
      return 0;
    }

    if (position >= 0) {
      return position;
    }

    return this.insertionPosition(position + this._labels.length);
  }

  private getDelimiter(delimiter: string | undefined, position: number): string {
    return delimiter ?? this.get(position)?.delimiter ?? defaultDelimiter;
  }

  private assignFinalDelimiter(delimiter: string | undefined, position: number): string {
    return delimiter ?? this.get(position)?.appendDelimiter ?? '';
  }

  private assignPrependedDelimiter(delimiter: string | undefined, position: number): string {
    return delimiter ?? this.get(position)?.prependDelimiter ?? '';
  }

  private includeLastDelimiterAt(
    include: boolean | undefined,
    appendDelimiter: string,
    position: number,
  ): boolean {
    return (
      include ??
      (appendDelimiter !== '' || this.get(position)?.includeFinalDelimiter) ??
      defaultIncludeFinalDelimiter
    );
  }

  private getIncludePrependDelimiter(
    prepend: boolean | undefined,
    prependDelimiter: string,
    position: number,
  ): boolean {
    return prepend ?? (prependDelimiter !== '' || this.shouldPrependDelimiter(position));
  }

  // private getIncludeEmptySegments(include: boolean | undefined, position: number): boolean {
  //   return include ?? this.get(position)?.includeEmptySegments ?? false;
  // }

  private get prependedDelimiter(): string {
    const label = this.get(this._labels.length - 1);
    return label?.includePrependedDelimiter ? label.prependDelimiter || label.delimiter : '';
  }

  private shouldPrependDelimiter(position: number): boolean {
    return this.get(position)?.includePrependedDelimiter ?? false;
  }

  private get lastIncludeFinalDelimiter(): boolean | undefined {
    return this.get(this._labels.length - 1)?.includeFinalDelimiter;
  }

  private applyDelimiter(delimiter: string, position: number): string {
    return position === this._labels.length - 1
      ? this.getFinalDelimiter(delimiter, position)
      : delimiter;
  }

  private getFinalDelimiter(delimiter: string, position: number): string {
    return this.lastIncludeFinalDelimiter ? this.get(position)?.appendDelimiter || delimiter : '';
  }

  private appendDelimiter(position: number): boolean | undefined {
    return position < this._labels.length - 1 || this.lastIncludeFinalDelimiter;
  }
}
