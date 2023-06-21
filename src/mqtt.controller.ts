import { Controller } from '@nestjs/common';
import {
  ClientProxyFactory,
  Ctx,
  MessagePattern,
  MqttContext,
  Payload,
  Transport,
} from '@nestjs/microservices';

@Controller('math')
export class MqttController {
  private mqttClient: any;

  constructor() {
    this.mqttClient = ClientProxyFactory.create({
      transport: Transport.MQTT,
      options: {
        url: 'mqtt://localhost:1883',
      },
    });
  }
  @MessagePattern('temperature_channel')
  async getTemperature(@Payload() data: number, @Ctx() context: MqttContext) {
    const newTemp = data + 20;
    const newData = `Received: ${data} from topic ${context.getTopic()} and changed it to ${newTemp}`;

    // Publish the new data to a new topic
    await this.mqttClient.emit('processed_temperature_channel', newTemp);

    return newData;
  }
  //using an object
  @MessagePattern('device')
  getDevice(@Payload() data, @Ctx() context: MqttContext): string {
    return `Received from client : ${JSON.stringify(
      data,
    )} from topic ${context.getTopic()}`;
  }

  //using wild cards
  @MessagePattern('device/+')
  getDeviceNotification(@Payload() data, @Ctx() context: MqttContext) {
    const id = context.getTopic().split('/')[1]; // getting the device
    return `Received : ${JSON.stringify(
      data,
    )} from topic ${context.getTopic()}`;
  }
}

// check packet
// {const packet = context.getPacket();
//   console.log(packet);

//   // Convert the payload buffer to a string
//   const payloadString = packet.payload.toString('utf8');
//   console.log(payloadString);

//   // Parse the payload string as JSON if needed
//   try {
//     const payloadObject = JSON.parse(payloadString);
//     console.log(payloadObject);
//   } catch (error) {
//     console.error('Error parsing payload:', error);
//   }}
