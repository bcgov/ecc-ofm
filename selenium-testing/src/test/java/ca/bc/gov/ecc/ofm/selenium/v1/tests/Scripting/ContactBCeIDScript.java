package ca.bc.gov.ecc.ofm.selenium.v1.tests.Scripting;
import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvValidationException;

import ca.bc.gov.ecc.ofm.selenium.v1.PageFactory_CRM.CRMContactPage;
import ca.bc.gov.ecc.ofm.selenium.v1.PageFactory_CRM.CRMFacilityPage;
import ca.bc.gov.ecc.ofm.selenium.v1.PageFactory_CRM.CRMHomePage;
import ca.bc.gov.ecc.ofm.selenium.v1.PageFactory_CRM.CRMNewContactFacilityPage;
import ca.bc.gov.ecc.ofm.selenium.v1.PageFactory_CRM.CRMOrganizationPage;
import ca.bc.gov.ecc.ofm.selenium.v1.PageFactory_CRM.CRMSignInCredentialPage;
import ca.bc.gov.ecc.ofm.selenium.v1.PageFactory_Portal.PortalHomePage;
import ca.bc.gov.ecc.ofm.selenium.v1.PageFactory_Portal.PortalSignInCredentialPage;
import ca.bc.gov.ecc.ofm.selenium.v1.PageFactory_Portal.PortalSignInFirstPage;
import io.github.bonigarcia.wdm.WebDriverManager;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.time.Duration;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class ContactBCeIDScript {
	
    public static void main(String[] args) throws Exception {
        // TODO: Enter path to your file
    	String csvFile = System.getProperty("user.dir") + "/OFM Business BCeIDs.csv";
    	
    	// Reads environment variables
    	Properties properties = new Properties();
		FileInputStream fileInputStream = new FileInputStream("config.properties");
		properties.load(fileInputStream);
		fileInputStream.close();
		
    	String PORTAL_URL = properties.getProperty("portal_url");
    	String CRM_URL = properties.getProperty("crm_url");
    	String CRM_USERNAME = properties.getProperty("crm_username");
    	String CRM_PASSWORD = properties.getProperty("crm_password");
    	
    	// Set up the web driver
    	WebDriverManager.chromedriver().setup();
		WebDriver driver = new ChromeDriver();
		driver.manage().window().maximize();
		
		try {
			// Log in to CRM
			loginToCRM(driver, CRM_URL, CRM_USERNAME, CRM_PASSWORD);
			
			// Reads from CSV file
			CSVReader reader = new CSVReader(new FileReader(csvFile));
	        String[] headers = reader.readNext(); // Read past header line
	        String[] line;
	        
	        // Creates organization, facility, and contact in CRM for each row of the spreadsheet
	        while ((line = reader.readNext()) != null) {
	            Map<String, String> data = new HashMap<>();
	            for (int i = 0; i < headers.length; i++) {
	                data.put(headers[i], line[i]);
	            }
	                
	            setupNewUser(driver, data);
	        }
	        reader.close();
	        
			reader = new CSVReader(new FileReader(csvFile));
	        headers = reader.readNext(); // Read past header line
	        
	        // Logs in to the portal for each user on the spreadsheet
	        while ((line = reader.readNext()) != null) {
	            Map<String, String> data = new HashMap<>();
	            for (int i = 0; i < headers.length; i++) {
	                data.put(headers[i], line[i]);
	            }
	                
	            loginThroughEachUser(driver, data, PORTAL_URL);
	        }
	        
	        reader.close();
	    } catch (Exception e) {
			e.printStackTrace();
		}
    	
    }
    
    public static void wait(WebDriver driver, int t) {
		driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(t));
	}

    public static void loginToCRM(WebDriver driver, String crmURL, String crmUsername, String crmPassword) throws Exception {
    	driver.get(crmURL);

		Thread.sleep(2000);
		CRMSignInCredentialPage objCRMSignInCredentialPage = new CRMSignInCredentialPage(driver);
		objCRMSignInCredentialPage.enterUserId(crmUsername);
		objCRMSignInCredentialPage.clickNext();
		Thread.sleep(1000);
		objCRMSignInCredentialPage.enterPassword(crmPassword);
		Thread.sleep(1000);
		objCRMSignInCredentialPage.clickSignIn();
		Thread.sleep(1000);
		objCRMSignInCredentialPage.clickYes();
		objCRMSignInCredentialPage.clickSignInAgain();
		Thread.sleep(5000);
    }
    
    public static void setupNewUser(WebDriver driver, Map<String, String> data) throws Exception {
    	
    	// TODO: make sure the excel columns are these listed below
    	String bceid = data.get("BCeID");
		String firstName = data.get("First Name");
		String lastName = data.get("Last Name");
		String email = data.get("Email");
		String phoneNumber = data.get("BCeID Phone Number");
		String businessType = data.get("Business Type");
		
		// Setting up values to input for organization, contact, and facility
		HashMap<String, String> organization = new HashMap<String, String>();
        organization.put("organizationName", "Organization " + firstName);
        organization.put("streetAddress", "street address");
        organization.put("city", "city");
        organization.put("postalCode", "T2T2T2");
        organization.put("businessType", businessType);
        organization.put("providerType", "Group");
        organization.put("ownershipType", "Private");

        Map<String, String> contact = new HashMap<String, String>();
        contact.put("bceid", bceid);
        contact.put("portalRole",  "Account Manager");
        contact.put("firstName", firstName);
        contact.put("lastName", lastName);
        contact.put("email", email);
        contact.put("phoneNumber",  phoneNumber);
        
        Map<String, String> facility = new HashMap<String, String>();
        facility.put("facilityName", "Facility " + firstName);
        facility.put("streetAddress", "street address");
        facility.put("city", "city");
        facility.put("postalCode", "T2T2T2");
        facility.put("primaryContact",  bceid);
    	
    	CRMSignInCredentialPage objCRMSignInCredentialPage = new CRMSignInCredentialPage(driver);
    	objCRMSignInCredentialPage.clickOrgFacilities();
		
		Thread.sleep(5000);
		
		// Home page - click on new organization button
		CRMHomePage homePage = new CRMHomePage(driver);
		homePage.pressNewOrganization();
		
		Thread.sleep(5000);
		
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
		wait(driver, 5000);
		organizationPage.addNewContact();
		
		Thread.sleep(5000);

		// Contact page - Fill in contact information
		wait(driver, 5000);
		CRMContactPage contactPage = new CRMContactPage(driver);
		contactPage.enterBCeID(contact.get("bceid"));
		contactPage.enterPortalRole(contact.get("portalRole"));
		contactPage.enterFirstName(contact.get("firstName"));
		contactPage.enterLastName(contact.get("lastName"));
		contactPage.enterEmail(contact.get("email"));
		contactPage.enterPhoneNumber(contact.get("phoneNumber"));
		contactPage.saveAndClose();
		contactPage.ignoreAndSave();
		
		Thread.sleep(5000);

		// Organization page - Create new facility
		organizationPage = new CRMOrganizationPage(driver);
		organizationPage.addNewFacility();
		
		Thread.sleep(5000);

		// Facility page - Fill in facility details
		CRMFacilityPage facilityPage = new CRMFacilityPage(driver);
		facilityPage.enterFacilityName(facility.get("facilityName"));
		facilityPage.enterPrimaryContact(bceid);
		facilityPage.enterAddress(facility.get("streetAddress"));
		facilityPage.enterPostalCode(facility.get("postalCode"));
		facilityPage.enterCity(facility.get("city"));
		facilityPage.save();
		wait(driver, 5000);
		facilityPage.addContact();
		
		Thread.sleep(5000);
		
		// Link contact to facility
		CRMNewContactFacilityPage newContactFacilityPage = new CRMNewContactFacilityPage(driver);
		newContactFacilityPage.addNewContact(bceid);
		newContactFacilityPage.togglePortalAccess();
		Thread.sleep(1000);
		newContactFacilityPage.saveAndClose();
	}
    
    public static void loginThroughEachUser(WebDriver driver, Map<String, String> data, String portalURL) throws Exception {
    	String username = data.get("BCeID");
    	String password = data.get("BCeID Password");
    	
    	driver.get(portalURL);
    	Thread.sleep(2000);
		wait(driver, 10);
    	
		PortalSignInFirstPage objPortalSigninFirstPage = new PortalSignInFirstPage(driver);
		objPortalSigninFirstPage.clickOnBCeIdLogin();
		
    	PortalSignInCredentialPage objPortalSignInCredentialPage = new PortalSignInCredentialPage(driver);
		objPortalSignInCredentialPage.enterUserId(username);
		wait(driver, 20);
		objPortalSignInCredentialPage.enterPassword(Base64.getEncoder().encodeToString(password.getBytes()));
		wait(driver, 20);
		objPortalSignInCredentialPage.clickSubmit();
		objPortalSignInCredentialPage.continueButton();
		
		// Log out of the portal
		WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10000));
        wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), '" + username + "')]")));
        driver.findElement(By.xpath("//*[contains(text(), '" + username + "')]")).click();
        Thread.sleep(1000);
        PortalHomePage portalHomePage = new PortalHomePage(driver);
        portalHomePage.logout();
		
    }
    
}