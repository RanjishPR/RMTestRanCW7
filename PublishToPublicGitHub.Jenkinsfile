#!/usr/bin/env groovy

//@Library(['piper-lib', 'piper-lib-os']) _
//sapPiperPipeline script: this

@Library('piper-lib-os') _

echo BRANCH_NAME
if (BRANCH_NAME == "master") {
    stage ( "Publish to GitHub.com" ) {
        node {
            deleteDir()

            checkout scm
            withCredentials([usernamePassword(credentialsId: 'GITHUB_USER_PASSWORD', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PAT')]) {
                withCredentials([usernamePassword(credentialsId: 'PUBLIC_GITHUB_USER_PASSWORD', usernameVariable: 'PUBLIC_GIT_USER', passwordVariable: 'PUBLIC_GIT_PAT')]) {
                    sh "./bin/internal/push-external"
                }
            }
        }
    }
}