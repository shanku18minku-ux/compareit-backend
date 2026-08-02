@echo off
set "JAVA_HOME=C:\Program Files\Android\Android Studio\jbr"
set "PATH=%JAVA_HOME%\bin;%PATH%"
echo JAVA_HOME set to: %JAVA_HOME%
java -version
cd android
call gradlew.bat bundleRelease
cd ..
