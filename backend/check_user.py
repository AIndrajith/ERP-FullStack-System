from app.core.database import SessionLocal
from app.models.core import User

db = SessionLocal()
user = db.query(User).filter(User.email == "admin@erp.com").first()
if user:
    print(f"User: {user.email}")
    print(f"Hash: {user.password_hash}")
    print(f"Hash length: {len(user.password_hash)}")
else:
    print("User not found")
db.close()
