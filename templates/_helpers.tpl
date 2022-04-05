{{/*
Expand the name of the chart.
*/}}
{{- define "common.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "common.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "common.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create common host url based on with http/https based on condition in values.yaml
*/}}
{{- define "common.hostUrl" -}}
{{- if and (.Values.global.dns.enabled) (.Values.global.serveAsHttps) }}
{{- printf "https://%s" .Values.global.ingress.host | trimSuffix "/" }}
{{- else }}
{{- printf "http://%s" .Values.global.ingress.host | trimSuffix "/" }}
{{- end }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "common.labels" -}}
{{ include "common.appLabels" . }}
{{ include "common.selectorLabels" . }}
helm.sh/chart: {{ include "common.chart" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
app labels which is used to for appselector in service with the deployment/rs/sts 
*/}}
{{- define "common.appLabels" -}}
app: {{ include "common.fullname" . }}
name: {{ include "common.fullname" . }}
{{- end }}

{{/*
Selector labels
*/}}

{{- define "common.selectorLabels" -}}
app.kubernetes.io/name: {{ include "common.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Return the appropriate apiVersion for Deployment.
*/}}
{{- define "deployment.apiVersion" -}}
{{- if semverCompare ">=1.9-0" .Capabilities.KubeVersion.GitVersion -}}
{{- print "apps/v1" -}}
{{- else -}}
{{- print "extensions/v1beta1" -}}
{{- end -}}
{{- end -}}

{{/*
Return the appropriate apiVersion for StatefulSet.
*/}}
{{- define "statefulset.apiVersion" -}}
{{- if semverCompare ">=1.9-0" .Capabilities.KubeVersion.GitVersion -}}
{{- print "apps/v1" -}}
{{- else -}}
{{- print "extensions/v1beta1" -}}
{{- end -}}
{{- end -}}


{{/*
Return the appropriate apiVersion for Ingress.
*/}}
{{- define "ingress.apiVersion" -}}
{{- if semverCompare ">=1.8-0" .Capabilities.KubeVersion.GitVersion -}}
{{- print "networking.k8s.io/v1beta1" -}}
{{- else -}}
{{- print "extensions/v1beta1" -}}
{{- end -}}
{{- end -}}


{{/*
Create the name of the PVC to use
*/}}
{{- define "common.persistenceName" -}}
{{- if .Values.persistence.enabled }}
{{- default (include "common.fullname" .) .Values.persistence.name }}
{{- else }}
{{- default "default" .Values.persistence.name }}
{{- end }}
{{- end }}

{{/*
Create the name of the Custom PVC to use
*/}}
{{- define "common.customPersistenceName" -}}
{{- if .Values.customPersistence.enabled }}
{{- default (include "common.fullname" .) .Values.customPersistence.name }}
{{- else }}
{{- default "default" .Values.customPersistence.name }}
{{- end }}
{{- end }}


{{/*
Create the name of the secret to use
*/}}
{{- define "common.secretName" -}}
{{- if .Values.secret.create }}
{{- default (include "common.fullname" .) .Values.secret.name }}
{{- else }}
{{- default "default" .Values.secret.name }}
{{- end }}
{{- end }}


{{/*
Create the name of the configmap to use
*/}}
{{- define "common.configmapName" -}}
{{- if .Values.configmap.create }}
{{- default (include "common.fullname" .) .Values.configmap.name }}
{{- else }}
{{- default "default" .Values.configmap.name }}
{{- end }}
{{- end }}


{{/*
Create the name of the service account to use
*/}}
{{- define "common.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "common.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}


{{/*
Create the name of the role to use
*/}}
{{- define "common.roleName" -}}
{{- if .Values.role.create }}
{{- default (include "common.fullname" .) .Values.role.name }}
{{- else }}
{{- default "default" .Values.role.name }}
{{- end }}
{{- end }}

{{/*
Create the name of the rolebinding to use
*/}}
{{- define "common.rolebindingName" -}}
{{- if .Values.rolebinding.create }}
{{- default (include "common.fullname" .) .Values.rolebinding.name }}
{{- else }}
{{- default "default" .Values.rolebinding.name }}
{{- end }}
{{- end }}

{{/*
Create the name of the clusterRole to use
*/}}
{{- define "common.clusterRoleName" -}}
{{- if .Values.clusterRole.create }}
{{- default (include "common.fullname" .) .Values.clusterRole.name }}
{{- else }}
{{- default "default" .Values.clusterRole.name }}
{{- end }}
{{- end }}

{{/*
Create the name of the clusterRolebinding to use
*/}}
{{- define "common.clusterRolebindingName" -}}
{{- if .Values.clusterRolebinding.create }}
{{- default (include "common.fullname" .) .Values.clusterRolebinding.name }}
{{- else }}
{{- default "default" .Values.clusterRolebinding.name }}
{{- end }}
{{- end }}


Create the name of the postInstallJob to use
*/}}
{{- define "common.postInstallJobName" -}}
{{- if .Values.postInstallJob.create }}
{{- default (include "common.fullname" .) .Values.postInstallJob.name }}
{{- else }}
{{- default "default" .Values.postInstallJob.name }}
{{- end }}
{{- end }}


Create the name of the postInstallConfigmap to use
*/}}
{{- define "common.postInstallConfigmapName" -}}
{{- if .Values.postInstallConfigmap.create }}
{{- default (include "common.fullname" .) .Values.postInstallConfigmap.name }}
{{- else }}
{{- default "default" .Values.postInstallConfigmap.name }}
{{- end }}
{{- end }}



Create the name of the preInstallJob to use
*/}}
{{- define "common.preInstallJobName" -}}
{{- if .Values.preInstallJob.create }}
{{- default (include "common.fullname" .) .Values.preInstallJob.name }}
{{- else }}
{{- default "default" .Values.preInstallJob.name }}
{{- end }}
{{- end }}


Create the name of the preInstallConfigmap to use
*/}}
{{- define "common.preInstallConfigmapName" -}}
{{- if .Values.preInstallConfigmap.create }}
{{- default (include "common.fullname" .) .Values.preInstallConfigmap.name }}
{{- else }}
{{- default "default" .Values.preInstallConfigmap.name }}
{{- end }}
{{- end }}

