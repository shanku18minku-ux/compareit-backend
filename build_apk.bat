@echo off
set "JAVA_HOME=C:\Program Files\Android\Android Studio\jbr"
set "PATH=%JAVA_HOME%\bin;%PATH%"
echo Java Home: %JAVA_HOME%
"%JAVA_HOME%\bin\java.exe" -version
cd /d "C:\Users\HP\Desktop\New folder\android"
call gradlew.bat assembleDebug --no-daemon
echo BUILD DONE: %ERRORLEVEL%
