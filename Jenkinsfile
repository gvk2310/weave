def label = "mypod-${UUID.randomUUID().toString()}"
def serviceaccount = "jenkins-admin"
podTemplate(label: label, serviceAccount: serviceaccount,
           containers: [containerTemplate(name: 'python3', image: 'python:3.7-buster', ttyEnabled: true, command: 'cat'),
						containerTemplate(name: 'kubectl', image: 'nexgtech/kubectl:1.15', ttyEnabled: true, command: 'cat'),
               containerTemplate(name: 'docker', image: 'docker:18.09.9', ttyEnabled: true, command: 'cat')],
				volumes: [hostPathVolume(hostPath: '/var/run/docker.sock', mountPath: '/var/run/docker.sock')])

{
    node(label)
    {
		def Commit_Id
		def DockerReg_Url='devnetops.azurecr.io'
		def DockerReg_Credentials='acr'
        def Docker_Image = 'usermgmt'
        def Image_Tag = 's1'
		def K8s_Deployment = 'usermgmt'
	    node(label) {
		try{
       stage('Git Checkout'){
            scmVars =  checkout([$class: 'GitSCM',
            branches: [[name: '*/feature/sprint1']], 
            doGenerateSubmoduleConfigurations: false, 
            extensions: [], 
            submoduleCfg: [], 
            userRemoteConfigs: [[credentialsId: 'raagitha_innersource', 
            url: 'https://innersource.accenture.com/scm/dnp/devnetops.git']]])
			this.Commit_Id = scmVars.GIT_COMMIT
			this.notifyBitbucket('INPROGRESS')
        }
        stage('Sonar Analysis'){
            withSonarQubeEnv('SonarQube') {
            withCredentials([usernamePassword(credentialsId: 'sonar', passwordVariable: 'password', usernameVariable: 'username')])
            {   def scannerHome = tool 'Sonar Scanner';
                sh "${scannerHome}/bin/sonar-scanner -Dsonar.login=$username -Dsonar.password=$password";
            }
        }
        }
		stage ('Quality Gate Check')
         {
            timeout(time: 5, unit: 'MINUTES') {
                waitForQualityGate abortPipeline: true
                }
         }
		 stage (' Create Docker image'){
			container('docker'){
			sh ('docker build -t ${DockerReg_Url}/${Docker_Image}:${Image_Tag} --network=host .')
			}
	
		}  
		stage('Pushing the Docker image to Container Registry') {
              container('docker') {		 
	             withCredentials([usernamePassword(credentialsId: ${DockerReg_Credentials}, passwordVariable: 'PASSWORD', usernameVariable: 'USERNAME')])
				 {
			     sh ('docker login -u ${USERNAME} -p ${PASSWORD} '+'${DockerReg_Url}')
				 sh ("docker push ${DockerReg_Url}/${Docker_Image}:${Image_Tag}")	
         }
             }
         }
		stage('Deploying to Kubernetes') {
				container('kubectl') {
				try{
					sh("kubectl get deployment ${K8s_Deployment}")
					if(true){
						sh ("kubectl set image deployment/${K8s_Deployment} ${K8s_Deployment}=${DockerReg_Url}/${Docker_Image}:${Image_Tag}") 
					}
				} 
				catch(e){
					sh("kubectl apply -f ${K8s_Deployment}")
					echo "deploying"
              }
			}
		}
		currentBuild.result = 'SUCCESS'
        echo "RESULT: ${currentBuild.result}"
        echo "Finished: ${currentBuild.result}"
		}
		 catch (Exception err) {
        currentBuild.result = 'FAILURE'
        echo "RESULT: ${currentBuild.result}"
        echo "Finished: ${currentBuild.result}"
               }
		finally {
            // Success or failure, always send notifications to bitbucket           
            this.notifyBitbucket(currentBuild.result)
        }

	}
}
}
def notifyBitbucket(String state) {
 
    if('SUCCESS' == state || 'FAILED' == state) {
    // Set result of currentBuild !Important!
        currentBuild.result = state
    }
 
    notifyBitbucket commitSha1: this.Commit_Id, considerUnstableAsSuccess: true, credentialsId: 'raagitha_innersource', disableInprogressNotification: false, ignoreUnverifiedSSLPeer: true, includeBuildNumberInKey: false, prependParentProjectKey: false, projectKey: '', stashServerBaseUrl: 'https://innersource.accenture.com/'
}
 
