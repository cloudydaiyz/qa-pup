import { DeleteIdentityCommand, GetIdentityVerificationAttributesCommand, ListIdentitiesCommand, SendEmailCommand, SendEmailRequest, SESClient, VerifyEmailIdentityCommand } from '@aws-sdk/client-ses';
import mjml from "mjml";
import fs from "fs";

// const template = fs.readFileSync("./template/test-completion-example.mjml", "utf-8");
const template = `
<mjml>
  <mj-head>
    <mj-font name="Rubik" href="https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300..900;1,300..900&display=swap"></mj-font>
    <mj-attributes>
      <mj-all font-family="Rubik, Helvetica, Montserrat, Arial, sans-serif"></mj-all>
    </mj-attributes>
  </mj-head>
  <mj-body background-color="#F2F2F2">
    <mj-section>
      <mj-column>
    		<mj-text align="center" font-size="15px">Your test run from QA Pup has completed.</mj-text>
      </mj-column>
    </mj-section>
    <mj-section background-color="#FFFFFF">
      <mj-column>
        <mj-text font-size="30px" align="center" color="#FF6600"><strong>QA Pup</strong></mj-text>
        <mj-divider border-color="#FF6600"></mj-divider>
        
        <mj-image width="200px" src="https://raw.githubusercontent.com/cloudydaiyz/qa-pup/refs/heads/develop/assets/pups.png"></mj-image>
        <mj-text font-size="28px" align="center" color="#FF6600">The test run has completed</mj-text>
        <mj-button background-color="#FF6600" font-size="18px"><a href="#" style="color: #FFFFFF; text-decoration: none;">View full results at QA Pup</a></mj-button>
        <mj-text>&nbsp;</mj-text>
        
        <mj-text font-size="20px"><strong>Run ID:</strong> 12345</mj-text>
        <mj-text>&nbsp;</mj-text>
        
        
        <mj-text font-size="20px"><strong>sortHackerNewsArticles</strong></mj-text>
        <mj-text font-size="18px"><strong>Duration:</strong> 2000ms</mj-text>
        <mj-text font-size="18px"><strong>Status:</strong> PASS</mj-text>
        <mj-text>&nbsp;</mj-text>
        
        <mj-text font-size="20px"><strong>sortHackerNewsArticles2</strong></mj-text>
        <mj-text font-size="18px">Duration: 2000ms</mj-text>
        <mj-text font-size="18px">Status: PASS</mj-text>
        <mj-text>&nbsp;</mj-text>
      </mj-column>
    </mj-section>
    <mj-section>
      <mj-column>
    		<mj-text align="center" line-height="45px" font-size="13px">Made by Kylan Duncan (@cloudydaiyz)</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`;
// const output = mjml(template);
// fs.writeFileSync('./template-html/test-completion-example.html', output.html);

const template2 = fs.readFileSync("./template/test-completion.mjml", "utf-8")
  .replace("<!-- Run ID placeholder -->", "Hello world")
  .replace("<!-- Run info placeholder -->", "Blah blah blah");
// const output2 = mjml(template2);
// fs.writeFileSync('./template-html/test-completion.html', output2.html);

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
        Data: ""
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

console.log(`Hello
world
` + `Hello
world
`);

// console.log(output.html);

// use mjml.io to generate html emails
// https://youtube.com/watch?v=64Ut2HZbyWw

// https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ses_template
// https://docs.aws.amazon.com/ses/latest/APIReference-V2/API_CreateEmailTemplate.html

// Account must be out of sandbox mode in order to send emails
// https://docs.aws.amazon.com/ses/latest/dg/creating-identities.html#send-email-verify-address-custom
// https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/ses/command/CreateCustomVerificationEmailTemplateCommand/