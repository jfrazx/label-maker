# Label Maker

Continuous label generator

## Install

```bash
npm install label-maker
```

or

```bash
yarn add label-maker
```

## Usage

Generate endless labels with `labelMaker`:

```typescript
import { LabelMaker, labelMaker } from 'label-maker';

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

## Options

### `includeFinalDelimiter`

Include final delimiter in the label. Default is `false`. Will use last provided value.

### `delimiter`

Delimiter to use between label segments. Default is `|`. Can vary between segments.
