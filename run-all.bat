@echo off
echo =====================================================
echo   Starting Bank Management System Services...
echo =====================================================
echo.
echo Note: This script uses Windows Terminal (wt.exe) to open tabs.
echo If you don't have Windows Terminal installed, this script might fail.
echo.
echo Setting Maven path...
set "PATH=C:\Users\arvin\tools\apache-maven-3.9.6\bin;%PATH%"

echo Launching all services in a single window with multiple tabs...

cd /d "%~dp0"

wt new-tab --title "Eureka Server" -d .\eureka-server cmd /k "mvn spring-boot:run" ; new-tab --title "Customer Service" -d .\customer-service cmd /k "echo Waiting 15s for Eureka... && timeout /t 15 >nul && mvn spring-boot:run" ; new-tab --title "Bank Service" -d .\bank-service cmd /k "echo Waiting 15s for Eureka... && timeout /t 15 >nul && mvn spring-boot:run" ; new-tab --title "Transaction Service" -d .\transaction-service cmd /k "echo Waiting 15s for Eureka... && timeout /t 15 >nul && mvn spring-boot:run" ; new-tab --title "Auth Service" -d .\auth-service cmd /k "echo Waiting 15s for Eureka... && timeout /t 15 >nul && mvn spring-boot:run" ; new-tab --title "Angular UI" -d .\bank-management-ui cmd /k "npm start"


echo.
echo =====================================================
echo All services have been launched in separate tabs!
echo It may take another 30 seconds for all services to connect.
echo =====================================================
echo.
echo Application URLs:
echo Angular UI:          http://localhost:4200
echo Eureka Dashboard:    http://localhost:8761
echo.
echo Swagger UI (API Docs):
echo Auth:        http://localhost:8085/swagger-ui.html
echo Customer:    http://localhost:8081/swagger-ui.html
echo Bank:        http://localhost:8083/swagger-ui.html
echo Transaction: http://localhost:8084/swagger-ui.html
echo.
pause
