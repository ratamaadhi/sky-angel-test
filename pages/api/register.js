// Next.jsx API route support: https://nextjs.org/docs/api-routes/introduction
import { v1 as uuid } from 'uuid';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const player = req.body;
    let error;
    if (!player.name) {
      error.name = 'name must be not null';
    }
    const recordPlayer = player.record;
    delete player.record;
    player.id = uuid();
    const newRecord = [player, ...recordPlayer];
    if (typeof error === 'object' && Object.keys(error).length > 0) {
      return res.status(400).json({ message: 'failed', error });
    }

    return res.status(200).json({ data: newRecord });
  }

  return res.status(403).send('did not get');
}
