from app.core.database import SessionLocal
from app.models.core import User
from app.core import security

db = SessionLocal()
user = db.query(User).filter(User.email == "admin@erp.com").first()
if user:
    print(f"User: {user.email}")
    try:
        match = security.verify_password("admin123", user.password_hash)
        print(f"Verify 'admin123': {match}")
    except Exception as e:
        print(f"Error: {e}")
else:
    print("User not found")
db.close()
