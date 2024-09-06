package ca.bc.gov.ecc.ofm.selenium.v1.tests.portal;

import java.time.Duration;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.testng.Assert;
import org.testng.annotations.AfterTest;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.Test;

import com.aventstack.extentreports.MediaEntityBuilder;

import ca.bc.gov.ecc.ofm.selenium.v1.PageFactory_Portal.*;
import ca.bc.gov.ecc.ofm.selenium.v1.tests.BaseTest;
import io.github.bonigarcia.wdm.WebDriverManager;

public class PortalCreateApplication extends BaseTest {

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
	public void CreateApplication() throws Exception {
		try {
			driver.get(PORTAL_URL);
		//	test = extent.createTest("Test - Portal Create Application");
			test.info("Test - Portal Create Application");

			Thread.sleep(2000);
			PortalSignInFirstPage objPortalSigninFirstPage = new PortalSignInFirstPage(driver);
			objPortalSigninFirstPage.clickOnBCeIdLogin();

			PortalSignInCredentialPage objPortalSignInCredentialPage = new PortalSignInCredentialPage(driver);
			objPortalSignInCredentialPage.enterUserId(PORTAL_USERNAME);
			objPortalSignInCredentialPage.enterPassword(PORTAL_PASSWORD);
			objPortalSignInCredentialPage.clickSubmit();
			objPortalSignInCredentialPage.clickSignatureRequired();
			test.info("login complete");

			PortalHomePage objPortalHomePage = new PortalHomePage(driver);
			Thread.sleep(5000);
			objPortalHomePage.clickOnApplicationBox();
			PortalApplicationsHomePage portalApplicationsHomePage = new PortalApplicationsHomePage(driver);
			test.info("homepage complete");

			Thread.sleep(5000);
			portalApplicationsHomePage.addOFMApplication();

			test.info("Create Application page");
			PortalApplicationsSelectFacility portalApplicationsSelectFacility = new PortalApplicationsSelectFacility(
					driver);
			Thread.sleep(2000);
			portalApplicationsSelectFacility.setIConfirmThatOrganizationInformationIsCheckboxField();
			portalApplicationsSelectFacility.setToStartYourApplicationSelectATextField("ofmqa_fac_automation");
			portalApplicationsSelectFacility.clickNextButton();
			test.info("Select facility page complete");

			Thread.sleep(2000);
			PortalApplicationsFacilityDetails portalApplicationsFacilityDetails = new PortalApplicationsFacilityDetails(
					driver);
			portalApplicationsFacilityDetails.setFiscalYearEndDateDateField("09/30/2025");
			Thread.sleep(2000);
			portalApplicationsFacilityDetails.setSelectPrimaryContactTextField("ofmqa 08");
			portalApplicationsFacilityDetails.setSelectExpenseAuthorityTextField("ofmqa 08");
			portalApplicationsFacilityDetails.clickNextButton();
			test.info("facility details page complete");

			PortalApplicationsServiceDelivery portalApplicationsServiceDelivery = new PortalApplicationsServiceDelivery(
					driver);
			Thread.sleep(2000);
			portalApplicationsServiceDelivery.setIConfirmThatTheAboveInformationCheckboxField();
			portalApplicationsServiceDelivery.clickNextButton();
			test.info("service delivery page complete");

			PortalApplicationsOperatingCosts portalApplicationsOperatingCosts = new PortalApplicationsOperatingCosts(
					driver);
			Thread.sleep(2000);
			portalApplicationsOperatingCosts.setSelectAFacilityTypeTextField("Owned Without Mortgage");

			PortalApplicationsOperatingCostsDetails portalApplicationsOperatingCostsDetails = new PortalApplicationsOperatingCostsDetails(
					driver);
			Thread.sleep(500);
			portalApplicationsOperatingCostsDetails.setInsuranceCost("500.00");
			Thread.sleep(5000);
			portalApplicationsOperatingCostsDetails.addIncomeStatement();
			Thread.sleep(2000);
			portalApplicationsOperatingCostsDetails.clickSaveButton();
			Thread.sleep(5000);
			portalApplicationsOperatingCostsDetails.addBalanceSheet();
			Thread.sleep(2000);
			portalApplicationsOperatingCostsDetails.clickNextButton();
			Thread.sleep(5000);
			
			PortalApplicationsStaffing portalApplicationsStaffing = new PortalApplicationsStaffing(driver);
			portalApplicationsStaffing.setUnionizedNo();
			portalApplicationsStaffing.setITEFullTime("1");

			portalApplicationsStaffing.clickNextButton();
			test.info("Staffing page complete");

			Thread.sleep(5000);
			PortalApplicationsReview portalApplicationsReview = new PortalApplicationsReview(driver);
			portalApplicationsReview.clickNextButton();
			Thread.sleep(5000);
			test.info("Review page complete");

			PortalApplicationsDeclareSubmit portalApplicationsDeclareSubmit = new PortalApplicationsDeclareSubmit(
					driver);
			portalApplicationsDeclareSubmit.clickDeclare();
			Thread.sleep(2000);
			portalApplicationsDeclareSubmit.clickSubmitButton();
			test.info("Submit page complete");

			test.pass("testcase passed!");

		} catch (Exception e) {
			test.fail("testcase failed");
			Assert.fail("testcase failed");
			e.printStackTrace();
		}

	}

	@AfterTest
	public void tearDown() {
		// driver.close();
		// driver.quit();
	}

}
