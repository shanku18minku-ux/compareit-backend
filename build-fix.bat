@echo off
set "JAVA_HOME=C:\Program Files\Android\Android Studio\jbr"
echo JAVA_HOME set to: %JAVA_HOME%
call npx cap sync android
cd android
call gradlew.bat assembleDebug
cd ..
echo.
echo Installing APK...
"C:\Users\HP\AppData\Local\Android\Sdk\platform-tools\adb.exe" install -r "android\app\build\outputs\apk\debug\app-debug.apk"
"C:\Users\HP\AppData\Local\Android\Sdk\platform-tools\adb.exe" shell monkey -p com.compareit.app -c android.intent.category.LAUNCHER 1
echo Done!
