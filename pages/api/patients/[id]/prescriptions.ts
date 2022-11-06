import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { id } = req.query
    try {
      console.log(id)
      //   const prescription = await prisma.prescription.findMany({
      //     where: {
      //       patientId: patientId
      //     },
      //     include: {
      //       Location: true,
      //       LockerBox: true
      //     }
      //   })
      // }
      res.status(200).json({ message: 'Success' })
    } catch (e) {
      res.status(400).json({ message: 'Bad Request', error: e })
    }
  } else {
    res.status(405).json({ message: `Method: ${req.method} Not Allowed` })
  }
}