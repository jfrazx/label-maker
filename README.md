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

expect(labeler('baz').toString()).to.equal('foo|bar|baz');
```

Default delimiter is `|` but is easily changed:

```typescript
const labeler: LabelMaker = labelMaker('foo', ':')('bar', '>')('baz', {
  includeFinalDelimiter: true,
  delimiter: '\t',
});

expect(`${labeler('qux', '|')}`).to.equal('foo:bar>baz   qux|');
```

Passing a label: (string) as first parameter is required. You may optionally provide an alternate delimiter: (string) as a second parameter, or an object with the properties described [below](#options).

## Methods

### `after`

Add a segment to the label after the specified position. Returns a new label maker.

```typescript
const labeler: LabelMaker = labelMaker('foo')('bar').after(0, 'baz');

expect(labeler('qux').toString()).to.equal('foo|baz|bar|qux');
```

### `at`

Add a segment to the label at the specified position. Returns a new label maker.

```typescript
const labeler: LabelMaker = labelMaker('foo')('bar').at(1, 'baz');

expect(labeler('qux').toString()).to.equal('foo|baz|bar|qux');
```

### `before`

Add a segment to the label before the specified position. Returns a new label maker.

```typescript
const labeler: LabelMaker = labelMaker('foo')('bar').before(1, 'baz');

expect(labeler('qux').toString()).to.equal('baz|foo|bar|qux');
```

### `clear`

Clear the label. Returns a new label maker.

```typescript
const labeler: LabelMaker = labelMaker('foo')('bar').clear();

expect(labeler('qux').toString()).to.equal('');
```

### `get`

Get the `Label` object at the specified position.

```typescript
const labeler: LabelMaker = labelMaker('foo')('bar');

expect(labeler('baz').get(1)).to.deep.equal({
  label: 'bar',
  delimiter: '|',
  appendDelimiter: '',
  prependDelimiter: '',
  includeEmptySegments: false,
  includeFinalDelimiter: false,
  includePrependedDelimiter: false,
});
```

### `labels`

Retrieves all the label objects.

```typescript
const labeler: LabelMaker = labelMaker('foo')('bar');
const labels: Label[] = labeler('baz').labels();

expect(labels).to.have.lengthOf(3);
```

### `remove`

Remove a segment from the label at the specified position. Returns a new label maker.

```typescript
const labeler: LabelMaker = labelMaker('foo')('bar').remove(1);

expect(labeler('qux').toString()).to.equal('foo|qux');
```

### `replace`

Replace a segment in the label at the specified position. Returns a new label maker.

```typescript
const labeler: LabelMaker = labelMaker('foo')('bar').replace(1, 'baz');

expect(labeler('qux').toString()).to.equal('foo|baz|qux');
```

## Options

### `appendDelimiter`

Supply a final delimiter to use at the end of the label.

```typescript
const labeler: LabelMaker = labelMaker('foo', ':')('bar', '>')('baz', {
  appendDelimiter: '|',
});

expect(labeler('qux').toString()).to.equal('foo:bar>baz>qux|');
```

### `delimiter`

Delimiter to use between label segments. Default is `|`. Can vary between segments.

```typescript
const labeler: LabelMaker = labelMaker('foo', ':')('bar', '>')('baz', {
  delimiter: '\t',
});

expect(labeler('qux').toString()).to.equal('foo:bar>baz   qux');
```

### `includeFinalDelimiter`

Include final delimiter in the label. Default is `false`. Will use last provided value. Is set to true if `appendDelimiter` is provided.

```typescript
const labeler: LabelMaker = labelMaker('foo', ':')('bar', '>')('baz', {
  includeFinalDelimiter: true,
});

expect(labeler('qux').toString()).to.equal('foo:bar>baz>qux>');
```

### `prependDelimiter`

Delimiter to use before first segment.

```typescript
const labeler: LabelMaker = labelMaker('foo', ':')('bar', '>')('baz', {
  prependDelimiter: '|',
});

expect(labeler('qux').toString()).to.equal('|foo:bar>baz>qux');
```

### `includePrependedDelimiter`

Include delimiter before first segment. Default is `false`. Is set to true if `prependDelimiter` is provided.

```typescript
const labeler: LabelMaker = labelMaker('foo', ':')('bar', '>')('baz', {
  includePrependedDelimiter: true,
});

expect(labeler('qux').toString()).to.equal('>foo:bar>baz>qux');
```
