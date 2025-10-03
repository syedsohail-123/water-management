from awscrt import mqtt, auth, io
from awsiot import mqtt_connection_builder
from awscrt.auth import AwsCredentialsProvider
import json
import boto3
from app.services.dynamodb_service import dynamodb_service

class MQTTService:
    def __init__(self):
        self.connection = None
        self.block_a_data = {"tank1": 0, "tank2": 0, "pump1": "OFF", "pump2": "OFF", "valve1": "CLOSED", "valve2": "CLOSED", "sump": 0}
        self.block_b_data = {"tank1": 0, "pump1": "OFF", "valve1": "CLOSED", "sump": 0}

    async def connect(self):
        event_loop_group = io.EventLoopGroup(1)
        host_resolver = io.DefaultHostResolver(event_loop_group)
        client_bootstrap = io.ClientBootstrap(event_loop_group, host_resolver)
        
        credentials_provider = auth.AwsCredentialsProvider.new_default_chain(client_bootstrap)
        
        self.connection = mqtt_connection_builder.websockets_with_default_aws_signing(
            endpoint="a3a6bcyydw1uzn-ats.iot.ap-south-1.amazonaws.com",
            region="ap-south-1",
            credentials_provider=credentials_provider,
            client_bootstrap=client_bootstrap,
            client_id="backend-" + str(id(self)),
            clean_session=True
        )
        
        connect_future = self.connection.connect()
        connect_future.result()
        print("✅ Connected to AWS IoT")
        
        subscribe_future_a, _ = self.connection.subscribe("block/A", mqtt.QoS.AT_LEAST_ONCE, self.on_block_a_message)
        subscribe_future_a.result()
        print("✅ Subscribed to block/A")
        
        subscribe_future_b, _ = self.connection.subscribe("block/B", mqtt.QoS.AT_LEAST_ONCE, self.on_block_b_message)
        subscribe_future_b.result()
        print("✅ Subscribed to block/B")

    def on_block_a_message(self, topic, payload, dup, qos, retain, **kwargs):
        print(f"📨 Received message on {topic}")
        print(f"Raw payload: {payload}")
        try:
            if isinstance(payload, bytes):
                data = json.loads(payload.decode('utf-8'))
            else:
                data = json.loads(payload)
            self.block_a_data = data
            dynamodb_service.save_block_data('blockA', data)
            print(f"✅ Block A updated: {data}")
        except Exception as e:
            print(f"❌ Error processing Block A: {e}")
            import traceback
            traceback.print_exc()

    def on_block_b_message(self, topic, payload, dup, qos, retain, **kwargs):
        print(f"📨 Received message on {topic}")
        print(f"Raw payload: {payload}")
        try:
            if isinstance(payload, bytes):
                data = json.loads(payload.decode('utf-8'))
            else:
                data = json.loads(payload)
            self.block_b_data = data
            dynamodb_service.save_block_data('blockB', data)
            print(f"✅ Block B updated: {data}")
        except Exception as e:
            print(f"❌ Error processing Block B: {e}")
            import traceback
            traceback.print_exc()

    async def disconnect(self):
        if self.connection:
            disconnect_future = self.connection.disconnect()
            disconnect_future.result()

    def get_block_a_data(self):
        return self.block_a_data

    def get_block_b_data(self):
        return self.block_b_data

mqtt_service = MQTTService()
