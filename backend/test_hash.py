from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
plain_pwd = "admin123"

# Generate new hash
new_hash = pwd_context.hash(plain_pwd)
print(f"Generated Hash: {new_hash}")

# Verify new hash
try:
    result = pwd_context.verify(plain_pwd, new_hash)
    print(f"Match: {result}")
except Exception as e:
    print(f"Error: {e}")
