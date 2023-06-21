import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  MqttContext,
  Payload,
} from '@nestjs/microservices';

@Controller('math')
export class MqttController {
  //testing notifications
  @MessagePattern('temperature_channel')
  getNotifications(@Payload() data: string, @Ctx() context: MqttContext) {
    const pack = context.getPacket();
    console.log(pack);
    return `Received : ${data} from topic ${context.getTopic()}`;
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
