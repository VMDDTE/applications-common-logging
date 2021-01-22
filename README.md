[![Build Status](https://jenkins.vmduk.net/buildStatus/icon?job=NPM+libraries%2FApplicationCommonLogging.OnMerge)](https://jenkins.vmduk.net/job/NPM%20libraries/job/ApplicationCommonLogging.OnMerge/)
[![Quality Gate Status](https://sonarqube.vmduk.net/api/project_badges/measure?project=VMDDTE_applications-common-logging&metric=alert_status)](https://sonarqube.vmduk.net/dashboard?id=VMDDTE_applications-common-logging)

# applications-common-logging

VMD logging library for JavaScript applications

## Installation

```
npm i @vmd/logging
```

## Contribute

This library is written in TypeScript and uses JSDoc comments to document the code.

### Testing

You can run tests by running `npm test`. All new code should be covered with unit tests.

### Commit messages

This project uses Conventional Commits to version the package correctly and generate release notes. To find out more about Conventional Commits and how to use them, [click here](https://www.conventionalcommits.org/en/v1.0.0/).

You can generate valid commit messages by running `npm run commit` and following the instructions on your terminal window. Windows users should use the Bash terminal from the Windows Subsystem for Linux to run this.

All commit messages are run through a validator and any invalid commit messages will be rejected.
