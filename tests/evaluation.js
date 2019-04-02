describe('Evaluation', function() {
  let globalEnv
  beforeEach(() => {
    globalEnv = new Environment()
  })

  it('testVariableAssignCode', function() {
    const testVariableAssignCode = `
      test t = [
        title: "My first test",
      ]
    `

    const expectedResult = {
      "vars": {
        "t": {
          "title": "My first test",
          "questions": {
            "items": [],
            "amount": 0
          },
          "answers": {
            "items": [],
            "amount": 0
          }
        }
      },
    }

    const astOfTestVariableAssignCode = parse(TokenStream(InputStream(testVariableAssignCode)))
    evaluate(astOfTestVariableAssignCode, globalEnv)

    chai.expect(JSON.stringify(globalEnv))
      .to.equal(JSON.stringify(expectedResult))
  })


  it('questionVariableAssignCode', function() {
    const questionVariableAssignCode = `
      question q1 = [
        description: "What's your name",
      ]
    `

    const expectedResult = new Environment()
    expectedResult.vars = {
      q1: {
        description: 'What\'s your name',
      }
    }
  
    const astOfQuestionVariableAssignCode = parse(TokenStream(InputStream(questionVariableAssignCode)))
    evaluate(astOfQuestionVariableAssignCode, globalEnv)

    chai.expect(globalEnv)
      .to.deep.equal(expectedResult)
  })


  it('fullCodeSample', function () {
    const fullCodeSample = `
      test t = [
        title: "My first test",
      ]
      question q1 = [
        description: "What's your name?",
      ]
      question q2 = [
        description: "How old are you?",
      ]
      question q3 = []
      t->questions->add(q1)
      t->questions->add(q2)
      t->questions->add(q3)
      t->questions->remove(q3)
    
      # print("amount", t->questions->amount) 2
    
      if (t->questions->amount > 1) {
        print("questions amount more than 1")
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
    
      forEach(t->questions->items as q) {
        print(q->description)
      }
    
      forEach(t->answers->items as a) {
        print(q1->description, a->q1)
      }
    `

    const expectedResult = new Environment()
    expectedResult.vars = {
      "t": {
        "title": "My first test",
        "questions": {
          "items": [
            {
              "description": "What's your name?"
            },
            {
              "description": "How old are you?"
            }
          ],
          "amount": 2
        },
        "answers": {
          "items": [
            {
              "id": 1,
              "q1": "Vadim",
              "q2": "21"
            },
            {
              "id": 2,
              "q1": "Max",
              "q2": "25"
            }
          ],
          "amount": 2
        }
      },
      "q1": {
        "description": "What's your name?"
      },
      "q2": {
        "description": "How old are you?"
      },
      "q3": {}
    }
  
    const astOfFullCodeSampleCode = parse(TokenStream(InputStream(fullCodeSample)))
    evaluate(astOfFullCodeSampleCode, globalEnv)

    chai.expect(JSON.stringify(globalEnv))
      .to.equal(JSON.stringify(expectedResult))
  })
})
