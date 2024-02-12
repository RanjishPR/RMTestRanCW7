#!/usr/bin/env groovy

//@Library(['piper-lib', 'piper-lib-os']) _
//sapPiperPipeline script: this

@Library('piper-lib-os') _

stage ( "Mirror CPAppDevelopment val to rel" ) {
    node {
        deleteDir()
        checkout scm

        withCredentials([usernamePassword(credentialsId: 'GITHUB_USER_PASSWORD', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PASSWORD')]) {
            lock( resource: "${env.JOB_NAME}", inversePrecedence: true ) {
                    sh "./bin/internal/mirror-val-to-rel"
            }
        }
    }
}