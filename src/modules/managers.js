const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { sendMail } = require('../services/mail');

module.exports = {
  async create(req, res) {
    const {
      manager_id,
      store_name,
      store_cnpj,
      store_owner_name,
      store_owner_email,
      store_owner_phone,
      tag_number,
      doc_front,
      doc_verse,
    } = req.body;

    const recipients = await prisma.tb_recipients.findMany();
    const manager = await prisma.tb_managers_list.findFirst({
      where: { id: parseInt(manager_id) },
    });

    const resp = await prisma.tb_managers.create({
      data: {
        doc_front,
        doc_verse,
        store_name,
        store_cnpj,
        store_owner_name,
        store_owner_email,
        store_owner_phone,
        tag_number,
        tb_managers_list: { connect: { id: parseInt(manager_id) } },
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
          <b>Nome do gestor: <span style="font-weight: normal;">${
            manager?.name
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
          <b>Termo de Confissão de Dívida assinado pelo responsável pela loja (FRENTE):  <span style="font-weight: normal;">${
            resp?.doc_front
          }</span></b><br/>
          <b>Termo de Confissão de Dívida assinado pelo responsável pela loja (VERSO):  <span style="font-weight: normal;">${
            resp?.doc_verse
          }</span></b><br/>
        </div>
        </div>
      </main>
      `;

      sendMail(recipient.email, html, 'Nova loja cadastrada pelo gestor');
    }

    res.status(200).send(resp);
  },

  async getList(req, res) {
    const resp = await prisma.tb_managers_list.findMany();
    res.status(200).send(resp);
  },

  async exportManagers(req, res) {
    const resp = await prisma.tb_managers.findMany({
      where: { deleted_at: null },
      include: { tb_managers_list: true },
    });

    const nresp = resp.map(
      (i) =>
        (i = {
          NomeGestor: i.tb_managers_list?.name,
          CpfGestor: i.tb_managers_list?.cpf,
          NomeLoja: i.store_name,
          CnpjLoja: i.store_cnpj,
          NomeResponsavel: i.store_owner_name,
          EmailResponsavel: i.store_owner_email,
          TelefoneResponsavel: i.store_owner_phone,
          NumeroTags: i.tag_number,
          DocumentoFrente: i.doc_front
            ? i.doc_front.split('?AWSAccessKeyId')[0]
            : '',
          DocumentoVerso: i.doc_verse
            ? i.doc_verse?.split('?AWSAccessKeyId')[0]
            : '',
        })
    );

    res.status(200).send(nresp);
  },
};
