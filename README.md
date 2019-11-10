# bipf-filter

create a filter function to process bipf (Binary In-Place Format)

`bipf` is a binary JSON-analogous format that is designed for reading
in-place, that is without parsing, and without allocating memory.
That makes reading from it very fast. If you need to read a bulk amount
of data, but you are mainly sifting through everything for just a few things,
say to query a database, you want `bipf` or something like `bipf`.

And you also want a filter function, probably, which is what _this module_ provides.

## example

``` js
var Filter = require('bipf-filter')

var f = Filter(['AND',
  ['EQ', ['foo'], 'bar'],
  ['EQ', ['bar'], 'baz']
])

//where data is an array of bipf buffers...
var match = data.filter(f)
```


## License

MIT
