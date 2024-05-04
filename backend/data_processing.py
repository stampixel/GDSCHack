# Get most common words from the json
import json
import numpy as np
import urllib.request


def sanitize_word(words):
    """
    Sanitizes words
    :param words:
    :return:
    """
    for word in words:
        if word.__contains__(" "):
            words.remove(word)
            continue
    return words


def download_video(words):
    words = words[3000:]
    # default_link = "https://www.handspeak.com/word/[1ST LETTER]/[FIRST 3 LETTERS]/[WORD].mp4"

    for i, word in enumerate(words):
        try:
            urllib.request.urlretrieve(f"https://www.handspeak.com/word/{word[0]}/{word[:3]}/{word}.mp4", f'videos/{word}.mp4')
        except Exception as e:
            # print(e)
            print(f"Word {word} not found in database!")
            continue
    print("Video download complete!")


def parse_video(words):
    """
    Parses video into vector form of words
    :param words:
    :return:
    """
    pass


# Word obtained from the open sourced Monkeytype website
with open('english_5k.json', 'r') as data:
    data = json.load(data)
    words = sanitize_word(data["words"])
    download_video(words)

print(len(words))

# sanitize the strings
# Use link method in order to pasrse the wesite and download all the sign language videos
