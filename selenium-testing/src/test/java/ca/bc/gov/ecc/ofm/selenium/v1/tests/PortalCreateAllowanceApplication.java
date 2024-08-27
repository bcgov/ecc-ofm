package ca.bc.gov.ecc.ofm.selenium.v1.tests;

import java.time.Duration;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.testng.annotations.AfterTest;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.Test;

import com.aventstack.extentreports.MediaEntityBuilder;

import ca.bc.gov.ecc.ofm.selenium.v1.PageFactory_Portal.*;
import io.github.bonigarcia.wdm.WebDriverManager;

public class PortalCreateAllowanceApplication extends BaseTest {

	WebDriver driver;

	@BeforeTest
	public void initDriver() {
		WebDriverManager.chromedriver().setup();
		driver = new ChromeDriver();
		driver.manage().window().maximize();
	}

	public void wait(int t) {
		driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(t));
	}

	@SuppressWarnings("deprecation")
	@Test
	public void CreateAllowanceApplication() throws Exception {
		try {
			driver.get(PORTAL_URL);
		//	test = extent.createTest("Test - Portal Create Application");
			test.info("Test - Portal Create Allowance Application");

			Thread.sleep(2000);
			PortalSignInFirstPage objPortalSigninFirstPage = new PortalSignInFirstPage(driver);
			objPortalSigninFirstPage.clickOnBCeIdLogin();
			Thread.sleep(2000);
			PortalSignInCredentialPage objPortalSignInCredentialPage = new PortalSignInCredentialPage(driver);
			objPortalSignInCredentialPage.enterUserId(PORTAL_USERNAME);
			objPortalSignInCredentialPage.enterPassword(PORTAL_PASSWORD);
			objPortalSignInCredentialPage.clickSubmit();
			wait(5000);
			Thread.sleep(9000);
			objPortalSignInCredentialPage.clickSignatureRequired();
			test.info("login complete");

			PortalHomePage objPortalHomePage = new PortalHomePage(driver);
			Thread.sleep(5000);
			objPortalHomePage.clickOnApplicationBox();
			PortalApplicationsHomePage portalApplicationsHomePage = new PortalApplicationsHomePage(driver);
			test.info("homepage complete");

			Thread.sleep(5000);
			portalApplicationsHomePage.addAllowanceOFMApplication();

			test.info("Create Allowance Application page");
			PortalAllowanceApplicationsSelectFacility portalAllowanceApplicationsSelectFacility = new PortalAllowanceApplicationsSelectFacility(
					driver);
			Thread.sleep(2000);
			portalAllowanceApplicationsSelectFacility.setToStartYourApplicationSelectATextField("ofmqa_fac_automation");
			test.info("Select facility page complete");

			
			PortalAllowanceApplicationsDetails portalAllowanceApplicationsDetails = new PortalAllowanceApplicationsDetails(driver);
			portalAllowanceApplicationsDetails.setHonorariaForElderInvolvementLanguageRevitalizationCheckboxField();
			
			portalAllowanceApplicationsDetails.setResourcesToProactivelySupportCheckboxField();
			
			portalAllowanceApplicationsDetails.fillTransportationDetails();
			
			test.info("Allowance Details page complete");

			Thread.sleep(5000);
			PortalAllowanceApplicationsReviewSubmit portalAllowanceApplicationsReviewSubmit= new PortalAllowanceApplicationsReviewSubmit(driver);
			portalAllowanceApplicationsReviewSubmit.clickDeclare();
			portalAllowanceApplicationsReviewSubmit.clickSubmitButton();
			
			test.pass("testcase passed!");

		} catch (Exception e) {
			throw (e);

		}

	}

	@AfterTest
	public void tearDown() {
		// driver.close();
		// driver.quit();
	}

}
