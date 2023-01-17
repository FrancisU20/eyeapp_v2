# Eyeapp

## Requerimientos
- Node JS v18
- PostgreSQL v15

## Tecnologías
La aplicación EyeApp esta desarrollada bajo las tecnologías:
- Postgres 
- Express 
- React 
- Node
- Material UI

## Antecedentes
El enfoque principal de la aplicación es solucionar la problemática de la Asociación Ecuatoriana de Diabétes (AED) al momento de realizar análisis de retinografías para la detección de Retinopatía Diabética en pacientes de esta institución para ello se ha entrenado un modelo de aprendizaje automático mediante Redes Neuronales Convolucionales (CNN) y guardado un modelo con un accuracy del 80% en la clasificación de 5-clases o tipos de dicha patología.

## Instalación 
El proyecto consta de 3 servidores:
- Web FrontEnd (React)
- Web Backend (Node)
- Web IA (Python)

Para realizar una instación correcta clone este repositorio, cree un archivo .env y coloque las variables de entorno siguiendo esta plantilla:

- DB_USER = your_db_user
- DB_PASSWORD = your_db_password
- DB_HOST = your_host
- DB_PORT = your_db_port
- DB_NAME = your_db_name
- SECRET_KEY = your_secret_key (jwt)

El paso a seguir es crear una base de datos en postgres para ello cree una nueva base de datos y ejecute el script ubicado en database/database.sql alojado en este repositorio.

Para instalar los modulos ejecute en las carpetas frontend y backend el siguiente comando:
- npm install

## Ejecución
- FrontEnd:
```
cd frontend
npm start
```

- BackEnd:
```
cd backen
npm run dev
```

- Server:
```
cd server/src
python app.py
```

### Autor: Francisco Mateo Ulloa Terán
### Contacto: +593998630405
