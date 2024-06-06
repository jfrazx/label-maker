import { labelMaker } from '../src';
import { expect } from 'chai';

describe(`Labeler`, () => {
  describe(`General`, () => {
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
        expect(
          labelMaker('foo', {
            delimiter: '-',
          })('bar').toString(),
        ).to.equal('foo-bar');
      });

      it(`should generate from multiple labels`, () => {
        expect(labelMaker('foo')('bar')('baz').toString()).to.equal('foo|bar|baz');
      });

      it(`should generate from multiple labels with different delimiters`, () => {
        expect(
          labelMaker('foo', {
            delimiter: '-',
          })(
            'bar',
            '+',
          )('baz').toString(),
        ).to.equal('foo-bar+baz');
      });

      it(`should use the last delimiter if no delimiter is provided`, () => {
        expect(
          labelMaker(
            'foo',
            '+',
          )('bar')('baz', {
            delimiter: '-',
          })('jaz').toString(),
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
        expect(
          `${labelMaker('foo', {
            delimiter: '-',
          })('bar')}`,
        ).to.equal('foo-bar');
      });

      it(`should generate from multiple labels`, () => {
        expect(`${labelMaker('foo')('bar')('baz')}`).to.equal('foo|bar|baz');
      });

      it(`should generate from multiple labels with different delimiters`, () => {
        expect(
          `${labelMaker('foo', {
            delimiter: '-',
          })(
            'bar',
            '+',
          )('baz')}`,
        ).to.equal('foo-bar+baz');
      });

      it(`should use the last delimiter if no delimiter is provided`, () => {
        expect(
          `${labelMaker('foo', '+')('bar')('baz', {
            delimiter: '-',
          })('jaz')}`,
        ).to.equal('foo+bar+baz-jaz');
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

  describe(`methods`, () => {
    describe('after', () => {
      it(`should insert a label after a specific position`, () => {
        expect(labelMaker('foo').after(0, 'bar').toString()).to.equal('foo|bar');

        expect(
          labelMaker('foo')('baz')('bat', {
            delimiter: '-',
          })
            .after(1, 'bar')
            .toString(),
        ).to.equal('foo|baz|bar|bat');
      });

      it(`should insert a label after a specific position with negative index`, () => {
        expect(labelMaker('foo').after(-1, 'bar').toString()).to.equal('foo|bar');

        expect(
          labelMaker('foo')('baz')('bat', {
            delimiter: '-',
          })
            .after(-2, 'bar')
            .toString(),
        ).to.equal('foo|baz|bar|bat');
      });
    });

    describe(`at`, () => {
      it(`should be a single label`, () => {
        expect(labelMaker.at(0, 'foo').toString()).to.equal('foo');
      });

      it('should handle empty label positions', () => {
        expect(labelMaker('foo').at(10, 'bar').toString()).to.equal('foo|bar');

        expect(
          labelMaker('foo')('baz')('bat', {
            delimiter: '-',
          })
            .at(10, 'bar')
            .toString(),
        ).to.equal('foo|baz|bat-bar');
      });

      it(`should insert a label at a specific position`, () => {
        expect(labelMaker('foo').at(0, 'bar').toString()).to.equal('bar|foo');

        expect(
          labelMaker('foo')('baz')('bat', {
            delimiter: '-',
          })
            .at(1, 'bar')
            .toString(),
        ).to.equal('foo|bar|baz|bat');
      });

      it(`should insert a label at a specific position with negative index`, () => {
        expect(labelMaker('foo').at(-1, 'bar').toString()).to.equal('bar|foo');

        expect(
          labelMaker('foo')('baz')('bat', {
            delimiter: '-',
          })
            .at(-2, 'bar')
            .toString(),
        ).to.equal('foo|bar|baz|bat');
      });
    });

    describe(`before`, () => {
      it(`should insert a label before a specific position`, () => {
        expect(labelMaker('foo').before(0, 'bar').toString()).to.equal('bar|foo');

        expect(
          labelMaker('foo')('baz')('bat', {
            delimiter: '-',
          })
            .before(1, 'bar')
            .toString(),
          // This occurs because the position is 1, so it inserts at the beginning (position - 1).
          // Since no delimiter is supplied it retrieves from the position before itself, which
          // wraps around to the end of the array
        ).to.equal('bar-foo|baz|bat');
      });

      it(`should insert a label before a specific position with negative index`, () => {
        expect(labelMaker('foo').before(-1, 'bar').toString()).to.equal('bar|foo');

        expect(
          labelMaker('foo')('baz')('bat', {
            delimiter: '-',
          })
            .before(-2, 'bar')
            .toString(),
        ).to.equal('bar-foo|baz|bat');

        expect(
          labelMaker('foo')('baz')('bat', {
            delimiter: '-',
          })
            .before(-3, 'bar')
            .toString(),
        ).to.equal('foo|baz|bar|bat');
      });
    });

    describe(`clear`, () => {
      it(`should clear all labels`, () => {
        expect(labelMaker('foo').clear().toString()).to.equal('');
      });

      it(`should clear all labels with multiple labels`, () => {
        expect(labelMaker('foo')('bar')('baz').clear().toString()).to.equal('');
      });
    });

    describe(`get`, () => {
      it(`should return undefined if there are nno labels`, () => {
        expect(labelMaker.get(0)).to.be.undefined;
      });

      it(`should get a label at a specific position`, () => {
        expect(labelMaker('foo').get(0)).to.deep.equal({
          label: 'foo',
          delimiter: '|',
          appendDelimiter: '',
          prependDelimiter: '',
          includeFinalDelimiter: false,
          includePrependedDelimiter: false,
        });

        expect(
          labelMaker('foo')('baz')('bat', {
            delimiter: '-',
          }).get(1),
        ).to.deep.equal({
          label: 'baz',
          delimiter: '|',
          appendDelimiter: '',
          prependDelimiter: '',
          includeFinalDelimiter: false,
          includePrependedDelimiter: false,
        });
      });

      it(`should get a label at a specific position with negative index`, () => {
        expect(labelMaker('foo').get(-1)).to.deep.equal({
          label: 'foo',
          delimiter: '|',
          appendDelimiter: '',
          prependDelimiter: '',
          includeFinalDelimiter: false,
          includePrependedDelimiter: false,
        });

        expect(
          labelMaker('foo')('baz')('bat', {
            delimiter: '-',
          }).get(-1),
        ).to.deep.equal({
          label: 'bat',
          delimiter: '-',
          appendDelimiter: '',
          prependDelimiter: '',
          includeFinalDelimiter: false,
          includePrependedDelimiter: false,
        });
      });

      it(`should return undefined if the position is out of bounds`, () => {
        expect(labelMaker('foo').get(100)).to.be.undefined;
      });

      it(`should not return undefined if the position is out of bounds with negative index`, () => {
        expect(labelMaker('foo').get(-100)).to.deep.equal({
          label: 'foo',
          delimiter: '|',
          appendDelimiter: '',
          prependDelimiter: '',
          includeFinalDelimiter: false,
          includePrependedDelimiter: false,
        });
      });

      it(`should return a Label at the specified position`, () => {
        expect(labelMaker('foo').at(100, 'bar').get(100)).to.deep.equal({
          label: 'bar',
          delimiter: '|',
          appendDelimiter: '',
          prependDelimiter: '',
          includeFinalDelimiter: false,
          includePrependedDelimiter: false,
        });
      });
    });

    describe(`labels`, () => {
      it(`should be an empty array when no labels are provided`, () => {
        expect(labelMaker.labels()).to.deep.equal([]);
      });

      it(`should generate from a single label`, () => {
        expect(labelMaker('foo').labels()).to.deep.equal([
          {
            label: 'foo',
            delimiter: '|',
            appendDelimiter: '',
            prependDelimiter: '',
            includeFinalDelimiter: false,
            includePrependedDelimiter: false,
          },
        ]);
      });

      it(`should generate from several labels`, () => {
        expect(labelMaker('foo')('bar').labels()).to.deep.equal([
          {
            label: 'foo',
            delimiter: '|',
            appendDelimiter: '',
            prependDelimiter: '',
            includeFinalDelimiter: false,
            includePrependedDelimiter: false,
          },
          {
            label: 'bar',
            delimiter: '|',
            appendDelimiter: '',
            prependDelimiter: '',
            includeFinalDelimiter: false,
            includePrependedDelimiter: false,
          },
        ]);
      });

      it(`should generate from several labels with different delimiters`, () => {
        expect(
          labelMaker('foo', {
            delimiter: '-',
          })('bar').labels(),
        ).to.deep.equal([
          {
            label: 'foo',
            delimiter: '-',
            appendDelimiter: '',
            prependDelimiter: '',
            includeFinalDelimiter: false,
            includePrependedDelimiter: false,
          },
          {
            label: 'bar',
            delimiter: '-',
            appendDelimiter: '',
            prependDelimiter: '',
            includeFinalDelimiter: false,
            includePrependedDelimiter: false,
          },
        ]);
      });
    });

    describe(`remove`, () => {
      it(`should remove a label at a specific position`, () => {
        expect(labelMaker('foo').remove(0).toString()).to.equal('');

        expect(
          labelMaker('foo')('baz')('bat', {
            delimiter: '-',
          })
            .remove(1)
            .toString(),
        ).to.equal('foo|bat');
      });

      it(`should remove a label at a specific position with negative index`, () => {
        expect(labelMaker('foo').remove(-1).toString()).to.equal('');

        expect(
          labelMaker('foo')('baz')('bat', {
            delimiter: '-',
          })
            .remove(-2)
            .toString(),
        ).to.equal('foo|bat');
      });
    });

    describe(`replace`, () => {
      it(`should replace a label at a specific position`, () => {
        expect(labelMaker('foo').replace(0, 'bar').toString()).to.equal('bar');

        expect(
          labelMaker('foo')('baz')('bat', {
            delimiter: '-',
          })
            .replace(1, 'bar')
            .toString(),
        ).to.equal('foo|bar|bat');
      });

      it(`should replace a label at a specific position with negative index`, () => {
        expect(labelMaker('foo').replace(-1, 'bar').toString()).to.equal('bar');

        expect(
          labelMaker('foo')('baz')('bat', {
            delimiter: '-',
          })
            .replace(-2, 'bar')
            .toString(),
        ).to.equal('foo|bar|bat');
      });
    });
  });

  describe(`options`, () => {
    describe(`prependDelimiter`, () => {
      it('should prepend a delimiter', () => {
        expect(
          labelMaker('foo', {
            includePrependedDelimiter: true,
          })('bar').toString(),
        ).to.equal('|foo|bar');
      });

      it('should prepend a delimiter with a custom delimiter', () => {
        expect(
          labelMaker('foo', {
            includePrependedDelimiter: true,
            delimiter: '-',
          })('bar').toString(),
        ).to.equal('-foo-bar');
      });

      it('should prepend a delimiter with a custom final delimiter', () => {
        expect(
          labelMaker('foo', {
            includePrependedDelimiter: true,
            appendDelimiter: '-',
          })('bar').toString(),
        ).to.equal('|foo|bar-');
      });

      it('should prepend a delimiter with a custom final delimiter and delimiter', () => {
        expect(
          labelMaker('foo', {
            prependDelimiter: '%',
            appendDelimiter: '-',
            delimiter: '+',
          })('bar').toString(),
        ).to.equal('%foo+bar-');
      });
    });

    describe(`appendDelimiter`, () => {
      it('should append a delimiter', () => {
        expect(
          labelMaker('foo', {
            includeFinalDelimiter: true,
          })('bar').toString(),
        ).to.equal('foo|bar|');
      });

      it('should append a delimiter with a custom delimiter', () => {
        expect(
          labelMaker('foo', {
            includeFinalDelimiter: true,
            delimiter: '-',
          })('bar').toString(),
        ).to.equal('foo-bar-');
      });

      it('should append a delimiter with a custom final delimiter', () => {
        expect(
          labelMaker('foo', {
            includeFinalDelimiter: true,
            appendDelimiter: '-',
          })('bar').toString(),
        ).to.equal('foo|bar-');
      });

      it('should append a delimiter with a custom final delimiter and delimiter', () => {
        expect(
          labelMaker('foo', {
            prependDelimiter: '%',
            appendDelimiter: '-',
            delimiter: '+',
          })('bar').toString(),
        ).to.equal('%foo+bar-');
      });

      it.skip(`should not append a delimiter if includeFinalDelimiter is false`, () => {
        expect(
          labelMaker('foo', {
            includeFinalDelimiter: false,
            appendDelimiter: '-',
          })('bar').toString(),
        ).to.equal('foo|bar');
      });
    });
  });
});
