const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
  async create(req, res) {
    const { name, email } = req.body;

    const recipient = await prisma.tb_recipients.findFirst({
      where: { email },
    });

    if (recipient) {
      return res.status(404).send({ message: 'Recipient already exists' });
    } else {
      const resp = await prisma.tb_recipients.create({
        data: { name, email },
      });

      res.status(200).send(resp);
    }
  },

  async delete(req, res) {
    const { email } = req.body;

    const recipient = await prisma.tb_recipients.findFirst({
      where: { email },
    });

    if (!recipient)
      return res.status(404).send({ message: 'Recipient not found' });

    const resp = await prisma.tb_recipients.delete({
      where: { id: recipient.id },
    });

    res.status(200).send(resp);
  },
};
