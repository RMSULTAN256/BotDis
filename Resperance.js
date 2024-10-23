import RPC from 'discord-rpc';
import dotenv from 'dotenv';

dotenv.config();

const clientId = '1186879847792906301';  // Replace with your Discord app's client ID

const rpc = new RPC.Client({ transport: 'ipc' });

export const startRichPresence = () => {
  rpc.on('ready', () => {
    rpc.setActivity({
      details: 'Trying to find..',
      state: 'Process..',
      startTimestamp: new Date(),
      largeImageKey: 'idwin',  // Your uploaded large image key
      largeImageText: 'I will win!',
      buttons: [
        { label: "Donate", url: "https://saweria.co/Linx256" }  // Optional button
      ]
    });

    console.log('Rich Presence is now active!');
  });

  rpc.on('error', (error) => {
    console.log('RPC error', error);
  });

  rpc.on('disconnected', () => {
    console.log('Disconnected from discord')
  })

  rpc.login({ clientId }).catch(console.error);
};

startRichPresence();