import { TestRunFileSchema } from "@cloudydaiyz/qa-pup-types";
import mjml from "mjml";

const testCompletionEmailTemplate = `
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
    		<mj-text align="center" font-size="15px">&nbsp;</mj-text>
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
        
        <mj-text font-size="20px"><strong>Run ID:</strong> <!-- Run ID --></mj-text>
        <mj-text>&nbsp;</mj-text>
        
        <!-- Run Info -->
      </mj-column>
    </mj-section>
    <mj-section>
      <mj-column>
    		<mj-text align="center" line-height="45px" font-size="13px">Made by Kylan Duncan (@cloudydaiyz)</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`

const testRunBlockTemplate = `
        <mj-text font-size="20px"><strong><--! name --></strong></mj-text>
        <mj-text font-size="18px">Duration: <--! duration --></mj-text>
        <mj-text font-size="18px">Status: <--! status --></mj-text>
        <mj-text>&nbsp;</mj-text>

`

export function composeEmailBody(runId: string, testRuns: TestRunFileSchema[]): string {
    let testRunBlocks = "";
    for(const testRun of testRuns) {
        testRunBlocks += testRunBlockTemplate
            .replace("<!-- name -->", testRun.name)
            .replace("<!-- duration -->", testRun.duration.toString())
            .replace("<!-- status -->", testRun.status);
    }
    
    return testCompletionEmailTemplate
        .replace("<!-- Run ID -->", runId)
        .replace("<!-- Run Info -->", testRunBlocks);
}