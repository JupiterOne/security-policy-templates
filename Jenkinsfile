#!groovy

pipeline {
  agent none

  stages {
    stage('build') {
      when { branch 'main' }
      agent { label 'ecs-builder-node14' }
      steps {
        initBuild()
        sh 'cp -r templates ./deploy'
        sh 'jupiterone-build'
        sh 'jupiterone-publish'
      }
    }
    stage('deploy') {
      when { branch 'main' }
      agent { label 'ecs-builder-node14' }
      steps {
        deployToJupiterEnvironments (
          autoPopulateCM: [jiraComponent: 'Cloud Platform']
        )
      }
    }

  }
}
