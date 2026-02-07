from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import auth, users, hr, inventory, crm, dashboard
from app.core.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(users.router, prefix=f"{settings.API_V1_STR}/users", tags=["users"])
app.include_router(hr.router, prefix=f"{settings.API_V1_STR}/hr", tags=["hr"])
app.include_router(inventory.router, prefix=f"{settings.API_V1_STR}/inventory", tags=["inventory"])
app.include_router(crm.router, prefix=f"{settings.API_V1_STR}/crm", tags=["crm"])
app.include_router(dashboard.router, prefix=f"{settings.API_V1_STR}/dashboard", tags=["dashboard"])

@app.get("/")
def root():
    return {"message": "Welcome to ERP v1 API"}
