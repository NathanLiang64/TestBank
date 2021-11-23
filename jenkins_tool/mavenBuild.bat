@echo off
echo ¶}©l°õ¦æmaven build
del build /S /Q & "./node/node.exe" "./node_modules/react-scripts/bin/react-scripts.js" build & "./apache-maven-3.8.1/bin/mvn" clean package -nsu -o -Dmaven.repo.local=repository -P%1 -DskipTests