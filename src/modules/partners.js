const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { sendMail } = require('../services/mail');

module.exports = {
  async create(req, res) {
    const {
      store_name,
      store_email,
      client_phone,
      client_email,
      client_address_cep,
      client_address_number,
      tag_number,
      user_document,
      vehicle_document,
    } = req.body;

    const recipients = await prisma.tb_recipients.findMany();

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

    for (const recipient of recipients) {
      const html = `
    <main>
      <div>
      <h4>Olá, ${
        recipient.name.split(' ')[0]
      }. Aqui estão os dados da TAG ativada:</h4>
      </div>
      <div>
        <b>Nome da loja: <span style="font-weight: normal;">${
          resp?.store_name
        }</span></b><br/>
        <b>Telefone do cliente: <span style="font-weight: normal;">${
          resp?.client_phone
        }</span></b><br/>
        <b>E-mail do cliente:  <span style="font-weight: normal;">${
          resp?.client_email
        }</span></b><br/>
        <b>CEP do cliente: <span style="font-weight: normal;">${
          resp?.client_address_cep
        }</span></b><br/>
        <b>Número da residência:  <span style="font-weight: normal;">${
          resp?.client_address_number
        }</span></b><br/>
        <b>Serial da TAG:  <span style="font-weight: normal;">${
          resp?.tag_number
        }</span></b><br/>
        <b>Documento do cliente:  <span style="font-weight: normal;">${
          resp?.user_document
        }</span></b><br/>
        <b>Documento do veículo:  <span style="font-weight: normal;">${
          resp?.vehicle_document
        }</span></b><br/>
      </div>
      </div>
    </main>
    
    `;

      sendMail(recipient.email, html, 'Nova TAG ativada pela revenda');
    }

    const partnerHtml = `
    <main>
      <div>
      <h4>Olá, ${resp?.store_name}. Aqui estão os dados da TAG ativada:</h4>
      </div>
      <div>
        <b>Nome da loja: <span style="font-weight: normal;">${resp?.store_name}</span></b><br/>
        <b>Telefone do cliente: <span style="font-weight: normal;">${resp?.client_phone}</span></b><br/>
        <b>E-mail do cliente:  <span style="font-weight: normal;">${resp?.client_email}</span></b><br/>
        <b>CEP do cliente: <span style="font-weight: normal;">${resp?.client_address_cep}</span></b><br/>
        <b>Número da residência:  <span style="font-weight: normal;">${resp?.client_address_number}</span></b><br/>
        <b>Serial da TAG:  <span style="font-weight: normal;">${resp?.tag_number}</span></b><br/>
        <b>Documento do cliente:  <span style="font-weight: normal;">${resp?.user_document}</span></b><br/>
        <b>Documento do veículo:  <span style="font-weight: normal;">${resp?.vehicle_document}</span></b><br/>
      </div>
      </div>
    </main>
    
    `;

    sendMail(store_email, partnerHtml, 'Nova TAG ativada!');

    res.status(200).send(resp);
  },
};
