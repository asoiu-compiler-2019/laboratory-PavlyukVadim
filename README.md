## Theory of compilers

### Implementation of specific programming language for testing system

### Technology stack

Main language: ```javascript```.
For testing: ```mocha```, ```chai```.

### Getting started

The interpreted language specified for analyzing testing results.

#### Hello world

```
print("Hello world")
```

#### Data Types

Type | Desc | Example
--- | --- | ---
```String``` | Sequence of characters | ```"Hello world"```
```Number``` | Any integers or real Numbers | ```-1```, ```0```, ```1```, ```3.14``` |
```Boolean``` | Logical type | ```true```, ```false```
```Object``` | Compound type | ```[key: "value"]```

#### Variables

There are two types of variables: ```test```, ```question```. They are created by declaration them with keywords ```test``` or ```question``` and by assigning them to literal object ([]). Literal object can consist of any inner members.

```
test t = [
  title: "My first test",
]

question q1 = [
  description: "What's your name",
]

question q2 = [
  description: "How old are you",
]

question q3 = []
```

#### Object inner members

For getting access to inner members you have to use ```->``` sign. The question type has a few inner methods: ```add``` for adding a new question into a question, ```remove``` for opposite purpose, ```amount``` for getting number of questions.

```
t->questions->add(q1)
t->questions->add(q2)
t->questions->add(q3)
t->questions->remove(q3)

print(t->questions->amount) # 2
```

#### Conditions

```
if (t->questions->amount > 1) {
  print("questions amount more than 1")
}
```

#### Test inner properties

Also, you can add answers in test instance

```
t->answers->add([
  id: 1,
  q1: "Vadim",
  q2: "21",
])

t->answers->add([
  id: 2,
  q1: "Max",
  q2: "25",
])
```

#### Cycles

```
forEach(t->questions->items as q) {
  print(q->description)
}

forEach(t->answers->items as a) {
  print(a->q1)
}
```

### Implementation

#### Tokenizing/Lexing

Breaking up a string of characters into meaningful (to the language) chunks, called tokens. For instance, consider the program: ```test t = []```. This program would be broken up into the following tokens: ```test```, ```t```, ```=```, ```[```, ```]```. Whitespace may not be persisted as a token, because of their meaningless.

#### Parsing

Taking a stream (array) of tokens and turning it into a tree of nested elements, which collectively represent the grammatical structure of the program. This tree is called an "AST" (Abstract Syntax Tree).

The tree for ```t = []``` might start with a top-level node called assignExpression, with a child node called testVar (whose name is t), and another child called objLiteral.

#### Code-Generation

The process of taking an ```AST``` and turning it into executable code. Evaluator gets as input parameter ```AST structure``` and starts handle each node step by step. The binding block of code with variables is by using ```scopes```. It's abstractions that consist of all data, that are available for the block of code and link to parent scope. On the top level scopes are bound to the ```global scope```, that consist of top-level variable and system methods.

### BNF

```
PrimaryExpression ::=
  "this" |
  ObjectLiteral |
  Identifier
Identifier ::=
  <IDENTIFIER_NAME>
CommentSymbol ::=
  ("#")
ObjectLiteral	::=
  "[" (PropertyNameAndValueList)? "]"
PropertyNameAndValueList ::=
  PropertyNameAndValue (","PropertyNameAndValue | ",")*
PropertyNameAndValue ::=
  PropertyName ":" AssignmentExpression
PropertyName ::=
  Identifier |
  <STRING_LITERAL>
RelationalOperator ::=
  "<" |
  ">" |
  "<=" |
  ">="
MemberExpression ::=
  MemberExpressionPart
MemberExpressionPart ::=
  ("->" Identifier)
AssignmentOperator ::=
  ("=")
Expression ::=
  AssignmentExpression ("," AssignmentExpression)*
Statement ::=
  Block |
  IfStatement |
  IterationStatement
Block ::=
  "{" (StatementList)? "}"
StatementList	::=
  (Statement)
VariableStatement ::=
  "test" VariableDeclarationList |
  "question" VariableDeclarationList
VariableDeclarationList	::=
  VariableDeclaration ( "," VariableDeclaration )*
VariableDeclaration ::=
  Identifier (Initialiser)?
IfStatement	::=
  "if" "(" Expression ")" Statement ("else" Statement)?
IterationStatement ::=
  ("forEach" VariableStatement "as" VariableDeclaration)
```
