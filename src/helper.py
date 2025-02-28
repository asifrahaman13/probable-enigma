import random


def generate_6_digit_code():
    return str(random.randint(100000, 999999))
