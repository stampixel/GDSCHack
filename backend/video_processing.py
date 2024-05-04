# check if each json file exists and create it if not
# loop through each video frame by fram
# input the words into the corresponding json NEED LEFT/RIGHT, COORDINATES, ALL FRAMES FOR NOW

import numpy as np
import os
import glob


def check_dictionary():
    alpha = "abcdefghijklmnopqrstuvwxyz"
    for i in range(len(alpha)):
        os.path.isfile(f"dictionary/{alpha[i]}.json")


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
        for word in word_list:
            if word[0] == alpha[i]:
                # process video for that specific file
                # append to json etc



print(index_video())

word_list, word_path = index_video()
