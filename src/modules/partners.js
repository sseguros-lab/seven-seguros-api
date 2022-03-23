const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
  async create(req, res) {
    const {
      store_name,
      client_phone,
      client_email,
      client_address_cep,
      client_address_number,
      tag_number,
      user_document,
      vehicle_document,
    } = req.body;

    const resp = await prisma.tb_partners.create({
      data: {
        store_name,
        client_phone,
        client_email,
        client_address_cep,
        client_address_number,
        tag_number,
        user_document,
        vehicle_document,
      },
    });

    res.status(200).send(resp);
  },
};
