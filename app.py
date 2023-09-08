from flask import Flask, render_template, Response, request, jsonify
import cv2
import odrive
from odrive.enums import *
import subprocess
import base64
import threading


app = Flask(__name__)

capturing_image = False
camera = cv2.VideoCapture(0)

# def get_usb_camera_index():
#     return 0

def configure_camera_resolution(video_capture):
    video_capture.set(cv2.CAP_PROP_FRAME_WIDTH, 1920)
    video_capture.set(cv2.CAP_PROP_FRAME_HEIGHT, 1080)


def generate_frames():

    while True:
        success, frame = camera.read()
        if not success:
            break
        else:
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
            
            
def capture_photo():
    success, frame = camera.read()
    if success:
        ret, buffer = cv2.imencode('.jpg', frame)
        if ret:
            image_base64 = base64.b64encode(buffer).decode('utf-8')
            return image_base64
    return None
    

def process_capture():
    try:
        image_base64 = capture_photo()
        if image_base64:
            response = {'image': image_base64}
        else:
            response = {'error': 'Failed to capture image'}
    except Exception as e:
        response = {'error': f'Error capturing image: {str(e)}'}
    return response





@app.route('/')
def index():
    return render_template('index.html')

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/process_movement', methods=['POST'])
def process_movement():

    data = request.json  # Assumes the data is sent as JSON in the request body
    user_movement = data.get('movement')
    handle_java_input(user_movement)
    result = f"You entered: {user_movement}"
    return jsonify({'result': result})

@app.route('/capture_photo', methods=['POST'])
def call_capture_photo():

    image_base64 = capture_photo()

    if image_base64:
        response = {'image': image_base64}
    else:
        response = {'error': 'Failed to capture image'}

    return jsonify(response)


def connect_to_odrive():
    odrv0 = odrive.find_any()
    return odrv0


def main(movement):
    odrv0 = connect_to_odrive()

    if odrv0:
        if movement == "ArrowUp":
            if odrv0.axis0.controller.input_vel != 10:  # Check if it's not already set
                odrv0.axis0.controller.input_vel = 10

        elif movement == "ArrowDown":
            if odrv0.axis0.controller.input_vel != -10:  # Check if it's not already set
                odrv0.axis0.controller.input_vel = -10

        elif movement == "keyup":
            if odrv0.axis0.controller.input_vel != 0:  # Check if it's not already set
                odrv0.axis0.controller.input_vel = 0


    
def run_odrive_command(command):
    try:
        result = subprocess.run(command, capture_output=True, text=True, shell=True)
        if result.returncode == 0:
            return result.stdout.strip()  # Process the command output as needed
        else:
            print("Error executing ODrive command:", result.stderr)
            return None
    except Exception as e:
        print("An error occurred:", e)
        return None


def handle_java_input(input_string):

    main(input_string)




if __name__ == '__main__':
    
    app.run(host='0.0.0.0', port=5001, debug=True, threaded=True)