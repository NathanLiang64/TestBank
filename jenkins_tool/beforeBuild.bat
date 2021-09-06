@echo off

:: 此為REACT專案, 先判斷當前工作目錄使否含有node_modules
if exist node_modules (
echo 當前工作目錄已有node_modules
) else (
echo node_modules 不存在, 使用7z解壓縮...
"c:\program files\7-zip\7z.exe" -y x ".\jenkins_tool\node_modules.7z"
)

:: 複製對應環境的設定檔(設定對外homepage)
echo 複製%1環境的設定檔(設定webView對外homepage, api url)
xcopy ".\jenkins_tool\package-%1.json" ".\package.json" /y
xcopy ".\jenkins_tool\.env-%1" ".\.env" /y

:: 判斷當前工作目錄使否含有node執行檔
if exist node (
echo 當前工作目錄已含有node執行檔
) else (
echo 當前工作目錄沒有node執行檔, 使用7z解壓縮
"c:\program files\7-zip\7z.exe" -y x ".\jenkins_tool\node.7z"
)

:: 判斷當前工作目錄使否含有maven執行檔
if exist apache-maven-3.8.1 (
echo 當前工作目錄已含有maven執行檔, 開始執行%1包版...
".\jenkins_tool\mavenBuild.bat" %1
) else (
echo 當前工作目錄沒有maven執行檔, 使用7z解壓縮並開始執行%1包版...
"c:\program files\7-zip\7z.exe" -y x ".\jenkins_tool\maven_for_react.7z" & ".\jenkins_tool\mavenBuild.bat" %1
)