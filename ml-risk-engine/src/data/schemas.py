from pydantic import BaseModel
from typing import Optional, Dict, Any

class AnalyzeRequest(BaseModel):
    invoice_id: str
    invoice_data: Optional[Dict[str, Any]] = None
