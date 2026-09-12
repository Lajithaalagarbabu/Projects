@echo off
setlocal

set "DIRNAME=%~dp0"
if "%DIRNAME:~-1%"=="\" set "DIRNAME=%DIRNAME:~0,-1%"
if "%DIRNAME%"=="" set "DIRNAME=."

set "MAVEN_PROJECTBASEDIR=%DIRNAME%"
set "WRAPPER_JAR=%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.jar"
set "WRAPPER_LAUNCHER=org.apache.maven.wrapper.MavenWrapperMain"

if not exist "%WRAPPER_JAR%" (
    echo Maven wrapper JAR not found at %WRAPPER_JAR%
    exit /b 1
)

set "JAVACMD=java"
if defined JAVA_HOME if exist "%JAVA_HOME%\bin\java.exe" (
    set "JAVACMD=%JAVA_HOME%\bin\java.exe"
)

"%JAVACMD%" "-Dmaven.multiModuleProjectDirectory=%MAVEN_PROJECTBASEDIR%" -classpath "%WRAPPER_JAR%" %WRAPPER_LAUNCHER% %*