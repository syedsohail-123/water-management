from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.api.mqtt import router as mqtt_router
from app.services.mqtt_service import mqtt_service

@asynccontextmanager
async def lifespan(app: FastAPI):
    await mqtt_service.connect()
    yield
    await mqtt_service.disconnect()

app = FastAPI(title="IoT Dashboard API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(mqtt_router, prefix="/api")

@app.get("/")
def root():
    return {"message": "IoT Dashboard API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
