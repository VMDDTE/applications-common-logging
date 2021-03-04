def sendCommitStatus(status, description) {
  script {
    withCredentials([
      usernamePassword(
        credentialsId: 'VMDIT_Github_Access_Token',
        usernameVariable: 'GITHUB_USERNAME',
        passwordVariable: 'GITHUB_ACCESS_TOKEN'
      )
    ]) {
      dir("$WORKSPACE/jenkins-jobs/scripts/tooling") {
        sh """ python3 ./github-status-check.py VMDDTE/$REPOSITORY $COMMIT_HASH "$status" "" "$description" "ApplicationCommonLogging.OnPush" """
      }
    }
  }
}

def failStep(message) {
  sendCommitStatus('failure', message)

  currentBuild.result = 'FAILURE'

  error(message)
}

pipeline {
  agent any

  environment {
    NEXUS_AUTH_TOKEN = credentials('NEXUS_AUTH_TOKEN_JENKINS')
  }

  options {
    ansiColor('xterm')
  }

  stages {
    stage('Checkout and set up tooling') {
      steps {
        dir("$WORKSPACE/jenkins-jobs") {
          git(
            branch: 'develop',
            credentialsId: 'VMDIT_Github_Credentials',
            url: 'https://github.com/VMDDTE/jenkins-jobs.git'
          )
        }
      }
    }

    stage('Install dependencies') {
      steps {
        script {
          try {
            println 'Install dependencies'
            sh 'npm ci'
          } catch (Exception e) {
            failStep('Unable to install dependencies')
          }
        }
      }
    }

    stage('Test code') {
      steps {
        script {
          try {
            println 'Lint code'
            sh 'npm run lint'
          } catch (Exception e) {
            failStep('Code has failed to lint')
          }

          try {
            println 'Run tests'
            sh 'npm test'
          } catch (Exception e) {
            failStep('Unit tests have failed')
          }
        }
      }
    }

    stage('Build library') {
      steps {
        script {
          try {
            println 'Build library'
            sh 'npm run build'
          } catch (Exception e) {
            failStep('Unable to build library')
          }
        }
      }
    }

    stage('Validate results') {
      steps {
        sendCommitStatus('success', "Tests have ran successfully for ${COMMIT_HASH}")
      }
    }
  }
}
