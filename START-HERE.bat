@echo off
echo =====================================================
echo   BANK MANAGEMENT SYSTEM - Complete Startup Guide
echo =====================================================
echo.
echo PREREQUISITES (Already installed on your machine):
echo   - Java 25 (or 21)
echo   - Node.js 22 + npm 10.7
echo   - Maven 3.9.6 (at C:\Users\arvin\tools\apache-maven-3.9.6)
echo.
echo IMPORTANT: In EVERY terminal, first run this to set Maven path:
echo   $env:PATH = "C:\Users\arvin\tools\apache-maven-3.9.6\bin;$env:PATH"
echo.
echo =====================================================
echo   START SERVICES IN THIS ORDER (6 terminals needed)
echo =====================================================
echo.
echo TERMINAL 1 - Eureka Server (START FIRST, wait 20 sec):
echo   $env:PATH = "C:\Users\arvin\tools\apache-maven-3.9.6\bin;$env:PATH"
echo   cd c:\Users\arvin\Documents\BankManagementSystemSprint\eureka-server
echo   mvn spring-boot:run
echo   (Wait until you see "Started EurekaServerApplication")
echo.
echo TERMINAL 2 - Customer Service:
echo   $env:PATH = "C:\Users\arvin\tools\apache-maven-3.9.6\bin;$env:PATH"
echo   cd c:\Users\arvin\Documents\BankManagementSystemSprint\customer-service
echo   mvn spring-boot:run
echo.
echo TERMINAL 3 - Employee Service:
echo   $env:PATH = "C:\Users\arvin\tools\apache-maven-3.9.6\bin;$env:PATH"
echo   cd c:\Users\arvin\Documents\BankManagementSystemSprint\employee-service
echo   mvn spring-boot:run
echo.
echo TERMINAL 4 - Bank Service:
echo   $env:PATH = "C:\Users\arvin\tools\apache-maven-3.9.6\bin;$env:PATH"
echo   cd c:\Users\arvin\Documents\BankManagementSystemSprint\bank-service
echo   mvn spring-boot:run
echo.
echo TERMINAL 5 - Transaction Service:
echo   $env:PATH = "C:\Users\arvin\tools\apache-maven-3.9.6\bin;$env:PATH"
echo   cd c:\Users\arvin\Documents\BankManagementSystemSprint\transaction-service
echo   mvn spring-boot:run
echo.
echo TERMINAL 6 - Angular Frontend:
echo   cd c:\Users\arvin\Documents\BankManagementSystemSprint\bank-management-ui
echo   npm start
echo.
echo =====================================================
echo   KEY URLs (open in browser after all services start)
echo =====================================================
echo.
echo   Angular UI:          http://localhost:4200
echo   Eureka Dashboard:    http://localhost:8761
echo   Customer Swagger:    http://localhost:8081/swagger-ui.html
echo   Employee Swagger:    http://localhost:8082/swagger-ui.html
echo   Bank Swagger:        http://localhost:8083/swagger-ui.html
echo   Transaction Swagger: http://localhost:8084/swagger-ui.html
echo   Customer H2 DB:      http://localhost:8081/h2-console
echo   Employee H2 DB:      http://localhost:8082/h2-console
echo   Bank H2 DB:          http://localhost:8083/h2-console
echo   Transaction H2 DB:   http://localhost:8084/h2-console
echo.
echo =====================================================
echo   TO STOP: Press Ctrl+C in each terminal
echo =====================================================
pause
