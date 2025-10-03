from fastapi import APIRouter, Body
from app.services.mqtt_service import mqtt_service
from app.services.dynamodb_service import dynamodb_service

router = APIRouter()

@router.get("/blocks")
def get_blocks():
    data = {
        "blockA": mqtt_service.get_block_a_data(),
        "blockB": mqtt_service.get_block_b_data()
    }
    print(f"📤 API called, returning: {data}")
    return data

@router.get("/history/{block_name}")
def get_history(block_name: str, limit: int = 100):
    return dynamodb_service.get_recent_data(block_name, limit)

@router.post("/control")
def control_device(command: dict = Body(...)):
    # Publish control command to AWS IoT
    # command format: {"block": "blockA", "device": "pump1", "action": "ON"}
    return {"status": "command sent", "command": command}
