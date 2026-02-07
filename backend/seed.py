from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine
from app.models.core import User, Role, Permission, user_roles, role_permissions
from app.models.hr import Department
from app.core.security import get_password_hash
from app.core.database import Base

def seed():
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Define permissions
        permissions_data = [
            ("users.read", "Read users"),
            ("users.write", "Create/Update users"),
            ("roles.read", "Read roles"),
            ("roles.write", "Update roles"),
            ("audit.read", "Read audit logs"),
            ("hr.employees.read", "Read employees"),
            ("hr.employees.write", "Manage employees"),
            ("hr.departments.read", "Read departments"),
            ("hr.departments.write", "Manage departments"),
            ("hr.leave.read", "Read leave requests"),
            ("hr.leave.submit", "Submit leave requests"),
            ("hr.leave.approve", "Approve/Reject leave requests"),
            ("inv.products.read", "Read products"),
            ("inv.products.write", "Manage products"),
            ("inv.stock.transact", "Perform stock transactions"),
            ("crm.customers.read", "Read customers"),
            ("crm.customers.write", "Manage customers"),
            ("crm.leads.read", "Read leads"),
            ("crm.leads.write", "Manage leads"),
            ("crm.opportunities.read", "Read opportunities"),
            ("crm.opportunities.write", "Manage opportunities"),
            ("dashboard.read", "Read dashboard"),
        ]
        
        db_perms = {}
        for code, desc in permissions_data:
            perm = db.query(Permission).filter(Permission.code == code).first()
            if not perm:
                perm = Permission(code=code, description=desc)
                db.add(perm)
                db.flush()
            db_perms[code] = perm

        # Define Roles
        roles_data = {
            "ADMIN": list(db_perms.keys()),
            "MANAGER": [
                "dashboard.read", "hr.employees.read", "hr.leave.read", "hr.leave.approve",
                "inv.products.read", "inv.stock.transact", "crm.customers.read", "crm.leads.read", "crm.opportunities.read"
            ],
            "EMPLOYEE": [
                "dashboard.read", "hr.leave.read", "hr.leave.submit", "inv.products.read"
            ]
        }

        db_roles = {}
        for role_name, perms in roles_data.items():
            role = db.query(Role).filter(Role.name == role_name).first()
            if not role:
                role = Role(name=role_name)
                db.add(role)
                db.flush()
            
            # Update permissions
            role.permissions = [db_perms[p] for p in perms]
            db_roles[role_name] = role

        # Create Users
        users_to_create = [
            ("admin@erp.com", "admin123", "ADMIN"),
            ("manager@erp.com", "manager123", "MANAGER"),
            ("employee@erp.com", "employee123", "EMPLOYEE"),
        ]

        for email, pwd, role_name in users_to_create:
            user = db.query(User).filter(User.email == email).first()
            if not user:
                user = User(
                    email=email,
                    password_hash=get_password_hash(pwd),
                    is_active=True
                )
                db.add(user)
                db.flush()
                user.roles.append(db_roles[role_name])
            else:
                user.password_hash = get_password_hash(pwd)

        # Create some departments
        depts = ["IT", "HR", "Sales", "Operations"]
        for dname in depts:
            if not db.query(Department).filter(Department.name == dname).first():
                db.add(Department(name=dname))

        db.commit()
        print("Database seeded successfully!")
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed()
