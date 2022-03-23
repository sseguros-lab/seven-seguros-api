const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { sendMail } = require('../services/mail');

module.exports = {
  async create(req, res) {
    const {
      store_name,
      store_cnpj,
      store_owner_name,
      store_owner_email,
      store_owner_phone,
      tag_number,
    } = req.body;

    const resp = await prisma.tb_managers.create({
      data: {
        store_name,
        store_cnpj,
        store_owner_name,
        store_owner_email,
        store_owner_phone,
        tag_number,
      },
    });

    const html = `
    <main>
      <div>
        <h4>Olá, aqui estão os dados da nova loja cadastrada:</h4>
      </div>
      <div>
        <div>
          <div style={{display: 'flex'}}>
            <b>Nome da loja</b>
            <p>${resp?.store_name}</p>
          </div>

          <div style={{display: 'flex'}}>
            <b>CNPJ</b>
            <p>${resp?.store_owner_name}</p>
          </div>

          <div style={{display: 'flex'}}>
            <b>Nome do responsável</b>
            <p>${resp?.store_cnpj}</p>
          </div>

          <div style={{display: 'flex'}}>
            <b>E-mail do responsável</b>
            <p>${resp?.store_owner_email}</p>
          </div>

          <div style={{display: 'flex'}}>
            <b>Telefone do responsável</b>
            <p>${resp?.store_owner_phone}</p>
          </div>

          <div style={{display: 'flex'}}>
            <b>Números das TAGS</b>
            <p>${resp?.tag_number}</p>
          </div>
        </div>
      </div>
    </main>
    
    `;

    sendMail(
      'rodrigo.bianchinii@gmail.com',
      html,
      'Nova loja cadastrada pelo gestor'
    );

    res.status(200).send(resp);
  },
};
