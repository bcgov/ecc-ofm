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
import ca.bc.gov.ecc.ofm.selenium.v1.PageFactory_CRM.CRMOrganizationPage;
import ca.bc.gov.ecc.ofm.selenium.v1.PageFactory_CRM.CRMSignInCredentialPage;
import ca.bc.gov.ecc.ofm.selenium.v1.tests.BaseTest;
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
		
		// Setting up values to input for organization, contact, and facility
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
        contact.put("phoneNumber",  "1234567890");
        contact.put("portalRole",  "Account Manager");
        
        Map<String, String> facility = new HashMap<String, String>();
        facility.put("facilityName", "Facility Name + " + guid);
        facility.put("streetAddress", "street address");
        facility.put("city", "city");
        facility.put("postalCode", "T2T2T2");
        facility.put("primaryContact",  "lname - " + guid);
		
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
			// Home page - click on new organization button
			CRMHomePage homePage = new CRMHomePage(driver);
			homePage.pressNewOrganization();

			
			// Organization page - fill in new organization details
			CRMOrganizationPage organizationPage = new CRMOrganizationPage(driver);
			organizationPage.enterOrganizationName(organization.get("organizationName"));
			organizationPage.enterBusinessType(organization.get("businessType"));
			organizationPage.enterProviderType(organization.get("providerType"));
			organizationPage.enterOwnershipType(organization.get("ownershipType"));
			organizationPage.enterAddress(organization.get("streetAddress"));
			organizationPage.enterPostalCode(organization.get("postalCode"));
			organizationPage.enterCity(organization.get("city"));
			organizationPage.save();
			organizationPage.addNewContact();
			test.info("Organizationd details filled out");

			// Contact page - Fill in contact information
			CRMContactPage contactPage = new CRMContactPage(driver);
			contactPage.enterBCeID(contact.get("bceid"));
			contactPage.enterPortalRole(contact.get("portalRole"));
			contactPage.enterLastName(contact.get("lastName"));
			contactPage.enterEmail(contact.get("email"));
			contactPage.enterPhoneNumber(contact.get("phoneNumber"));
			contactPage.saveAndClose();
			contactPage.ignoreAndSave();
			test.info("New contact created");
			

			// Organization page - Create new facility
			organizationPage = new CRMOrganizationPage(driver);
			organizationPage.addNewFacility();

			// Facility page - Fill in facility details
			CRMFacilityPage facilityPage = new CRMFacilityPage(driver);
			facilityPage.enterFacilityName(facility.get("facilityName"));
			facilityPage.enterPrimaryContact(guid);
			facilityPage.enterAddress(facility.get("streetAddress"));
			facilityPage.enterPostalCode(facility.get("postalCode"));
			facilityPage.enterCity(facility.get("city"));
			facilityPage.save();
			test.info("New facility created");
			facilityPage.addContact();

			// Link contact to facility
			CRMNewContactFacilityPage newContactFacilityPage = new CRMNewContactFacilityPage(driver);
			newContactFacilityPage.addNewContact(guid);
			newContactFacilityPage.togglePortalAccess();
			Thread.sleep(1000);
			newContactFacilityPage.saveAndClose();
			test.info("Contact linked to facility successfully");
			test.pass("Created new organization, contact, and facility");
			
		} catch (Exception e) {
			test.fail("testcase failed");
			Assert.fail("testcase failed");
			e.printStackTrace();
		}
	}
	

	@AfterTest
	public void tearDown() {
		driver.quit();
	}

}
