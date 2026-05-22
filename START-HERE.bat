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
echo TERMINAL 2 - Customer Service (port 8081):
echo   $env:PATH = "C:\Users\arvin\tools\apache-maven-3.9.6\bin;$env:PATH"
echo   cd c:\Users\arvin\Documents\BankManagementSystemSprint\customer-service
echo   mvn spring-boot:run
echo.
echo TERMINAL 3 - Bank Service (port 8083):
echo   $env:PATH = "C:\Users\arvin\tools\apache-maven-3.9.6\bin;$env:PATH"
echo   cd c:\Users\arvin\Documents\BankManagementSystemSprint\bank-service
echo   mvn spring-boot:run
echo.
echo TERMINAL 4 - Transaction Service (port 8084):
echo   $env:PATH = "C:\Users\arvin\tools\apache-maven-3.9.6\bin;$env:PATH"
echo   cd c:\Users\arvin\Documents\BankManagementSystemSprint\transaction-service
echo   mvn spring-boot:run
echo.
echo TERMINAL 5 - Auth Service (port 8085):
echo   $env:PATH = "C:\Users\arvin\tools\apache-maven-3.9.6\bin;$env:PATH"
echo   cd c:\Users\arvin\Documents\BankManagementSystemSprint\auth-service
echo   mvn spring-boot:run
echo   (Seeds default manager: manager1 / manager123)
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
echo.
echo   Auth Swagger:        http://localhost:8085/swagger-ui.html
echo   Customer Swagger:    http://localhost:8081/swagger-ui.html
echo   Bank Swagger:        http://localhost:8083/swagger-ui.html
echo   Transaction Swagger: http://localhost:8084/swagger-ui.html
echo.
echo   Auth H2 DB:          http://localhost:8085/h2-console (JDBC: jdbc:h2:mem:authdb)
echo   Customer H2 DB:      http://localhost:8081/h2-console
echo   Bank H2 DB:          http://localhost:8083/h2-console
echo   Transaction H2 DB:   http://localhost:8084/h2-console
echo.
echo =====================================================
echo   DEFAULT LOGIN CREDENTIALS
echo =====================================================
echo.
echo   Manager Login:  manager1 / manager123
echo   Customer Login: Use SSN ID + password (set during registration)
echo.
echo =====================================================
echo   TO STOP: Press Ctrl+C in each terminal
echo =====================================================
pause
