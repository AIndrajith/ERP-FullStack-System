from sqlalchemy.orm import Session
from app.models.core import AuditLog
from typing import Any, Optional

def log_action(
    db: Session,
    actor_id: Optional[int],
    action: str,
    entity_type: str,
    entity_id: Optional[int] = None,
    metadata_json: Optional[dict] = None
):
    log = AuditLog(
        actor_user_id=actor_id,
        action=action,
        entity_type=entity_type,
        entity_id=entity_id,
        metadata_json=metadata_json
    )
    db.add(log)
    db.commit()
    return log
