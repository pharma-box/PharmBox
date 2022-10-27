// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const { lockerId } = req.query
      const id = lockerId?.toString() || ''

      if (!id) {
        res.status(400).json({ message: 'Empty Request' })
      }
      const int_id = parseInt(id)

      const lockers = await prisma.locker.findUnique({
        where: { id: int_id },
        include: { lockerBoxes: true, Location: true }
      })
      res.status(200).json({ message: ' Success', lockers: lockers })
    } catch (e) {
      res.status(400).json({ message: 'Bad Request', error: e })
    }
  } else {
    res.status(405).json({ message: `Method: ${req.method} Not Allowed` })
  }
}