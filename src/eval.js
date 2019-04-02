const globalVars = {
  print: console.log,
}

class Environment {
  constructor(parent) {
    this.vars = Object.create(parent ? parent.vars : null)
    if (parent) {
      this.parent = parent
    }
  }

  lookup(name) {
    let scope = this
    while (scope) {
      if (Object.prototype.hasOwnProperty.call(scope.vars, name)) {
        return scope
      }
      scope = scope.parent
    }
  }

  getVarValue(name) {
    if (name in this.vars) {
      return this.vars[name]
      // TODO: refactor
    } else if (this.parent && name in this.parent.vars) {
      return this.parent.vars[name]
    } else if (name in globalVars) {
      return globalVars[name]
    }
    throw new Error('Undefined variable ' + name)
  }

  setVarValue(name, value) {
    const scope = this.lookup(name)
    if (!scope && this.parent) {
      throw new Error('Undefined variable ' + name)
    }
    return (scope || this).vars[name] = value
  }
}

Environment.prototype = {
  lookup: function(name) {
    let scope = this
    while (scope) {
      if (Object.prototype.hasOwnProperty.call(scope.vars, name)) {
        return scope
      }
      scope = scope.parent
    }
  },
  getVarValue: function(name) {
    if (name in this.vars) {
      return this.vars[name]
      // TODO: refactor
    } else if (this.parent && name in this.parent.vars) {
      return this.parent.vars[name]
    } else if (name in globalVars) {
      return globalVars[name]
    }
    throw new Error("Undefined variable " + name)
  },
  setVarValue: function(name, value) {
    const scope = this.lookup(name)
    if (!scope && this.parent) {
      throw new Error("Undefined variable " + name)
    }
    return (scope || this).vars[name] = value
  },
}

  // name  // key                             // identifier
const expTypes = {
  assign: 'assignExpression',                 // =
  objLiteral: 'objLiteral',                   // []
  literalAssign: 'literalAssignExpression',   // : inside objLiteral
  member: 'memberExpression',                 // ->
  cond: 'ifStatement',                        // if
  binary: 'binaryExpression',                 // +, -, /, *, >, <
  loop: 'forEachStatement',                   // forEach,
  loopVar: 'identifierExpression',            // as
  prog: 'prog',                               // { ... }
  func: 'call',                               // ()
}

const varTypes = [
  'testVar',
  'questionVar',
  'var' // member var for objLiteral
]

function evaluate(exp, env) {
  switch (exp.type) {
    case 'num':
    case 'str':
    case 'bool': return exp.value
    case 'var': return env.getVarValue(exp.value)
    case 'testVar': return env.getVarValue(exp.name)

    case expTypes.assign: {
      if (!varTypes.includes(exp.left.type)) {
        throw new Error('Cannot assign to ' + JSON.stringify(exp.left))
      }

      let value = evaluate(exp.right, env)
      const varType = exp.left.type
      const varName = exp.left.name

      value = (varType === 'testVar') ? testFactory(value) : value
      return env.setVarValue(varName, value)
    }

    case expTypes.objLiteral: {
      const innerValues = {}
      exp.properties.forEach((literalAssignExp) => {
        const [key, value] = evaluate(literalAssignExp, env)
        innerValues[key] = value
      })
      return innerValues
    }

    case expTypes.literalAssign: {
      if (!exp.left || !varTypes.includes(exp.left.type)) {
        throw new Error('Cannot assign to ' + JSON.stringify(exp.left))
      }

      const key = exp.left.value
      const value = evaluate(exp.right, env)
      return [key, value]
    }

    case expTypes.member: {
      // create a inner env that includes current scope as parent
      const innerEnv = new Environment(env)
      // get all members values of the literal
      const parent = evaluate(exp.left, env)
      innerEnv.vars = {
        ...parent,
      }
      // call child on a inner env
      const child = evaluate(exp.right, innerEnv)
      return child
    }

    case expTypes.binary: {
      return applyOp(
        exp.operator,
        evaluate(exp.left, env),
        evaluate(exp.right, env)
      )
    }

    case expTypes.cond: {
      const cond = evaluate(exp.cond, env)
      if (cond) {
        return evaluate(exp.then, env)
      } else if (exp.else) {
        return evaluate(exp.else, env)
      } else {
        return false
      }
    }

    case expTypes.loop: {
      const [varName, varValues] = evaluate(exp.inner, env)
      varValues.forEach((varValue) => {
        // create a inner env that includes current scope as parent
        const innerEnv = new Environment(env)
        innerEnv.vars = {
          [varName]: varValue,
        }
        const result = evaluate(exp.body, innerEnv)
      })
      return
    }

    case expTypes.loopVar: {
      const value = evaluate(exp.left, env)
      const varName = exp.right.value
      return [varName, value]
    }

    case expTypes.prog: {
      let val = false
      exp.prog.forEach((exp) => {
        val = evaluate(exp, env)
      })
      return val
    }

    case expTypes.func: {
      const func = evaluate(exp.func, env)
      return func.apply(null, exp.args.map((arg) => {
        return evaluate(arg, env)
      }))
    }

    default: {
      console.log('env', env)
      throw new Error("I don't know how to evaluate " + exp.type)
    }
  }
}

function applyOp(op, a, b) {
  const num = (x) => {
    if (typeof x !== 'number') {
      throw new Error('Expected number but got ' + x)
    }
    return x
  }

  switch (op) {
    case '+': return num(a) + num(b)
    case '-': return num(a) - num(b)
    case '*': return num(a) * num(b)
    case '/': return num(a) / num(b)
    case '%': return num(a) % num(b)
    case '&&': return a !== false && b
    case '||': return a !== false ? a : b
    case '<': return num(a) < num(b)
    case '>': return num(a) > num(b)
    case '<=': return num(a) <= num(b)
    case '>=': return num(a) >= num(b)
    case '==': return a === b
    case '!=': return a !== b
  }
  throw new Error('Can\'t apply operator ' + op)
}

function testFactory(test) {
  const props = ['questions', 'answers']
  props.forEach((prop) => {
    test[prop] = {
      items: [],
      add: (newItem) => {
        test[prop].items.push(newItem)
      },
      remove: (wasteItem) => {
        test[prop].items = test[prop].items.filter((item) => (
          item.description !== wasteItem.description
        ))
      },
      get amount() {
        return test[prop].items.length
      }
    }
  })
  return test
}
