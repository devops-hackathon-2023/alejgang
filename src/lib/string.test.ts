import { capitalize, classNames, humanize } from '$lib/string';
import { assert, describe, it } from 'vitest';

describe('strings', () => {
  it('humanize', () => {
    assert(humanize('hello-world') === 'hello world');
    assert(humanize('hello-world-again') === 'hello world again');
    assert(humanize('hello world'), 'hello world');
  });

  it('capitalize', () => {
    assert(capitalize('hello') === 'Hello');
    assert(capitalize('hello world') === 'Hello world');
  });

  it('classNames', () => {
    assert(classNames('hello', 'world') === 'hello world');
    assert(classNames('hello', '', 'world', '') === 'hello world');
  });
});
