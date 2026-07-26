import csv
import io

from fastapi import APIRouter, Depends, HTTPException, Response

from app.api.deps import current_user
from app.services.storage import SCANS

router = APIRouter(prefix="/reports", tags=["reports"], dependencies=[Depends(current_user)])


@router.get("/{scan_id}")
def export_report(scan_id: str, format: str = "json") -> Response:
    result = SCANS.get(scan_id)
    if not result:
        raise HTTPException(status_code=404, detail="Scan not found")
    if format == "json":
        return Response(result.model_dump_json(indent=2), media_type="application/json")
    if format == "csv":
        output = io.StringIO()
        writer = csv.DictWriter(output, fieldnames=["id", "tool", "category", "file_path", "line_number", "severity", "confidence", "explanation", "fix_recommendation"])
        writer.writeheader()
        for finding in result.findings:
            writer.writerow(finding.model_dump(exclude={"code"}))
        return Response(output.getvalue(), media_type="text/csv")
    raise HTTPException(status_code=400, detail="Unsupported report format")
