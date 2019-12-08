var bipf = require('bipf')
//[paths, values]
//[[path..., value]]

function createEQ ([path, value]) {
  if(!Buffer.isBuffer(value)) {
    var b = Buffer.alloc(bipf.encodingLength(value))
    bipf.encode(value, b, 0)
    value = b
  }
  return function EQ (b, start) {
    start = start | 0
    for(var i = 0; i < path.length; i++) {
      start = bipf.seekKey(b, start, path[i])
      if(start == -1) return false
    }
    return bipf.compare(b, start, value, 0) === 0
  }
}

function createAND (_rules) {
  var rules = _rules.map(createRules)
  return function AND (b, start) {
    for(var i = 0; i < rules.length; i++)
      if(rules[i](b, start) === false) return false
    return true
  }
}

function createOR (rules) {
  rules = rules.map(createRules)
  return function OR (b, start) {
    for(var i = 0; i < rules.length; i++)
      if(rules[i](b, start) === true) return true
    return false
  }
}

function createDIFF (rules) {
  rules = rules.map(createRules)
  if(rules.length != 2) throw new Error('DIFF accepts exactly 2 rules, had:'+rules.length)
  return function DIFF (b, start) {
    return rules[0](b, start) && !rules[1](b, start)
  }
}


var rules = {
  EQ: createEQ,
  AND: createAND,
  OR: createOR,
  DIFF: createDIFF
}

function createRules (rule) {
  return rules[rule[0]](rule.slice(1))
}

module.exports = function createFilter (_rule) {
  var rule = createRules(_rule)
  //return a function that only takes one arg, so can be passed to Array#filter
  return function (b) { return rule(b, 0) }
}
