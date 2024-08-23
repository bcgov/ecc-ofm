package ca.bc.gov.ecc.ofm.selenium.v1.tests;

import java.time.Duration;
import java.util.Date;
import java.util.Formatter;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.testng.annotations.AfterTest;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.Test;

import ca.bc.gov.ecc.ofm.selenium.v1.PageFactory_CRM.CRMContactPage;
import ca.bc.gov.ecc.ofm.selenium.v1.PageFactory_CRM.CRMFacilityPage;
import ca.bc.gov.ecc.ofm.selenium.v1.PageFactory_CRM.CRMHomePage;
import ca.bc.gov.ecc.ofm.selenium.v1.PageFactory_CRM.CRMNewContactFacilityPage;
import ca.bc.gov.ecc.ofm.selenium.v1.PageFactory_CRM.CRMOrganizationPage;
import ca.bc.gov.ecc.ofm.selenium.v1.PageFactory_CRM.CRMSignInCredentialPage;
import io.github.bonigarcia.wdm.WebDriverManager;

public class CRMCreateOrganizationContactFacility extends BaseTest {
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
		// TODO (andyh0311) - For some reason the test never fails explicitly if something wrong happens. Find out why.
		
		// set up variables to use
		String guid = UUID.randomUUID().toString().substring(0, 8);
		
		HashMap<String, String> organization = new HashMap<String, String>();
        organization.put("organizationName", "Org Name - " + guid);
        organization.put("streetAddress", "street address");
        organization.put("city", "city");
        organization.put("postalCode", "T2T2T2");
        organization.put("businessType", "Sole Proprietor or Partnership");
        organization.put("providerType", "Group");
        organization.put("ownershipType", "Private");

        Map<String, String> contact = new HashMap<String, String>();
        contact.put("bceid", guid);
        contact.put("lastName",  "lname - " + guid);
        contact.put("email", guid + "@a.com");
        
        Map<String, String> facility = new HashMap<String, String>();
        facility.put("facilityName", "Facility Name + " + guid);
        facility.put("streetAddress", "street address");
        facility.put("city", "city");
        facility.put("postalCode", "T2T2T2");
        facility.put("primaryContact",  "lname - " + guid);
		
		try {
			// CRM Login
			// TODO (andyh0311) - See if you can use the method from CRMLogin class instead of copy pasting the code here
			test = extent.createTest("Test - CRM Create Organization, Contact, and Facility");
			driver.get(CRM_URL);
			wait(10);

			CRMSignInCredentialPage objCRMSignInCredentialPage = new CRMSignInCredentialPage(driver);

			objCRMSignInCredentialPage.enterUserId(CRM_USERNAME);
			objCRMSignInCredentialPage.clickNext();
			wait(20);
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
			
			// beginning of new code after login
			Thread.sleep(5000);
			// on home page, click on new organization button
			CRMHomePage homePage = new CRMHomePage(driver);
			homePage.pressNewOrganization();
			
			Thread.sleep(5000);
			
			// fill in new organization details
			CRMOrganizationPage organizationPage = new CRMOrganizationPage(driver);
			organizationPage.enterOrganizationName(organization.get("organizationName"));
			organizationPage.enterBusinessType(organization.get("businessType"));
			organizationPage.enterProviderType(organization.get("providerType"));
			organizationPage.enterOwnershipType(organization.get("ownershipType"));
			organizationPage.enterAddress(organization.get("streetAddress"));
			organizationPage.enterPostalCode(organization.get("postalCode"));
			organizationPage.enterCity(organization.get("city"));
			organizationPage.save();
			wait(5000);
			organizationPage.addNewContact();
			test.info("Organizationd details filled out");
			
			Thread.sleep(5000);

			// fill in contact information
			wait(5000);
			CRMContactPage contactPage = new CRMContactPage(driver);
			contactPage.enterBCeID(contact.get("bceid"));
			// TODO (andyh0311) - Fill out the user's portal role to Account Manager
			contactPage.enterLastName(contact.get("lastName"));
			contactPage.enterEmail(contact.get("email"));
			contactPage.saveAndClose();
			test.info("New contact created");
			
			// on organization page, create new facility
			Thread.sleep(5000);

			organizationPage = new CRMOrganizationPage(driver);
			// TODO (andyh0311) - scrolling bug
			organizationPage.addNewFacility();
			
			Thread.sleep(5000);

			// fill in facility details
			CRMFacilityPage facilityPage = new CRMFacilityPage(driver);
			facilityPage.enterFacilityName(facility.get("facilityName"));
			facilityPage.enterPrimaryContact(guid);
			// TODO (andyh0311) - scrolling bug
			facilityPage.enterAddress(facility.get("streetAddress"));
			facilityPage.enterPostalCode(facility.get("postalCode"));
			facilityPage.enterCity(facility.get("city"));
			facilityPage.save();
			test.info("New facility created");
			wait(5000);
			facilityPage.addContact();
			
			Thread.sleep(5000);
			
			// Link contact to facility
			CRMNewContactFacilityPage newContactFacilityPage = new CRMNewContactFacilityPage(driver);
			newContactFacilityPage.addNewContact(guid);
			newContactFacilityPage.togglePortalAccess();
			Thread.sleep(1000);
			newContactFacilityPage.saveAndClose();
			test.info("Contact linked to facility successfully");
			test.pass("Created new organization, contact, and facility");
			
		} catch (Exception e) {
			test.fail("testcase failed!");
			e.printStackTrace();
		}
	}

	@AfterTest
	public void tearDown() {
		driver.quit();
	}

}
