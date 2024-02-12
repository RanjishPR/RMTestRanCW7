#!/usr/bin/env groovy

//@Library(['piper-lib', 'piper-lib-os']) _
//sapPiperPipeline script: this

@Library('piper-lib-os') _

echo BRANCH_NAME
if (BRANCH_NAME == "master") {
    stage ( "Build and Deploy Docs" ) {
        node {
            deleteDir()

            checkout scm
            def repo = sh(script: "git remote get-url origin", returnStdout: true).trim()

            // Transfer ".git" directory to docker
            withCredentials([usernamePassword(credentialsId: 'GITHUB_USER_PASSWORD', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PAT')]) {
                withEnv(["GIT_CREDENTIALS_CONFIG=--config credential.helper=${env.WORKSPACE}/bin/internal/git-env-credentials"]) {
                    sh "git config --global --list"
                    sh "git config credential.helper ${env.WORKSPACE}/bin/internal/git-env-credentials"
                    sh "git fetch -- '${repo}' +refs/heads/*:refs/remotes/origin/*"

                    sh "mv .git git"
                    lock( resource: "${env.JOB_NAME}/${env.BRANCH_NAME}", inversePrecedence: true ) {
                        dockerExecute(dockerImage: 'docker.wdf.sap.corp:50000/weberstephanhd/iacbox2', dockerWorkspace: '/workspace', script: this) {
                            sh "mkdir /workspace"
                            sh "chmod 777 /workspace"
                            sh "git config --global --add safe.directory \$(pwd)"
                            sh "mv git .git"
                            sh "git branch -r"
                            sh "npm install"
                            //sh "npm run test"
                            sh "node ./bin/internal/virtual-env.js"
                            sh "./bin/internal/update-docs-repo-url.js '${repo}'"
                            sh "./bin/internal/update-mkdocs-repo-url.js '${repo}'"
                            sh "./bin/internal/build-examples-md.js"
                            sh "./bin/internal/build-modules-md.js"

                            sh "./bin/internal/jenkins-build"
                        }

                        sh "./docs/push-doc '${repo}'"
                        sh "./bin/internal/build-external-repository '${repo}'"
                    }
                }
            }
        }
    }
}
