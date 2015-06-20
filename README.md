# vacaciones-permanentes

Integrantes: <br />
José Di Meglio <br />
Javier Presti

Práctica de Desarrollo de Software <br />
UNQ - 2015s1

# Instrucciones

Iniciar servidor

      npm start o en modo desarrollo NODE_ENV=development npm start

Correr los tests Protractor

      npm install -g protractor
      webdriver-manager update
      NODE_ENV=development npm start &
      protractor protractor.config.js

Correr los tests Nodeunit

      NODE_ENV=development grunt nodeunit

Correr los tests Jasmine

      grunt jasmine
	  
Inyectar dependenciar con wiredep

      grunt wiredep
