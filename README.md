# Label Maker

Continuous label generator

## Install

```bash
npm install @status/label-maker
```

or

```bash
yarn add @status/label-maker
```

## Usage

Generate endless labels with `@status/label-maker`:

```typescript
import { LabelMaker, labelMaker } from '@status/label-maker';

const labeler: LabelMaker = labelMaker('foo')('bar');

expect(labeler('baz').toString()).toBe('foo|bar|baz');
```

Default delimiter is `|` but you can change it:

```typescript
const labeler: LabelMaker = labelMaker('foo', ':')('bar', '>')('baz', {
  includeFinalDelimiter: true,
  delimiter: '\t',
});

expect(`${labeler('qux', '|')}`).toBe('foo:bar>baz   qux|');
```

Passing a label: (string) as first parameter is required. You may optionally provide an alternate delimiter: (string) as a second parameter, or an object with the properties described below.

## Options

### `includeFinalDelimiter`

Include final delimiter in the label. Default is `false`. Will use last provided value.

### `delimiter`

Delimiter to use between label segments. Default is `|`. Can vary between segments.
