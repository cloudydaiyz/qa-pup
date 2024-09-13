import { DeleteIdentityCommand, GetIdentityVerificationAttributesCommand, ListIdentitiesCommand, SendEmailCommand, SendEmailRequest, SESClient, VerifyEmailIdentityCommand } from '@aws-sdk/client-ses';
import mjml from "mjml";
import fs from "fs";

const client = new SESClient();
const input: SendEmailRequest = {
  Source: "kyland03.biz@gmail.com",
  Destination: {
    CcAddresses: [],
    ToAddresses: [
      "kyland03.biz@gmail.com",
      // "kduncan@utexas.edu",
    ],
  },
  Message: {
    Body: {
      Html: {
        Charset: "UTF-8",
        Data: "This message body contains HTML formatting. It can, for example, contain links like this one: <a class=\"ulink\" href=\"http://docs.aws.amazon.com/ses/latest/DeveloperGuide\" target=\"_blank\">Amazon SES Developer Guide</a>."
      },
      // Text: {
      //   Charset: "UTF-8",
      //   Data: "This is the message body in text format."
      // }
    },
    Subject: {
      Charset: "UTF-8",
      Data: "Test email"
    }
  },
}
const cmd = new SendEmailCommand(input);
// client.send(cmd);

const cmd2 = new DeleteIdentityCommand({ Identity: "kduncan@utexasedu" });
// client.send(cmd2);

const cmd3 = new ListIdentitiesCommand({ IdentityType: "EmailAddress" });
// client.send(cmd3).then(console.log);

// can send this multiple times
// Does NOT verify if the email is valid -- adds it to the list of identities regardless
const cmd4 = new VerifyEmailIdentityCommand({ EmailAddress: "kduncan@utexas.edu" });
// client.send(cmd4); 

const cmd5 = new GetIdentityVerificationAttributesCommand({
  Identities: ["kyland03.biz@gmail.com", "kduncan@utexas.edu"]
  // Identities: ["kyland03.biz@gmail.com"]
});
// client.send(cmd5).then(console.log);

const template = fs.readFileSync("./template/test-completion-example.mjml", "utf-8");
const output = mjml(template);
fs.writeFileSync('./template-html/test-completion-example.html', output.html);
// console.log(output.html);

// use mjml.io to generate html emails
// https://youtube.com/watch?v=64Ut2HZbyWw

// https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ses_template
// https://docs.aws.amazon.com/ses/latest/APIReference-V2/API_CreateEmailTemplate.html

// Account must be out of sandbox mode in order to send emails
// https://docs.aws.amazon.com/ses/latest/dg/creating-identities.html#send-email-verify-address-custom
// https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/ses/command/CreateCustomVerificationEmailTemplateCommand/