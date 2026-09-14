@REM ----------------------------------------------------------------------------
@REM Maven Start Up Batch script
@REM ----------------------------------------------------------------------------
@echo off
setlocal

set DIRNAME=%~dp0
if "%DIRNAME%" == "" set DIRNAME=.
set MAVEN_PROJECTBASEDIR=%DIRNAME%

set MAVEN_WRAPPER_JAR="%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.jar"
set MAVEN_CONFIG_FILE="%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.properties"

@REM Check Java
if "%JAVA_HOME%" == "" (
  set JAVA_EXE=java
) else (
  set JAVA_EXE="%JAVA_HOME%\bin\java.exe"
)

%JAVA_EXE% -jar %MAVEN_WRAPPER_JAR% %*
