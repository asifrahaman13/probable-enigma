import uuid


def generate_6_digit_code():
    return str(uuid.uuid4())[:6]
