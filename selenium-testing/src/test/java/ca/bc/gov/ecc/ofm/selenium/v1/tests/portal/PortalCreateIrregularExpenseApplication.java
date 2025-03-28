package ca.bc.gov.ecc.ofm.selenium.v1.tests.portal;

import java.time.Duration;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.testng.Assert;
import org.testng.annotations.AfterTest;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.Test;

import ca.bc.gov.ecc.ofm.selenium.v1.PageFactory_Portal.*;
import ca.bc.gov.ecc.ofm.selenium.v1.tests.BaseTest;
import io.github.bonigarcia.wdm.WebDriverManager;

public class PortalCreateIrregularExpenseApplication extends BaseTest {
	WebDriver driver;

	@BeforeTest
	public void initDriver() {
		ChromeOptions options = new ChromeOptions();	
		WebDriverManager.chromedriver().setup();
		driver = new ChromeDriver(options);
		driver.manage().window().maximize();
	}

	@SuppressWarnings("deprecation")
	@Test
	public void CreateIrregularExpenseApplication() throws InterruptedException {
		try {
			driver.get(QA_PORTAL_URL);
			test = extent.createTest("Test - Create irregular expense application");
			test.info("Starting Test - Create irregular expense application");
			
			PortalSignInFirstPage objPortalSigninFirstPage = new PortalSignInFirstPage(driver);
			objPortalSigninFirstPage.clickOnBCeIdLogin();

			PortalSignInCredentialPage objPortalSignInCredentialPage = new PortalSignInCredentialPage(driver);
			objPortalSignInCredentialPage.enterUserId(QA_PORTAL_USERNAME);
			objPortalSignInCredentialPage.enterPassword(QA_PORTAL_PASSWORD);
			objPortalSignInCredentialPage.clickSubmit();
			objPortalSignInCredentialPage.clickSignatureRequired();
			test.info("Login complete");
			
			PortalHomePage objPortalHomePage = new PortalHomePage(driver);
			objPortalHomePage.clickOnApplicationBox();
			PortalIrregularExpenseApplicationsHomePage portalIrregularExpenseApplicationsHomePage = new PortalIrregularExpenseApplicationsHomePage(driver);
			test.info("Homepage complete");
			
			Thread.sleep(5000);
			portalIrregularExpenseApplicationsHomePage.addIrregularExpenseApplication();
			PortalIrregularExpenseApplicationsDetails portalIrregularExpenseApplicationsDetails = new PortalIrregularExpenseApplicationsDetails(driver);
			portalIrregularExpenseApplicationsDetails.setSubjectTextField("Irregular Expense Test Subject");
			portalIrregularExpenseApplicationsDetails.setRequestDescriptionTextField("Irregular expense test description");
			portalIrregularExpenseApplicationsDetails.addFacility("ofmqa_fac_automation");
			portalIrregularExpenseApplicationsDetails.addNewFile();
			portalIrregularExpenseApplicationsDetails.clickSubmitNewRequest();
			test.info("Submit page complete");

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
//		driver.quit();
	}
}
