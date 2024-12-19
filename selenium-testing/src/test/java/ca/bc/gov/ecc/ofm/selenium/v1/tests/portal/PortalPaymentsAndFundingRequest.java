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

public class PortalPaymentsAndFundingRequest extends BaseTest {
    WebDriver driver;

    @BeforeTest
    public void initDriver() {
        ChromeOptions options = new ChromeOptions();
        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver(options);
        driver.manage().window().maximize();
    }

    @Test
    public void CreatePaymentsAndFundingRequest() throws InterruptedException {
        try {
            driver.get(QA_PORTAL_URL);
            test = extent.createTest("Test - Create Payments and Funding Request");
            test.info("Starting Test - Create Payments and Funding Request");

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
            objPortalHomePage.clickAssistanceRequestTile();
            PortalCreateFundingAndPaymentsRequest objPortalCreateFundingAndPaymentsRequest = new PortalCreateFundingAndPaymentsRequest(driver);

            objPortalCreateFundingAndPaymentsRequest.setTopic();
            objPortalCreateFundingAndPaymentsRequest.setSummaryTextField("Payment and Funding");
            objPortalCreateFundingAndPaymentsRequest.setRequestDescriptionTextField("This is a test with automation by Trevor");
            objPortalCreateFundingAndPaymentsRequest.addNewFile();
            objPortalCreateFundingAndPaymentsRequest.clickSubmitNewRequest();

            test.info("Request complete and submitted");

            test.pass("Testcase passed!");
        } catch (Exception e) {
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
