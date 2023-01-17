import os
import io
import base64
from PIL import Image
import numpy as np
import tensorflow as tf
import json
import psycopg2

from flask import Flask, send_file, request
from flask_cors import CORS

from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

@app.route('/api/predicciones', methods=['POST'])
# Función para realizar la predicción
def predict():

    conn = psycopg2.connect(
        host=os.getenv('DB_HOST'),
        database=os.getenv('DB_NAME'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD')
    )

    cur = conn.cursor()

    usuarios_id_usuario = request.json['usuarios_id_usuario']

    pacientes_id_paciente = request.json['pacientes_id_paciente']

    retino_imagen = request.json['retino_imagen']

    image_data = base64.b64decode(retino_imagen)

    model_path = os.path.join(os.getcwd(), 'models', 'resnet.h5')

    try:
        image = []
        # Codigo para abrir las imagenes
        img = Image.open(io.BytesIO(image_data))
        #Redimensionando la imagen al valor de entrada (224,224)
        img = img.resize((224, 224))
        # Se agrega la imagen a la lista de imagenes
        image.append(img)
        # Convirtiendo la imagen a array
        img = np.asarray(img, dtype=np.float32)
        # Normalizando la imagen
        img = img / 255
        # Remodelando la imagen a una matriz 4D
        img = img.reshape(-1, 224, 224, 3)
        # Cargar el modelo
        model = tf.keras.models.load_model(model_path)
        # Realizar la predicción del modelo
        predict = model.predict(img)
        # Obtener el índice correspondiente al valor más alto en la predicción
        predict = np.argmax(predict)
        # Agregar etiquetas a las predicciones
        if predict == 0:
            predict = 'Retinopatía diabética leve'
        elif predict == 1:
            predict = 'Retinopatía diabética moderada'
        elif predict == 2:
            predict = 'No presenta retinopatía diabética'
        elif predict == 3:
            predict = 'Retinoapatía diabética proliferativa'
        elif predict == 4:
            predict = 'Retinopatía diabética severa'

        # Insertar los datos en la base de datos
        query = "INSERT INTO diagnosticos (fecha_diagnostico, retino_imagen, usuarios_id_usuario, pacientes_id_paciente, retino_diagnostico) VALUES (CURRENT_DATE, %s, %s, %s, %s)"

        cur.execute(query, (retino_imagen, usuarios_id_usuario, pacientes_id_paciente, predict))

        conn.commit()

        conn.close()

        result = {'Usuario': usuarios_id_usuario,'Paciente': pacientes_id_paciente, 'Prediction': predict}
        return json.dumps(result)
    except:
        return json.dumps({'error': 'Error al realizar la predicción, el usuario o paciente no se encuentra en nuestra base de datos'}, 400)

if __name__ == '__main__':
    app.run()
