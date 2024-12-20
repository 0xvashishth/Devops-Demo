# Circle CI Setup


### Create an account on CircleCI

- Signup with your email
- Verify your account
- Create your organisation

### Create Project

### Create Pipeline

### Create Trigger

### Commit the code again, and The bulid will run

### Configuration File for Sample `.circleci/config.yml`
```yaml
version: 2.1
orbs:
  node: circleci/node@5.1.0

jobs:
  build_and_test:
    executor:
      name: node/default
      tag: '18.16'
    steps:
      - checkout             
      - run: node --version
      - node/install-packages:
          pkg-manager: npm
      - run:
          command: npm install
          name: Installing dependencies
      - run:
          command: npm test
          name: Run unit tests

workflows:
  build_and_test_app:
    jobs:
      - build_and_test
```