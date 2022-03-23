const { Config, SES } = require('aws-sdk');

const SESserver = new SES(
  new Config({
    region: process.env.AWS_SES_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET,
  })
);

const sendMail = (to, html, subject) =>
  SESserver.sendEmail({
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: html,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject,
      },
    },
    Source: 'nao-responda@gruposeven.app',
  }).promise();

module.exports = {
  sendMail: sendMail,
};
