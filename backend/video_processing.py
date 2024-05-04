# check if each json file exists and create it if not
# loop through each video frame by fram
# input the words into the corresponding json NEED LEFT/RIGHT, COORDINATES, ALL FRAMES FOR NOW

import numpy as np
import os
import glob
import cv2
import mediapipe
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision



# def check_dictionary():
#     alpha = "abcdefghijklmnopqrstuvwxyz"
#     for i in range(len(alpha)):
#         os.path.isfile(f"dictionary/{alpha[i]}.json")


def index_video():
    word_list = []
    word_path = []
    print(os.getcwd())
    for name in glob.glob('videos/*.mp4'):
        word_path.append(name)

        file_mp4 = os.path.basename(name)
        file_name, mp4 = os.path.splitext(file_mp4)

        word_list.append(file_name)

    return word_list, word_path


def create_dictionary(word_list, word_path):
    alpha = "abcdefghijklmnopqrstuvwxyz"
    for i in range(len(alpha)):
        for j in range(len(word_list)):
            if word_list[j][0] == alpha[i]:
                video = cv2.VideoCapture(word_path[j])
                success, image = video.read()
                print(success)
                count = 0
                while success:
                    # PROCESS FRAME RIGHT HERE
                    # word_data = {"word": [[[coords], [coords], []], [[], [], []]], }
                    # word list --> left | right --> list of frames ea. -->
                    cv2.imwrite("frame%d.jpg" % count, image)  # save frame as JPEG file




                    # STEP 2: Create an HandLandmarker object.
                    base_options = python.BaseOptions(model_asset_path='hand_landmarker.task')
                    options = vision.HandLandmarkerOptions(base_options=base_options,
                                                           num_hands=2)
                    detector = vision.HandLandmarker.create_from_options(options)

                    # STEP 3: Load the input image.
                    image = mp.Image(image_format=mp.ImageFormat.SRGB, data=np.array(image))

                    # STEP 4: Detect hand landmarks from the input image.
                    detection_result = detector.detect(image)

                    # STEP 5: Process the classification result. In this case, visualize it.
                    coords = draw_landmarks_on_image(image.numpy_view(), detection_result)


                    print(coords)

                    success, image = video.read()
                    print('Read a new frame: ', success)
                    count += 1
                    break
                break
            break
        break

        # process video for that specific file
        # append to json etc


# @markdown We implemented some functions to visualize the hand landmark detection results. <br/> Run the following cell to activate the functions.

from mediapipe import solutions
from mediapipe.framework.formats import landmark_pb2
import numpy as np

MARGIN = 10  # pixels
FONT_SIZE = 1
FONT_THICKNESS = 1
HANDEDNESS_TEXT_COLOR = (88, 205, 54)  # vibrant green


def draw_landmarks_on_image(rgb_image, detection_result):
    # left --> 0, right --> 1
    coords = [[[], []], [[], []]]

    hand_landmarks_list = detection_result.hand_landmarks
    handedness_list = detection_result.handedness
    annotated_image = np.copy(rgb_image)

    # Loop through the detected hands to visualize.
    for idx in range(len(hand_landmarks_list)):
        hand_landmarks = hand_landmarks_list[idx]
        handedness = handedness_list[idx]



        # Get the top left corner of the detected hand's bounding box.
        height, width, _ = annotated_image.shape
        x_coordinates = [landmark.x for landmark in hand_landmarks]
        y_coordinates = [landmark.y for landmark in hand_landmarks]
        text_x = int(min(x_coordinates) * width)
        text_y = int(min(y_coordinates) * height) - MARGIN

        print("x-coords:", x_coordinates)
        print(len(x_coordinates))
        print(handedness[0].category_name)
        if handedness[0].category_name.lower() == "left":
            coords[0][0].append(x_coordinates)
            coords[0][1].append(y_coordinates)
        elif handedness[0].category_name.lower() == "right":
            coords[1][0].append(x_coordinates)
            coords[1][1].append(y_coordinates)

        # # Draw handedness (left or right hand) on the image.
        # cv2.putText(annotated_image, f"{handedness[0].category_name}",
        #             (text_x, text_y), cv2.FONT_HERSHEY_DUPLEX,
        #             FONT_SIZE, HANDEDNESS_TEXT_COLOR, FONT_THICKNESS, cv2.LINE_AA)

    return coords


print(index_video())

word_list, word_path = index_video()
create_dictionary(word_list, word_path)
