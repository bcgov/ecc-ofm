package ca.bc.gov.ecc.ofm.selenium.v1.tests.crm;

import java.time.Duration;
import java.util.Date;
import java.util.Formatter;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.testng.Assert;
import org.testng.annotations.AfterTest;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.Test;

import ca.bc.gov.ecc.ofm.selenium.v1.PageFactory_CRM.CRMContactPage;
import ca.bc.gov.ecc.ofm.selenium.v1.PageFactory_CRM.CRMFacilityPage;
import ca.bc.gov.ecc.ofm.selenium.v1.PageFactory_CRM.CRMHomePage;
import ca.bc.gov.ecc.ofm.selenium.v1.PageFactory_CRM.CRMNewContactFacilityPage;
import ca.bc.gov.ecc.ofm.selenium.v1.PageFactory_CRM.CRMOrgSearchPage;
import ca.bc.gov.ecc.ofm.selenium.v1.PageFactory_CRM.CRMOrganizationPage;
import ca.bc.gov.ecc.ofm.selenium.v1.PageFactory_CRM.CRMSignInCredentialPage;
import ca.bc.gov.ecc.ofm.selenium.v1.PageFactory_CRM.LicenseDetailsPage;
import ca.bc.gov.ecc.ofm.selenium.v1.PageFactory_CRM.ServiceDeliveryDetailsPage;
import ca.bc.gov.ecc.ofm.selenium.v1.tests.BaseTest;
import io.github.bonigarcia.wdm.WebDriverManager;

public class CRMAddLicenceToFacility extends BaseTest {
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
	public void createOrganizationFacilityContact() {
		
		try {
			// CRM Login
			test = extent.createTest("Test - CRM Create Organization, Contact, and Facility");
			driver.get(QA_CRM_URL);
			
			Thread.sleep(2000);
	    	CRMSignInCredentialPage objCRMSignInCredentialPage = new CRMSignInCredentialPage(driver);
			objCRMSignInCredentialPage.enterUserId(CRM_USERNAME);
			objCRMSignInCredentialPage.clickNext();
			Thread.sleep(1000);
			objCRMSignInCredentialPage.enterPassword(CRM_PASSWORD);
			Thread.sleep(1000);
			objCRMSignInCredentialPage.clickSignIn();
			Thread.sleep(1000);
			objCRMSignInCredentialPage.clickYes();
			objCRMSignInCredentialPage.clickSignInAgain();
			Thread.sleep(5000);
			objCRMSignInCredentialPage.clickOrgFacilities();
			test.info("Login complete");
			
			// Beginning of new code after login
			Thread.sleep(2000);
		
			// Search facility
			objCRMSignInCredentialPage.clickOrgFacilities();
			CRMOrgSearchPage cRMOrgSearchPage = new CRMOrgSearchPage(driver);
			cRMOrgSearchPage.selectFacility("ofmqa_fac_automation");
			
			
			CRMFacilityPage cRMFacilityPage = new CRMFacilityPage(driver);
			cRMFacilityPage.clickLicenceTab();
			
			// Creates license 1234
			Thread.sleep(2000);
			LicenseDetailsPage licenseDetailsPage = new LicenseDetailsPage(driver);
			createNewLicense(licenseDetailsPage, cRMFacilityPage, "LN-1234");
			
			// Creates SDD
			Thread.sleep(2000);
			ServiceDeliveryDetailsPage serviceDeliveryDetailsPage = new ServiceDeliveryDetailsPage(driver);
			
			createNewSDD(serviceDeliveryDetailsPage, licenseDetailsPage, "52", "Monday", "9:00 AM", "5:00 PM", "12", "12", "12");
			createNewSDD(serviceDeliveryDetailsPage, licenseDetailsPage, "52", "Monday", "9:00 AM", "5:00 PM", "15", "15", "15");
			
			licenseDetailsPage.saveAndCloseLicense();
			
			// Creates license 5678
			Thread.sleep(2000);
			createNewLicense(licenseDetailsPage, cRMFacilityPage, "LN-5678");
			
			Thread.sleep(2000);
			createNewSDD(serviceDeliveryDetailsPage, licenseDetailsPage, "52", "Monday", "9:00 AM", "5:00 PM", "21", "21", "21");
			createNewSDD(serviceDeliveryDetailsPage, licenseDetailsPage, "52", "Monday", "9:00 AM", "5:00 PM", "18", "18", "18");
			
			licenseDetailsPage.saveAndCloseLicense();
			
			test.info("Licence added to facility successfully");
			test.pass("Added licence to facility");
			
		} catch (Exception e) {
			test.fail("testcase failed");
			Assert.fail("testcase failed");
			e.printStackTrace();
		}
	}
	
	public void createNewLicense(LicenseDetailsPage licenseDetailsPage, CRMFacilityPage cRMFacilityPage, String licenseNumber) {
		try {
			cRMFacilityPage.addNewLicense();
			Thread.sleep(2000);
			licenseDetailsPage.setLicenseNumber(licenseNumber);
			licenseDetailsPage.setStartDate();
			licenseDetailsPage.setHealthAuthority();
			licenseDetailsPage.saveLicense();
		}
		catch(Exception e) {
			System.out.println("Could not create license");
		}
	}
	
	public void createNewSDD(ServiceDeliveryDetailsPage serviceDeliveryDetailsPage, LicenseDetailsPage licenseDetailsPage, String weeksInOperation, String dayOfWeek, 
			String hoursOfOperationFrom, String hoursOfOperationTo, String licenseSpaces, String operationalSpaces, String enrolledSpaces) {
		licenseDetailsPage.addNewSDD();
		serviceDeliveryDetailsPage.setLicenceType();
		serviceDeliveryDetailsPage.setWeeksInOperation(weeksInOperation);
		serviceDeliveryDetailsPage.setDaysOfWeek(dayOfWeek);
		serviceDeliveryDetailsPage.setHoursOfOperationFrom(hoursOfOperationFrom);
		serviceDeliveryDetailsPage.setHoursOfOperationTo(hoursOfOperationTo);
		serviceDeliveryDetailsPage.setLicenseSpaces(licenseSpaces);
		serviceDeliveryDetailsPage.setOperationalSpaces(operationalSpaces);
		serviceDeliveryDetailsPage.setEnrolledSpacesField(enrolledSpaces);
		serviceDeliveryDetailsPage.saveAndCLoseSDD();
	}
	

	@AfterTest
	public void tearDown() {
	//	driver.quit();
	}

}
