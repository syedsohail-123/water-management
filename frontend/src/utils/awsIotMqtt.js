import { iot, mqtt } from 'aws-iot-device-sdk-v2';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-provider-cognito-identity';
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';

export const createIoTClient = async () => {
  try {
    const region = 'ap-south-1';
    const endpoint = 'a3a6bcyydw1uzn-ats.iot.ap-south-1.amazonaws.com';
    const identityPoolId = 'ap-south-1:ebfec4ff-ba7a-40a3-8cad-a1fa1cddd259';

    console.log('Getting credentials...');
    const credentialsProvider = fromCognitoIdentityPool({
      client: new CognitoIdentityClient({ region }),
      identityPoolId
    });

    const creds = await credentialsProvider();
    console.log('Credentials obtained:', creds.accessKeyId);

    const config = iot.AwsIotMqttConnectionConfigBuilder.new_with_websockets()
      .with_clean_session(true)
      .with_client_id('dashboard-' + Math.random().toString(36).substr(2, 9))
      .with_endpoint(endpoint)
      .with_credentials(region, creds.accessKeyId, creds.secretAccessKey, creds.sessionToken)
      .build();

    console.log('Creating MQTT client...');
    const client = new mqtt.MqttClient();
    return client.new_connection(config);
  } catch (error) {
    console.error('Error creating IoT client:', error);
    throw error;
  }
};