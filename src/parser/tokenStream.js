// TokenStream function
function TokenStream(input) {
  let current = null
  
  const keywords = [
    'test',     // type of var, consist of questions
    'question', // type of var, part of test
    'if',       // cond statement
    'else',     // cond statement
    'forEach',  // loof
    'as',       // variable declaration inside forEach
    'true',     // bool value
    'false',    // bool value
  ]

  const isKeyword = (x) => keywords.includes(x)

  const isDigit = (ch) => /[\d]/i.test(ch)

  const isIdStart = (ch) => /[\w]/i.test(ch)

  const isId = (ch) => (isIdStart(ch) || '0123456789'.includes(ch))
  
  const isOpChar = (ch) => '+-*/%=:&|<>!'.includes(ch)

  const isPunc = (ch) => ',;(){}[]'.includes(ch)

  const isWhitespace = (ch) => ' \t\n'.includes(ch)

  const readWhile = (predicate) => {
    let str = ''
    while (!input.eof() && predicate(input.peek())) {
      str += input.next()
    }
    return str
  }

  const readNumber = () => {
    let hasDot = false
    const number = readWhile(function(ch) {
      if (ch === '.') {
        if (hasDot) return false
        hasDot = true
        return true
      }
      return isDigit(ch)
    })

    return {
      type: 'num',
      value: parseFloat(number),
    }
  }

  const readIdent = () => {
    const id = readWhile(isId)

    return {
      type: isKeyword(id) ? 'kw' : 'var',
      value: id,
    }
  }

  const readEscaped = (end) => {
    let escaped = false, str = ''
    input.next()
    while (!input.eof()) {
      let ch = input.next()
      if (escaped) {
        str += ch
        escaped = false
      } else if (ch == "\\") {
        escaped = true
      } else if (ch == end) {
        break
      } else {
        str += ch
      }
    }
    return str
  }

  const readString = () => {
    return {
      type: 'str',
      value: readEscaped('"'),
    }
  }

  const skipComment = () => {
    readWhile(function(ch) { return ch !== '\n' })
    input.next()
  }

  const readNext = () => {
    // read to first char
    readWhile(isWhitespace)
    if (input.eof()) return null
    const ch = input.peek()
    if (ch === '#') {
      skipComment()
      return readNext()
    }
    if (ch === '"') return readString()
    if (isDigit(ch)) return readNumber()
    if (isIdStart(ch)) return readIdent()
    if (isPunc(ch)) return {
      type: 'punc',
      value: input.next()
    }
    if (isOpChar(ch)) return {
      type: 'op',
      value: readWhile(isOpChar)
    }
    input.croak(`Can't handle character: ${ch}`)
  }

  const peek = () => {
    return current || (current = readNext())
  }

  const next = () => {
    let tok = current
    current = null
    return tok || readNext()
  }

  const eof = () => (peek() == null)
  
  return {
    next: next,
    peek: peek,
    eof: eof,
    croak: input.croak
  }
}
