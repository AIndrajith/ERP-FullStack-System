from typing import List, Union
from pydantic import AnyHttpUrl, validator
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "ERP v1"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "SET_YOUR_SECRET_KEY"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    
    # MySQL
    MYSQL_SERVER: str = "localhost"
    MYSQL_USER: str = "erp_user"
    MYSQL_PASSWORD: str = "erp_password"
    MYSQL_DB: str = "erp_db"
    MYSQL_PORT: int = 3306
    DATABASE_URL: str = ""

    @validator("DATABASE_URL", pre=True)
    def assemble_db_connection(cls, v: str, values: dict) -> str:
        if isinstance(v, str) and v:
            return v
        return f"mysql+mysqldb://{values.get('MYSQL_USER')}:{values.get('MYSQL_PASSWORD')}@{values.get('MYSQL_SERVER')}:{values.get('MYSQL_PORT')}/{values.get('MYSQL_DB')}"

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
