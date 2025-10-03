import boto3
from datetime import datetime
from decimal import Decimal

class DynamoDBService:
    def __init__(self):
        self.dynamodb = boto3.resource('dynamodb', region_name='ap-south-1')
        self.table = self.dynamodb.Table('dashboard-update')
    
    def save_block_data(self, block_name, data):
        try:
            timestamp = datetime.utcnow().isoformat()
            item = {
                'org_id': block_name,
                'timestamp': timestamp,
            }
            # Convert data to DynamoDB compatible format
            for k, v in data.items():
                if isinstance(v, (int, float)):
                    item[k] = Decimal(str(v))
                else:
                    item[k] = str(v)
            
            response = self.table.put_item(Item=item)
            print(f"💾 Saved {block_name} to DynamoDB: {item}")
            print(f"DynamoDB Response: {response}")
            
            # Verify by reading back (with sort key)
            verify = self.table.get_item(Key={'org_id': block_name, 'timestamp': timestamp})
            if 'Item' in verify:
                print(f"✅ Verified: Data exists in DynamoDB")
            else:
                print(f"⚠️ Warning: Data not found in DynamoDB after save")
        except Exception as e:
            print(f"❌ DynamoDB save error: {e}")
            print(f"Table name: {self.table.table_name}")
            print(f"Region: ap-south-1")
            import traceback
            traceback.print_exc()
    
    def get_recent_data(self, block_name, limit=100):
        # Query with sort key to get historical data
        try:
            response = self.table.query(
                KeyConditionExpression='org_id = :org_id',
                ExpressionAttributeValues={':org_id': block_name},
                ScanIndexForward=False,
                Limit=limit
            )
            return response.get('Items', [])
        except Exception as e:
            print(f"❌ Error getting data: {e}")
            return []

dynamodb_service = DynamoDBService()
