import 'dotenv/config';
import express from 'express';
import axios from 'axios';
import {
  InteractionType,
  InteractionResponseType,
  InteractionResponseFlags,
  MessageComponentTypes,
  ButtonStyleTypes,
} from 'discord-interactions';
import { VerifyDiscordRequest } from './utils.js';
import {
  HasCommands,
  COMPS_COMMAND,
} from './commands.js';
import {
  getValidatedComps
} from './utilities.js';

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

app.post('/interactions', async function (req, res) {
  const { type, data } = req.body;

  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;

    if (name === 'comps') {
      const spe = encodeURIComponent(req.body.data.options[0].value);
      const proj = encodeURIComponent(req.body.data.options[1].value);
      const cookie = encodeURIComponent(req.body.data.options[2].value);

      const validatedComps = await getValidatedComps(spe, proj, cookie);
  
      const results = await axios.get(`https://nervous.fish/competencies-api/?project=${proj}&spe=${spe}`);

      let embed = {
        "type": "rich",
        "title": "",
        "description": "",
        "color": 0x005eff,
        "fields": [],
      };

      if (results.data.length <= 0) {
        const field = {
          "name": "No competencies were found for these parameters.",
          "value": "\u200B",
          "inline": true,
        };
        embed.fields.push(field);
      }

      results.data.forEach((comp) => {
        if (!validatedComps.find((x) => x.behaviorCode === comp.behavior.split('-')[0].trim())) {
          const field = {
            "name": comp.behavior,
            "value": "\u200B",
            "inline": true,
          };
          embed.fields.push(field);
        }
      });

      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          "content": "",
          "tts": false,
          "embeds": [embed],
        },
      });
    }
  }
});

app.listen(PORT, () => {
  console.log('Listening on port', PORT);

  HasCommands(process.env.APP_ID, [
    COMPS_COMMAND,
  ]);
});
