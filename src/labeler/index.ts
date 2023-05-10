import type { Label, LabelOptions, LabelMaker } from '../interfaces';

const defaultDelimiter: string = '|';
const defaultIncludeFinalDelimiter: boolean = false;

export class Labeler {
  constructor(private readonly labels: Label[] = []) {}

  labeler = (label: string, options: LabelOptions = {}): LabelMaker => {
    const opts = typeof options === 'string' ? { delimiter: options } : options;
    const delimiter = this.getDelimiter(opts.delimiter);

    const labelMaker = new Labeler([
      ...this.labels,
      {
        label,
        delimiter,
        includeFinalDelimiter: this.getIncludeFinalDelimiter(opts.includeFinalDelimiter),
      },
    ]);

    labelMaker.labeler.toString = labelMaker.toString;

    return labelMaker.labeler;
  };

  private getDelimiter(delimit: string | undefined): string {
    return delimit ?? this.lastDelimiter ?? defaultDelimiter;
  }

  private getIncludeFinalDelimiter(include: boolean | undefined): boolean {
    return include ?? this.lastIncludeFinalDelimiter ?? defaultIncludeFinalDelimiter;
  }

  private get lastIncludeFinalDelimiter(): boolean {
    return this.lastElement?.includeFinalDelimiter;
  }

  private get lastDelimiter(): string {
    return this.lastElement?.delimiter;
  }

  private get lastElement(): Label {
    return this.labels[this.labels.length - 1];
  }

  toString = (): string => {
    return this.labels.reduce(
      (memo: string, { label, delimiter }: Label, index: number) =>
        `${memo}${label}${this.appendDelimiter(index) ? delimiter : ''}`,
      '',
    );
  };

  private appendDelimiter(index: number): boolean {
    return index < this.labels.length - 1 || this.lastIncludeFinalDelimiter;
  }
}
