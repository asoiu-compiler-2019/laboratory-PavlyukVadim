function parse(input) {
  const PRECEDENCE = {
    '=': 1,    // assign
    ':': 1,    // assign for props inside literals
    '||': 2,   // bool or
    '&&': 3,   // bool and
    '<': 4,    // les
    '>': 4,    // more
    '<=': 4,   // les or equal
    '>=': 4,   // more or equal
    '==': 4,   // equal
    '!=': 4,   // not equal
    '+': 5,    // plus
    '-': 5,    // minus
    '*': 6,    // multiple
    '/': 6,    // divide
    '%': 6,    // remaining from dividing
    '->': 7,   // access to props
    'as': 7,   // forEach var identifier
  }

  return parseTopLevel()

  function isPunc(ch) {
    const tok = input.peek()
    return (tok && (tok.type === 'punc') && (!ch || tok.value === ch))
  }

  function isKw(kw) {
    const tok = input.peek()
    return (tok && (tok.type === 'kw') && (!kw || tok.value === kw))
  }

  function isOp(op) {
    const tok = input.peek()
    console.log('op tok', tok)
    return (tok && (tok.type === 'op') && (!op || tok.value === op))
  }

  function skipPunc(ch) {
    if (isPunc(ch)) input.next()
    // else input.croak("Expecting punctuation: \"" + ch + "\"")
  }

  function skipKw(kw) {
    if (isKw(kw)) input.next()
    else input.croak("Expecting keyword: \"" + kw + "\"")
  }

  function unexpected() {
    input.croak("Unexpected token: " + JSON.stringify(input.peek()))
  }

  function maybeBinary(left, myPrec) {
    const tok = input.peek()
    if (tok) {
      const hisPrec = PRECEDENCE[tok.value]
      if (hisPrec > myPrec) {
        input.next()
        let type
        switch(tok.value) {
          case '=': {
            type = 'assignExpression'
            break
          }
          case ':': {
            type = 'literalAssignExpression'
            break
          }
          case '->': {
            type = 'memberExpression'
            break
          }
          case 'as': {
            type = 'identifierExpression'
            break
          }
          default: {
            type = 'binaryExpression'
          }
        }

        return maybeBinary({
          type,
          operator: tok.value,
          left,
          right: maybeBinary(parseAtom(), hisPrec)
        }, myPrec)
      }
    }
    return left
  }

  function delimited(start, stop, separator, parser) {
    const a = []
    let first = true
    skipPunc(start)
    while (!input.eof()) {
      if (isPunc(stop)) break
      if (first) {
        first = false
      } else {
        skipPunc(separator)
      }
      if (isPunc(stop)) break
      a.push(parser())
    }
    skipPunc(stop)
    return a
  }

  function parseCall(func) {
    return {
      type: 'call',
      func,
      args: delimited('(', ')', ',', parseExpression),
    }
  }

  function parseVarTestName() {
    skipKw('test')
    const name = input.next()
    return {
      type: 'testVar',
      name: name.value
    }
  }

  function parseVarQuestionName() {
    skipKw('question')
    const name = input.next()
    return {
      type: 'questionVar',
      name: name.value
    }
  }

  function parseIf() {
    skipKw('if')
    const cond = parseExpression()
    if (!isPunc('{')) skipKw('then')
    const then = parseExpression()
    const ret = {
      type: 'ifStatement',
      cond,
      then,
    }
    if (isKw('else')) {
      input.next()
      ret.else = parseExpression()
    }
    return ret
  }

  function parseForEach() {
    skipKw('forEach')
    const inner = parseExpression()
    const body = parseExpression()
    const ret = {
      type: 'forEachStatement',
      inner,
      body,
    }
    return ret
  }

  function parseBool() {
    return {
      type: 'bool',
      value: (input.next().value === 'true')
    }
  }

  // check does it a function call
  function maybeCall(expr) {
    return isPunc('(') ? parseCall(expr) : expr
  }

  function parseAtom() {
    const expr = (() => {
      if (isPunc('(')) {
        input.next()
        const exp = parseExpression()
        skipPunc(')')
        return exp
      }
      if (isPunc('{')) return parseProg()
      if (isPunc('[')) return parseObjLiteral()
      if (isKw('if')) return parseIf()
      if (isKw('forEach')) return parseForEach()
      if (isKw('true') || isKw('false')) return parseBool()
      if (isKw('test')) return parseVarTestName()
      if (isKw('question')) return parseVarQuestionName()

      const tok = input.next()
      if (
        (tok.type === 'var') ||
        (tok.type === 'num') ||
        (tok.type === 'str')
      ) {
        return tok
      }
      unexpected()
    })()

    return maybeCall(expr)
  }

  function parseTopLevel() {
    const prog = []
    while (!input.eof()) {
      prog.push(parseExpression())
      if (!input.eof()) {
        skipPunc(';')
      }
    }

    return {
      type: 'prog',
      prog,
    }
  }

  function parseProg() {
    const prog = delimited('{', '}', ';', parseExpression)
    if (prog.length === 0) {
      return {
        type: 'bool',
        value: false,
      }
    }
    if (prog.length === 1) {
      return prog[0]
    }

    return {
      type: 'prog',
      prog: prog
    }
  }

  function parseObjLiteral() {
    const properties = delimited('[', ']', ',', parseExpression)
    return {
      type: 'objLiteral',
      properties,
    }
  }

  function parseExpression() {
    return maybeCall(maybeBinary(parseAtom(), 0))
  }
}
