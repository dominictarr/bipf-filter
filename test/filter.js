var createFilter = require('../')
var bipf = require('bipf')
var tape = require('tape')

function encode (e) {
  var b = Buffer.alloc(bipf.encodingLength(e))
  bipf.encode(e, b, 0)
  return b
}

var data = [
  {foo: true, bar: false, okay: 'yes'},
  {foo: true, bar: false, okay: 'no'},
  {foo: 1, bar: false, okay: 'no'},
  {foo: 2, bar: true, okay: 'yes'},
  {foo: 2, bar: true, okay: 'maybe', nest: {a:1}},
  {foo: 3, bar: false, okay: 'maybe', nest: {a:2}}
].map(encode)

var inputs = [
  ['EQ', ['foo'], encode(true)],
  ['EQ', ['okay'].map(Buffer), encode('yes')],
  ['EQ', ['nest', 'a'].map(Buffer), encode(1)],
  ['EQ', ['nest', 'a'].map(Buffer), encode(2)],
  ['AND',
    ['EQ', ['okay'], encode('no')],
    ['EQ', ['bar'], encode(false)]
  ]
]

var outputs = [
  [0, 1],
  [0, 3],
  [4],
  [5],
  [1, 2]
]

for(var i = 0; i < inputs.length; i++) (function (i) {

  tape('filter:' + i, function (t) {
    console.log(inputs[i])
    t.deepEqual(
      data.filter(createFilter(inputs[i])),
      outputs[i].map(function (j) {
        return data[j]
      })
    )
    t.end()
  })

})(i)
