const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { sendMail } = require('../services/mail');

module.exports = {
  async create(req, res) {
    const {
      manager_cpf,
      store_name,
      store_cnpj,
      store_owner_name,
      store_owner_email,
      store_owner_phone,
      tag_number,
    } = req.body;

    const recipients = await prisma.tb_recipients.findMany();

    const resp = await prisma.tb_managers.create({
      data: {
        manager_cpf,
        store_name,
        store_cnpj,
        store_owner_name,
        store_owner_email,
        store_owner_phone,
        tag_number,
      },
    });

    for (const recipient of recipients) {
      const html = `
      <main>
        <div>
          <h4>Olá, ${
            recipient.name.split(' ')[0]
          }. Aqui estão os dados da nova loja cadastrada:</h4>
        </div>
        <div>
          <b>CPF do gestor: <span style="font-weight: normal;">${
            resp?.manager_cpf
          }</span></b><br/>
          <b>Nome da loja: <span style="font-weight: normal;">${
            resp?.store_name
          }</span></b><br/>
          <b>CNPJ: <span style="font-weight: normal;">${
            resp?.store_owner_name
          }</span></b><br/>
          <b>Nome do responsável:  <span style="font-weight: normal;">${
            resp?.store_cnpj
          }</span></b><br/>
          <b>E-mail do responsável: <span style="font-weight: normal;">${
            resp?.store_owner_email
          }</span></b><br/>
          <b>Telefone do responsável:  <span style="font-weight: normal;">${
            resp?.store_owner_phone
          }</span></b><br/>
          <b>Números das TAGS:  <span style="font-weight: normal;">${
            resp?.tag_number
          }</span></b><br/>
        </div>
        </div>
      </main>
      `;

      sendMail(recipient.email, html, 'Nova loja cadastrada pelo gestor');
    }

    res.status(200).send(resp);
  },
};
