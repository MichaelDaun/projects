import userModel from '../model/usermodel.js'
import snippetModel from '../model/snippetmodel.js'

const createTestDbEntries = async () => {
  console.log('Creating test entries for database...')

  await userModel.deleteAll()
  await snippetModel.deleteAll()

  await userModel.add('alice', 'password123')
  await userModel.add('bob', 'securepass')
  await userModel.add('charlie', 'passw0rd')
  await userModel.add('bengan', 'test123')

  console.log('Users added')

  await snippetModel.add(
    "console.log('Hello, world!');",
    'Hello World in JS',
    'JavaScript',
    'bob',
    'Beginner',
    'Console'
  )

  await snippetModel.add(
    "console.log('Hello, world!');",
    'Hello World in JS',
    'JavaScript',
    'bob',
    'Beginner',
    'Console'
  )

  await snippetModel.add(
    "console.log('Hello, world!');",
    'Hello World in JS',
    'JavaScript',
    'bob',
    'Beginner',
    'Console'
  )

  await snippetModel.add(
    "console.log('Hello, world!');",
    'Hello World in JS',
    'JavaScript',
    'bob',
    'Beginner',
    'Console'
  )

  await snippetModel.add(
    "console.log('Hello, world!');",
    'Hello World in JS',
    'JavaScript',
    'bob',
    'Beginner',
    'Console'
  )

  await snippetModel.add(
    "print('Hello, Python!')",
    'Hello Python',
    'Python',
    'bob',
    'Beginner',
    'Print'
  )

  await snippetModel.add(
    'SELECT * FROM users;',
    'Fetch All Users',
    'SQL',
    'bob',
    'Database',
    'Query'
  )

  await snippetModel.add(
    '<html>\n<head><title>My First Page</title></head>\n<body>\n<h1>Hello World</h1>\n</body>\n</html>',
    'Simple HTML Page',
    'HTML',
    'bob',
    'Frontend',
    'Beginner'
  )

  await snippetModel.add(
    'function factorial(n) {\n  if (n === 0) return 1;\n  return n * factorial(n - 1);\n}',
    'Factorial Function',
    'JavaScript',
    'bob',
    'Algorithm',
    'Recursion'
  )

  await snippetModel.add(
    'def fibonacci(n):\n  a, b = 0, 1\n  for _ in range(n):\n    print(a)\n    a, b = b, a + b',
    'Fibonacci Series',
    'Python',
    'bob',
    'Math',
    'Sequence'
  )

  await snippetModel.add(
    'public class HelloWorld {\n  public static void main(String[] args) {\n    System.out.println("Hello, World!");\n  }\n}',
    'Hello World in Java',
    'Java',
    'bob',
    'Beginner',
    'OOP'
  )

  const overflowString = 'Overflow Test Snippet \n'.repeat(100)

  await snippetModel.add(
    overflowString,
    'Overflow Test Snippet',
    'Python',
    'bob',
    'UI-Test',
    'Overflow'
  )

  await snippetModel.add(
    "echo 'Hello, Bash!'\nfor i in {1..5}; do\n  echo \"Number $i\"\ndone",
    'Simple Bash Script',
    'Bash',
    'bob',
    'Scripting',
    'Linux'
  )

  await snippetModel.add(
    'const add = (a, b) => a + b;\nconsole.log(add(5, 3));',
    'Arrow Function in JS',
    'JavaScript',
    'bob',
    'Beginner',
    'Functional'
  )

  console.log('Test snippets added')
}

export default createTestDbEntries
