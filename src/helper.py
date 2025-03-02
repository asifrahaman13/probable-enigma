import random


def generate_6_digit_code():
    return str(random.randint(100000, 999999))


def dict_to_text(data: dict):
    text = ""
    for key, value in data.items():
        text += f"{key}: {value}\n"
    return text
