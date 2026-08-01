@echo off
rmdir /s /q android\capacitor-cordova-android-plugins\build
rmdir /s /q android\app\build

set JAVA_HOME=C:\Program Files\Android\Android Studio\jbr
cd android
call gradlew :capacitor-cordova-android-plugins:assembleDebug
call gradlew :app:assembleDebug
cd ..
"C:\Users\HP\AppData\Local\Android\Sdk\platform-tools\adb.exe" install -r android\app\build\outputs\apk\debug\app-debug.apk
