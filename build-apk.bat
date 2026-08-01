@echo off
set "JAVA_HOME=C:\Program Files\Android\Android Studio\jbr"
call npm run build
call npx cap sync android
cd android
call gradlew.bat assembleDebug
cd ..
copy /y "android\app\build\outputs\apk\debug\app-debug.apk" "C:\Users\HP\Desktop\CompareIt.apk"
echo APK has been successfully copied to your Desktop!
