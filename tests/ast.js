describe('AST tests', function() {
  it('testVariableAssignCode', function() {

    const testVariableAssignCode = `
      test t = [
        title: "My first test",
      ]
    `

    const expectedResult = {
      "type": "prog",
      "prog": [
        {
          "type": "assignExpression",
          "operator": "=",
          "left": {
            "type": "testVar",
            "name": "t"
          },
          "right": {
            "type": "objLiteral",
            "properties": [
              {
                "type": "literalAssignExpression",
                "operator": ":",
                "left": {
                  "type": "var",
                  "value": "title"
                },
                "right": {
                  "type": "str",
                  "value": "My first test"
                }
              }
            ]
          }
        }
      ]
    }

    const astOfTestVariableAssignCode = parse(TokenStream(InputStream(testVariableAssignCode)))

    chai.expect(astOfTestVariableAssignCode)
      .to.deep.equal(expectedResult)
  })

  it('questionVariableAssignCode', function() {
    const questionVariableAssignCode = `
      question q1 = [
        description: "What's your name",
      ]
    `

    const expectedResult = {
      "type": "prog",
      "prog": [
        {
          "type": "assignExpression",
          "operator": "=",
          "left": {
            "type": "questionVar",
            "name": "q1"
          },
          "right": {
            "type": "objLiteral",
            "properties": [
              {
                "type": "literalAssignExpression",
                "operator": ":",
                "left": {
                  "type": "var",
                  "value": "description"
                },
                "right": {
                  "type": "str",
                  "value": "What's your name"
                }
              }
            ]
          }
        }
      ]
    }

    const astOfQuestionVariableAssignCode = parse(TokenStream(InputStream(questionVariableAssignCode)))

    chai.expect(astOfQuestionVariableAssignCode)
      .to.deep.equal(expectedResult)
  })


  it('testMembersExprCode', function() {
    const testMembersExprCode = `
      t->questions->add(q1)
    `

    const expectedResult = {
      "type": "prog",
      "prog": [
        {
          "type": "memberExpression",
          "operator": "->",
          "left": {
            "type": "memberExpression",
            "operator": "->",
            "left": {
              "type": "var",
              "value": "t"
            },
            "right": {
              "type": "var",
              "value": "questions"
            }
          },
          "right": {
            "type": "call",
            "func": {
              "type": "var",
              "value": "add"
            },
            "args": [
              {
                "type": "var",
                "value": "q1"
              }
            ]
          }
        }
      ]
    }

    const astOfTestMembersExprCode = parse(TokenStream(InputStream(testMembersExprCode)))

    chai.expect(astOfTestMembersExprCode)
      .to.deep.equal(expectedResult)
  })


  it('testMembersWithLiteralExprCode', function() {
    const testMembersWithLiteralExprCode = `
      t->answers->add([
        id: 1,
        q1: "Vadim",
        q2: "21",
      ])
    `

    const expectedResult = {
      "type": "prog",
      "prog": [
        {
          "type": "memberExpression",
          "operator": "->",
          "left": {
            "type": "memberExpression",
            "operator": "->",
            "left": {
              "type": "var",
              "value": "t"
            },
            "right": {
              "type": "var",
              "value": "answers"
            }
          },
          "right": {
            "type": "call",
            "func": {
              "type": "var",
              "value": "add"
            },
            "args": [
              {
                "type": "objLiteral",
                "properties": [
                  {
                    "type": "literalAssignExpression",
                    "operator": ":",
                    "left": {
                      "type": "var",
                      "value": "id"
                    },
                    "right": {
                      "type": "num",
                      "value": 1
                    }
                  },
                  {
                    "type": "literalAssignExpression",
                    "operator": ":",
                    "left": {
                      "type": "var",
                      "value": "q1"
                    },
                    "right": {
                      "type": "str",
                      "value": "Vadim"
                    }
                  },
                  {
                    "type": "literalAssignExpression",
                    "operator": ":",
                    "left": {
                      "type": "var",
                      "value": "q2"
                    },
                    "right": {
                      "type": "str",
                      "value": "21"
                    }
                  }
                ]
              }
            ]
          }
        }
      ]
    }

    const astOfTestMembersWithLiteralExprCode = parse(TokenStream(InputStream(testMembersWithLiteralExprCode)))

    chai.expect(astOfTestMembersWithLiteralExprCode)
      .to.deep.equal(expectedResult)
  })


  it('condStatementSampleCode', function() {
    const condStatementSampleCode = `
      if (t->questions->amount > 2) {
        print("remove doesn\'t work")
      }
    `

    const expectedResult = {
      "type": "prog",
      "prog": [
        {
          "type": "ifStatement",
          "cond": {
            "type": "binaryExpression",
            "operator": ">",
            "left": {
              "type": "memberExpression",
              "operator": "->",
              "left": {
                "type": "memberExpression",
                "operator": "->",
                "left": {
                  "type": "var",
                  "value": "t"
                },
                "right": {
                  "type": "var",
                  "value": "questions"
                }
              },
              "right": {
                "type": "var",
                "value": "amount"
              }
            },
            "right": {
              "type": "num",
              "value": 2
            }
          },
          "then": {
            "type": "call",
            "func": {
              "type": "var",
              "value": "print"
            },
            "args": [
              {
                "type": "str",
                "value": "remove doesn't work"
              }
            ]
          }
        }
      ]
    }

    const astOfCondStatementSampleCode = parse(TokenStream(InputStream(condStatementSampleCode)))

    chai.expect(astOfCondStatementSampleCode)
      .to.deep.equal(expectedResult)
  })


  it('forEachSampleCode', function() {
    const forEachSampleCode = `
      forEach(t->questions as q) {
        print(q->description)
      }
    `

    const expectedResult = {
      "type": "prog",
      "prog": [
        {
          "type": "forEachStatement",
          "inner": {
            "type": "identifierExpression",
            "operator": "as",
            "left": {
              "type": "memberExpression",
              "operator": "->",
              "left": {
                "type": "var",
                "value": "t"
              },
              "right": {
                "type": "var",
                "value": "questions"
              }
            },
            "right": {
              "type": "var",
              "value": "q"
            }
          },
          "body": {
            "type": "call",
            "func": {
              "type": "var",
              "value": "print"
            },
            "args": [
              {
                "type": "memberExpression",
                "operator": "->",
                "left": {
                  "type": "var",
                  "value": "q"
                },
                "right": {
                  "type": "var",
                  "value": "description"
                }
              }
            ]
          }
        }
      ]
    }

    const astOfForEachSampleCode = parse(TokenStream(InputStream(forEachSampleCode)))

    chai.expect(astOfForEachSampleCode)
      .to.deep.equal(expectedResult)
  })


  it('fullCodeSample', function () {
    const fullCodeSample = `
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
  
    t->questions->add(q1)
    t->questions->add(q2)
    t->questions->add(q3)
    t->questions->remove(q3)
  
    # t->questions->amount 2
  
    if (t->questions->amount > 2) {
      print("remove doesn\'t work")
    }
  
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
  
    forEach(t->questions as q) {
      print(q->description)
    }
    
    forEach(t->answers as a) {
      print(a->some)
    }
  `

    const expectedResult = {
      "type": "prog",
      "prog": [
        {
          "type": "assignExpression",
          "operator": "=",
          "left": {
            "type": "testVar",
            "name": "t"
          },
          "right": {
            "type": "objLiteral",
            "properties": [
              {
                "type": "literalAssignExpression",
                "operator": ":",
                "left": {
                  "type": "var",
                  "value": "title"
                },
                "right": {
                  "type": "str",
                  "value": "My first test"
                }
              }
            ]
          }
        },
        {
          "type": "assignExpression",
          "operator": "=",
          "left": {
            "type": "questionVar",
            "name": "q1"
          },
          "right": {
            "type": "objLiteral",
            "properties": [
              {
                "type": "literalAssignExpression",
                "operator": ":",
                "left": {
                  "type": "var",
                  "value": "description"
                },
                "right": {
                  "type": "str",
                  "value": "What's your name"
                }
              }
            ]
          }
        },
        {
          "type": "assignExpression",
          "operator": "=",
          "left": {
            "type": "questionVar",
            "name": "q2"
          },
          "right": {
            "type": "objLiteral",
            "properties": [
              {
                "type": "literalAssignExpression",
                "operator": ":",
                "left": {
                  "type": "var",
                  "value": "description"
                },
                "right": {
                  "type": "str",
                  "value": "How old are you"
                }
              }
            ]
          }
        },
        {
          "type": "assignExpression",
          "operator": "=",
          "left": {
            "type": "questionVar",
            "name": "q3"
          },
          "right": {
            "type": "objLiteral",
            "properties": []
          }
        },
        {
          "type": "memberExpression",
          "operator": "->",
          "left": {
            "type": "memberExpression",
            "operator": "->",
            "left": {
              "type": "var",
              "value": "t"
            },
            "right": {
              "type": "var",
              "value": "questions"
            }
          },
          "right": {
            "type": "call",
            "func": {
              "type": "var",
              "value": "add"
            },
            "args": [
              {
                "type": "var",
                "value": "q1"
              }
            ]
          }
        },
        {
          "type": "memberExpression",
          "operator": "->",
          "left": {
            "type": "memberExpression",
            "operator": "->",
            "left": {
              "type": "var",
              "value": "t"
            },
            "right": {
              "type": "var",
              "value": "questions"
            }
          },
          "right": {
            "type": "call",
            "func": {
              "type": "var",
              "value": "add"
            },
            "args": [
              {
                "type": "var",
                "value": "q2"
              }
            ]
          }
        },
        {
          "type": "memberExpression",
          "operator": "->",
          "left": {
            "type": "memberExpression",
            "operator": "->",
            "left": {
              "type": "var",
              "value": "t"
            },
            "right": {
              "type": "var",
              "value": "questions"
            }
          },
          "right": {
            "type": "call",
            "func": {
              "type": "var",
              "value": "add"
            },
            "args": [
              {
                "type": "var",
                "value": "q3"
              }
            ]
          }
        },
        {
          "type": "memberExpression",
          "operator": "->",
          "left": {
            "type": "memberExpression",
            "operator": "->",
            "left": {
              "type": "var",
              "value": "t"
            },
            "right": {
              "type": "var",
              "value": "questions"
            }
          },
          "right": {
            "type": "call",
            "func": {
              "type": "var",
              "value": "remove"
            },
            "args": [
              {
                "type": "var",
                "value": "q3"
              }
            ]
          }
        },
        {
          "type": "ifStatement",
          "cond": {
            "type": "binaryExpression",
            "operator": ">",
            "left": {
              "type": "memberExpression",
              "operator": "->",
              "left": {
                "type": "memberExpression",
                "operator": "->",
                "left": {
                  "type": "var",
                  "value": "t"
                },
                "right": {
                  "type": "var",
                  "value": "questions"
                }
              },
              "right": {
                "type": "var",
                "value": "amount"
              }
            },
            "right": {
              "type": "num",
              "value": 2
            }
          },
          "then": {
            "type": "call",
            "func": {
              "type": "var",
              "value": "print"
            },
            "args": [
              {
                "type": "str",
                "value": "remove doesn't work"
              }
            ]
          }
        },
        {
          "type": "memberExpression",
          "operator": "->",
          "left": {
            "type": "memberExpression",
            "operator": "->",
            "left": {
              "type": "var",
              "value": "t"
            },
            "right": {
              "type": "var",
              "value": "answers"
            }
          },
          "right": {
            "type": "call",
            "func": {
              "type": "var",
              "value": "add"
            },
            "args": [
              {
                "type": "objLiteral",
                "properties": [
                  {
                    "type": "literalAssignExpression",
                    "operator": ":",
                    "left": {
                      "type": "var",
                      "value": "id"
                    },
                    "right": {
                      "type": "num",
                      "value": 1
                    }
                  },
                  {
                    "type": "literalAssignExpression",
                    "operator": ":",
                    "left": {
                      "type": "var",
                      "value": "q1"
                    },
                    "right": {
                      "type": "str",
                      "value": "Vadim"
                    }
                  },
                  {
                    "type": "literalAssignExpression",
                    "operator": ":",
                    "left": {
                      "type": "var",
                      "value": "q2"
                    },
                    "right": {
                      "type": "str",
                      "value": "21"
                    }
                  }
                ]
              }
            ]
          }
        },
        {
          "type": "memberExpression",
          "operator": "->",
          "left": {
            "type": "memberExpression",
            "operator": "->",
            "left": {
              "type": "var",
              "value": "t"
            },
            "right": {
              "type": "var",
              "value": "answers"
            }
          },
          "right": {
            "type": "call",
            "func": {
              "type": "var",
              "value": "add"
            },
            "args": [
              {
                "type": "objLiteral",
                "properties": [
                  {
                    "type": "literalAssignExpression",
                    "operator": ":",
                    "left": {
                      "type": "var",
                      "value": "id"
                    },
                    "right": {
                      "type": "num",
                      "value": 2
                    }
                  },
                  {
                    "type": "literalAssignExpression",
                    "operator": ":",
                    "left": {
                      "type": "var",
                      "value": "q1"
                    },
                    "right": {
                      "type": "str",
                      "value": "Max"
                    }
                  },
                  {
                    "type": "literalAssignExpression",
                    "operator": ":",
                    "left": {
                      "type": "var",
                      "value": "q2"
                    },
                    "right": {
                      "type": "str",
                      "value": "25"
                    }
                  }
                ]
              }
            ]
          }
        },
        {
          "type": "forEachStatement",
          "inner": {
            "type": "identifierExpression",
            "operator": "as",
            "left": {
              "type": "memberExpression",
              "operator": "->",
              "left": {
                "type": "var",
                "value": "t"
              },
              "right": {
                "type": "var",
                "value": "questions"
              }
            },
            "right": {
              "type": "var",
              "value": "q"
            }
          },
          "body": {
            "type": "call",
            "func": {
              "type": "var",
              "value": "print"
            },
            "args": [
              {
                "type": "memberExpression",
                "operator": "->",
                "left": {
                  "type": "var",
                  "value": "q"
                },
                "right": {
                  "type": "var",
                  "value": "description"
                }
              }
            ]
          }
        },
        {
          "type": "forEachStatement",
          "inner": {
            "type": "identifierExpression",
            "operator": "as",
            "left": {
              "type": "memberExpression",
              "operator": "->",
              "left": {
                "type": "var",
                "value": "t"
              },
              "right": {
                "type": "var",
                "value": "answers"
              }
            },
            "right": {
              "type": "var",
              "value": "a"
            }
          },
          "body": {
            "type": "call",
            "func": {
              "type": "var",
              "value": "print"
            },
            "args": [
              {
                "type": "memberExpression",
                "operator": "->",
                "left": {
                  "type": "var",
                  "value": "a"
                },
                "right": {
                  "type": "var",
                  "value": "some"
                }
              }
            ]
          }
        }
      ]
    }

    const astOfFullSampleCode = parse(TokenStream(InputStream(fullCodeSample)))

    chai.expect(astOfFullSampleCode)
      .to.deep.equal(expectedResult)
  })
})
