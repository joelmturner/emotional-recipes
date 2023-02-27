// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
    data: {
        steps: string[];
    } | string;
  
} 

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    // Get data submitted in request's body.
    const body = req.body
  
    // Optional logging to see the responses
    // in the command line where next.js app is running.
    console.log('body: ', body)
    const keys = Object.keys(body);
  
    // Guard clause checks for first and last name,
    // and returns early if they are not found
    if (!keys.some(key => key.includes('step'))) {
      // Sends a HTTP bad request error code
      return res.status(400).json({ data: 'Steps not found' })
    }
    const steps: string[] = [];
    keys.sort().forEach((key) => {    
        if (key.includes('step')) {
            steps.push(body[key])
        }
    })
  res.status(200).json({ data: {
    steps
  } })
}
