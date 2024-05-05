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
import json



# def check_dictionary():
#     alpha = "abcdefghijklmnopqrstuvwxyz"
#     for i in range(len(alpha)):
#         os.path.isfile(f"dictionary/{alpha[i]}.json")


def index_video():
    print("sdfdd")
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
        word_dict = {}
        for j in range(len(word_list)):
            if word_list[j][0] == alpha[i]:
                print(word_list[j])

                # word_dict[f'{word_list[j]}'] = [[[],[],[]], [[],[],[]]]
                word_dict[f'{word_list[j]}'] = []


                video = cv2.VideoCapture(word_path[j])
                success, image = video.read()
                print(success)
                count = 0
                while success:
                    # print(word_list[j])
                    # PROCESS FRAME RIGHT HERE
                    # word_data = {"word": [[[coords], [coords], []], [[], [], []]], }
                    # word list --> left | right --> list of frames ea. -->
                    # cv2.imwrite("frame%d.jpg" % count, image)  # save frame as JPEG file




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
                    coords = draw_landmarks_on_image(image.numpy_view(), detection_result, count)

                    # coords = [[[(),(),()], []], [[], []]]

                    # word_dict[word_list[j]][0][0].append(coords[0][0])
                    # word_dict[word_list[j]][0][1].append(coords[0][1])
                    # word_dict[word_list[j]][0][2].append(coords[0][2])


                    # word_dict[word_list[j]][1][0].append(coords[1][0])
                    # word_dict[word_list[j]][1][1].append(coords[1][1])
                    # word_dict[word_list[j]][1][2].append(coords[1][2])
                    word_dict[word_list[j]].append(coords)



                    success, image = video.read()
                    # print('Read a new frame: ', success)
                    count += 1

        # process into jsona nd save
        with open(f"dictionary/{alpha[i]}.json", "w") as outfile:
            json.dump(word_dict, outfile)




variable_name = False

from mediapipe import solutions
from mediapipe.framework.formats import landmark_pb2
import numpy as np

MARGIN = 10  # pixels
FONT_SIZE = 1
FONT_THICKNESS = 1
HANDEDNESS_TEXT_COLOR = (88, 205, 54)  # vibrant green


def draw_landmarks_on_image(rgb_image, detection_result, count):
    # coords = [{"frame": 1, "right": [[x, y, z], ... [z, y, x]], "left": []}, {"frame": 2, "right": [], "left": []}]
    coords = {"frame": count, "right": [], "left": []}


    hand_landmarks_list = detection_result.hand_landmarks
    handedness_list = detection_result.handedness
    annotated_image = np.copy(rgb_image)

    # Loop through the detected hands to visualize.
    for idx in range(len(hand_landmarks_list)):
        hand_landmarks = hand_landmarks_list[idx]
        handedness = handedness_list[idx]

        # Draw the hand landmarks.
        hand_landmarks_proto = landmark_pb2.NormalizedLandmarkList()
        hand_landmarks_proto.landmark.extend([
        landmark_pb2.NormalizedLandmark(x=landmark.x, y=landmark.y, z=landmark.z) for landmark in hand_landmarks
        ])
        solutions.drawing_utils.draw_landmarks(
        annotated_image,
        hand_landmarks_proto,
        solutions.hands.HAND_CONNECTIONS,
        solutions.drawing_styles.get_default_hand_landmarks_style(),
        solutions.drawing_styles.get_default_hand_connections_style())

        # Get the top left corner of the detected hand's bounding box.
        height, width, _ = annotated_image.shape
        x_coordinates = [landmark.x for landmark in hand_landmarks]
        y_coordinates = [landmark.y for landmark in hand_landmarks]
        z_coordinates = [landmark.z for landmark in hand_landmarks]



        if handedness[0].category_name.lower() == "left":
            for i in range(len(x_coordinates)):
                coords["right"].append([x_coordinates[i], y_coordinates[i], z_coordinates[i]])
            # coords[0][0] = x_coordinates
            # coords[0][1] = y_coordinates
            # coords[0][2] = z_coordinates

        elif handedness[0].category_name.lower() == "right":
            for i in range(len(x_coordinates)):
                coords["left"].append([x_coordinates[i], y_coordinates[i], z_coordinates[i]])
            # coords[0][0] = x_coordinates
            # coords["left"] =

            # coords[1][0] = x_coordinates
            # coords[1][1] = y_coordinates
            # coords[1][2] = z_coordinates

        # # Draw handedness (left or right hand) on the image.
        # cv2.putText(annotated_image, f"{handedness[0].category_name}",
        #             (text_x, text_y), cv2.FONT_HERSHEY_DUPLEX,
        #             FONT_SIZE, HANDEDNESS_TEXT_COLOR, FONT_THICKNESS, cv2.LINE_AA)
    return coords


print(index_video())

word_list, word_path = index_video()
create_dictionary(word_list, word_path)