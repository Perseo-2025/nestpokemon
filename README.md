<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Ejecutar en desarrollo

1. Clonar el repositorio
2. Ejecutar 
```
npm run install
```
3. Tener Nest CLI instalado
```
npm i -g @nestjs/cli
```

# Arrancar Docker Desktop
4. Levantar la base de datos
```
docker-compose up -d
```

5. Clonar el archvio __.env.template__ y renombrar la copia __.env__

6. Llenar la variable de entorno definidas en el ```.env```

7. Ejecutar la aplicación en de:
```
npm run start:dev
```

8. Reconstruir la base de datos con la semilla
```
http://localhost:3000/api/v2/seed
```
```
http://localhost:3000/api/v2/pokemon
```
## Stack usado
* MongoDB
* NestJs

# Production Buid
1. Crear el archivo __.env.prod__
2. Llenar las varibales de entorno de prod
3. Crear la nueva imagen 
```
 docker-compose -f docker-compose.prod.yaml --env-file .env.prod up --build   
```


# Notas
Heroku redeploy sin cambios
```
git commit --allow-empty -m "Tigger Heroku deploy"
git push heroku <master|main>
```
