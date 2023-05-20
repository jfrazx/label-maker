import type { Label, LabelOptions, LabelMaker, LabelerOptions } from '../interfaces';

const defaultDelimiter: string = '|';
const defaultIncludeFinalDelimiter: boolean = false;

export class Labeler {
  constructor(private readonly labels: Label[] = []) {}

  labeler = (label: string, options: LabelOptions = {}): LabelMaker => {
    const opts: LabelerOptions =
      typeof options === 'string' ? { delimiter: options } : options;

    const delimiter: string = this.getDelimiter(opts.delimiter);

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

  private get lastIncludeFinalDelimiter(): boolean | undefined {
    return this.lastElement?.includeFinalDelimiter;
  }

  private get lastDelimiter(): string | undefined {
    return this.lastElement?.delimiter;
  }

  private get lastElement(): Label | undefined {
    return this.labels[this.labels.length - 1];
  }

  toString = (): string => {
    return this.labels.reduce(
      (memo: string, { label, delimiter }: Label, index: number) =>
        `${memo}${label}${this.appendDelimiter(index) ? delimiter : ''}`,
      '',
    );
  };

  private appendDelimiter(index: number): boolean | undefined {
    return index < this.labels.length - 1 || this.lastIncludeFinalDelimiter;
  }
}
