#!/usr/bin/env groovy
library 'status-jenkins-lib@v1.9.27'

pipeline {
  agent { label 'linux' }

  options {
    disableConcurrentBuilds()
    disableRestartFromStage()
    /* manage how many builds we keep */
    buildDiscarder(logRotator(
      numToKeepStr: '20',
      daysToKeepStr: '30',
    ))
  }

  environment {
    GIT_COMMITTER_NAME = 'status-im-auto'
    GIT_COMMITTER_EMAIL = 'auto@status.im'
  }

  stages {
    stage('Install') {
      steps {
        script {
          nix.develop('pnpm install')
        }
      }
    }

    stage('Build') {
      steps {
        script {
          nix.develop('pnpm build')
          jenkins.genBuildMetaJSON('out/build.json')
        }
      }
    }

    stage('Publish') {
      steps {
        sshagent(credentials: ['status-im-auto-ssh']) {
          script {
            nix.develop("""
              ghp-import \
                -b ${deployBranch()} \
                -c ${deployDomain()} \
                -p out
              """, pure: false)
            )
          }
        }
      }
    }
  }

  post {
    cleanup { cleanWs() }
  }
}

def isMasterBranch() { GIT_BRANCH ==~ /.*master/ }
def deployBranch() { isMasterBranch() ? 'deploy-master' : 'deploy-develop' }
def deployDomain() { isMasterBranch() ? 'contribute.logos.co' : 'dev-contribute.logos.co' }
def deployDomain() { isMasterBranch() ? 'logos.co' : 'dev.logos.co' }
