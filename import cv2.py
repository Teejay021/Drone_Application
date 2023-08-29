import cv2

for i in range(10):
    cap = cv2.VideoCapture(i)
    if cap.isOpened():
        print(f"Camera index {i}: {cap.get(cv2.CAP_PROP_BACKEND)}")
        cap.release()