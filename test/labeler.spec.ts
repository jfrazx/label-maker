import { labelMaker } from '../src';
import { expect } from 'chai';

describe(`Labeler`, () => {
  describe(`ContinuousFunction`, () => {
    it(`should return a labeler function`, () => {
      expect(labelMaker).to.be.a('function');
    });

    it(`should return a labeler function that returns a labeler function`, () => {
      expect(labelMaker('foo')).to.be.a('function');
    });

    it(`should return a labeler function that returns a labeler function that returns a labeler function`, () => {
      expect(labelMaker('foo')('bar')('baz')).to.be.a('function');
    });

    it(`should not be the same function`, () => {
      expect(labelMaker).to.not.equal(labelMaker('foo'));
      expect(labelMaker('foo')).to.not.equal(labelMaker('foo')('bar'));
    });
  });

  describe(`toStringExplicit`, () => {
    it(`should be an empty string when no labels are provided`, () => {
      expect(labelMaker.toString()).to.equal('');
    });

    it(`should generate from a single label`, () => {
      expect(labelMaker('foo').toString()).to.equal('foo');
    });

    it(`should generate from several labels`, () => {
      expect(labelMaker('foo')('bar').toString()).to.equal('foo|bar');
    });

    it(`should generate from several labels with different delimiters`, () => {
      expect(labelMaker('foo', { delimiter: '-' })('bar').toString()).to.equal('foo-bar');
    });

    it(`should generate from multiple labels`, () => {
      expect(labelMaker('foo')('bar')('baz').toString()).to.equal('foo|bar|baz');
    });

    it(`should generate from multiple labels with different delimiters`, () => {
      expect(labelMaker('foo', { delimiter: '-' })('bar', '+')('baz').toString()).to.equal(
        'foo-bar+baz',
      );
    });

    it(`should use the last delimiter if no delimiter is provided`, () => {
      expect(
        labelMaker('foo', '+')('bar')('baz', { delimiter: '-' })('jaz').toString(),
      ).to.equal('foo+bar+baz-jaz');
    });

    it(`should use the last delimiter if no delimiter is provided with includeFinalDelimiter`, () => {
      expect(
        labelMaker(
          'foo',
          '+',
        )('bar')('baz', { delimiter: '-' })('jaz', {
          includeFinalDelimiter: true,
        }).toString(),
      ).to.equal('foo+bar+baz-jaz-');
    });
  });

  describe(`toStringImplicit`, () => {
    it(`should be an empty string when no labels are provided`, () => {
      expect(`${labelMaker}`).to.equal('');
    });

    it(`should generate from a single label`, () => {
      expect(`${labelMaker('foo')}`).to.equal('foo');
    });

    it(`should generate from several labels`, () => {
      expect(`${labelMaker('foo')('bar')}`).to.equal('foo|bar');
    });

    it(`should generate from several labels with different delimiters`, () => {
      expect(`${labelMaker('foo', { delimiter: '-' })('bar')}`).to.equal('foo-bar');
    });

    it(`should generate from multiple labels`, () => {
      expect(`${labelMaker('foo')('bar')('baz')}`).to.equal('foo|bar|baz');
    });

    it(`should generate from multiple labels with different delimiters`, () => {
      expect(`${labelMaker('foo', { delimiter: '-' })('bar', '+')('baz')}`).to.equal(
        'foo-bar+baz',
      );
    });

    it(`should use the last delimiter if no delimiter is provided`, () => {
      expect(`${labelMaker('foo', '+')('bar')('baz', { delimiter: '-' })('jaz')}`).to.equal(
        'foo+bar+baz-jaz',
      );
    });

    it(`should use the last delimiter if no delimiter is provided with includeFinalDelimiter`, () => {
      expect(
        `${labelMaker('foo', '+')('bar')('baz', {
          delimiter: '-',
          includeFinalDelimiter: true,
        })('jaz', {})}`,
      ).to.equal('foo+bar+baz-jaz-');
    });
  });
});
