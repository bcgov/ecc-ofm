package ca.bc.gov.ecc.ofm.selenium.v1.tests.portal;

import ca.bc.gov.ecc.ofm.selenium.v1.PageFactory_Portal.*;
import ca.bc.gov.ecc.ofm.selenium.v1.tests.BaseTest;
import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.testng.Assert;
import org.testng.annotations.AfterTest;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.Test;

public class PortalCreateFundingEnvelopeChangeRequest extends BaseTest {
    WebDriver driver;

    @BeforeTest
    public void initDriver() {
        ChromeOptions options = new ChromeOptions();
        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver(options);
        driver.manage().window().maximize();
    }


    @Test
    public void CreateFundingEnvelopeChangeRequest() throws InterruptedException {
        try {
            driver.get(QA_PORTAL_URL);
            test = extent.createTest("Test - Create Funding Envelope Change Request");
            test.info("Starting Test - Create Funding Envelope Change Request");

            PortalSignInFirstPage objPortalSigninFirstPage = new PortalSignInFirstPage(driver);
            Thread.sleep(3000);
            objPortalSigninFirstPage.clickOnBCeIdLogin();

            PortalSignInCredentialPage objPortalSignInCredentialPage = new PortalSignInCredentialPage(driver);
            objPortalSignInCredentialPage.enterUserId(QA_PORTAL_USERNAME);
            objPortalSignInCredentialPage.enterPassword(QA_PORTAL_PASSWORD);
            objPortalSignInCredentialPage.clickSubmit();
            objPortalSignInCredentialPage.clickSignatureRequired();
            test.info("Login complete");

            PortalHomePage objPortalHomePage = new PortalHomePage(driver);
            objPortalHomePage.clickFundingTile();
            PortalFundingPage portalFundingPage = new PortalFundingPage(driver);
            test.info("Homepage complete,Landed on Funding Page");

            Thread.sleep(5000);
            portalFundingPage.clickOnFundingAllocationTab();
            PortalFundingAllocationTab portalFundingAllocationTab =new PortalFundingAllocationTab(driver);
            portalFundingAllocationTab.ClickReallocateFunds();
            PortalFundingEnvelopeChangeRequest portalFundingEnvelopeChangeRequest = new PortalFundingEnvelopeChangeRequest(driver);

            portalFundingEnvelopeChangeRequest.setSummaryTextField("Funding Envelope Change Request test");
            portalFundingEnvelopeChangeRequest.addFacility("jpan");
            portalFundingEnvelopeChangeRequest.setRequestDescriptionTextField("This is a test Funding envelope change request application.");
            portalFundingEnvelopeChangeRequest.addNewFile();
            portalFundingEnvelopeChangeRequest.clickSubmitNewRequest();

            test.info("Request complete and submitted");

            test.pass("Testcase passed!");
        }

        catch (Exception e) {
            test.fail("testcase failed!");
            Assert.fail("testcase failed!");
            e.printStackTrace();
        }
    }

    @AfterTest
    public void tearDown() {
        driver.quit();
    }
}


