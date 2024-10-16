package ca.bc.gov.ecc.ofm.selenium.v1.tests.scripting;

import java.time.Duration;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.testng.Assert;
import org.testng.annotations.AfterTest;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.Test;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Arrays;
import java.util.List;
import org.openqa.selenium.logging.LogEntries;
import org.openqa.selenium.logging.LogEntry;
import org.openqa.selenium.logging.LogType;
import org.openqa.selenium.logging.Logs;
import java.util.logging.Level;

import ca.bc.gov.ecc.ofm.selenium.v1.PageFactory_Portal.*;
import ca.bc.gov.ecc.ofm.selenium.v1.PageFactory_CRM.*;
import ca.bc.gov.ecc.ofm.selenium.v1.tests.BaseTest;
import io.github.bonigarcia.wdm.WebDriverManager;

public class SmokeTestScript extends BaseTest {
	WebDriver driver;

	@BeforeTest
	public void initDriver() {
		ChromeOptions options = new ChromeOptions();
		options.setCapability("goog:loggingPrefs", java.util.Collections.singletonMap("browser", Level.ALL));
        WebDriverManager.chromedriver().setup();
		driver = new ChromeDriver(options);
		driver.manage().window().maximize();
	}
	
	@SuppressWarnings("deprecation")
	@Test
	public void SmokeTest() throws InterruptedException {
		
		try {
			
			test = extent.createTest("Test - Smoke test");
			test.info("Starting Test - Smoke test");
			
			driver.get(PORTAL_URL);
			
			test.info("Test #1 - Logging into external portal - In Progress");
			
			// Initial login
			Thread.sleep(2000);
			PortalSignInFirstPage objPortalSigninFirstPage = new PortalSignInFirstPage(driver);
			objPortalSigninFirstPage.clickOnBCeIdLogin();
			
			loginPortal(driver, PORTAL_USERNAME, PORTAL_PASSWORD);
			logoutPortal(driver);
			loginPortal(driver, PORTAL_USERNAME, PORTAL_PASSWORD);
			
			test.info("Test #1 - Logging into external portal - Complete");
			
			test.info("Test #2 - Applications, Reports, and Funding load without error - In Progress");
			
			PortalHomePage portalHomePage = new PortalHomePage(driver);
			Thread.sleep(2000);
			portalHomePage.clickOnApplicationBox();
			Thread.sleep(2000);
			portalHomePage.home();
			checkForConsoleErrors(driver);
			
			Thread.sleep(2000);
			portalHomePage.clickReportTile();
			Thread.sleep(2000);
			portalHomePage.home();
			checkForConsoleErrors(driver);
			
			Thread.sleep(2000);
			portalHomePage.clickFundingTile();
			Thread.sleep(2000);
			portalHomePage.home();
			checkForConsoleErrors(driver);
			
			Thread.sleep(2000);
			portalHomePage.clickAccountManagementTile();
			Thread.sleep(2000);
			portalHomePage.home();
			checkForConsoleErrors(driver);
			
			Thread.sleep(2000);
			portalHomePage.clickAssistanceRequestTile();
			Thread.sleep(2000);
			portalHomePage.exitOutOfAssistanceRequest();
			checkForConsoleErrors(driver);
			
			test.info("Test #2 - Applications, Reports, and Funding load without error - Complete");
			
			test.info("Test #3 - External links return status code 200 and messages load without error - In Progress");
	
			portalHomePage.clickFooterHome();
			checkHTTPResponse("https://www2.gov.bc.ca/gov/content/home");
			Thread.sleep(5000);
			portalHomePage.clickBackArrow(driver);
			
			Thread.sleep(3000);
			portalHomePage.clickFooterAbout();
			checkHTTPResponse("https://www2.gov.bc.ca/gov/content/about-gov-bc-ca");
			Thread.sleep(5000);
			portalHomePage.clickBackArrow(driver);
			
			Thread.sleep(3000);
			portalHomePage.clickFooterDisclaimer();
			checkHTTPResponse("https://www2.gov.bc.ca/gov/content/home/disclaimer");
			Thread.sleep(5000);
			portalHomePage.clickBackArrow(driver);
			
			Thread.sleep(3000);
			portalHomePage.clickFooterPrivacy();
			checkHTTPResponse("https://www2.gov.bc.ca/gov/content/home/privacy");
			Thread.sleep(5000);
			portalHomePage.clickBackArrow(driver);
			
			Thread.sleep(3000);
			portalHomePage.clickFooterAccessibility();
			checkHTTPResponse("https://www2.gov.bc.ca/gov/content/home/accessible-government");
			Thread.sleep(5000);
			portalHomePage.clickBackArrow(driver);
			
			Thread.sleep(3000);
			portalHomePage.clickFooterCopyright();
			checkHTTPResponse("https://www2.gov.bc.ca/gov/content/home/copyright");
			Thread.sleep(3000);
			portalHomePage.clickBackArrow(driver);
			
			Thread.sleep(5000);
			portalHomePage.clickFooterContact();
			checkHTTPResponse("https://www2.gov.bc.ca/gov/content/home/get-help-with-government-services");
			Thread.sleep(5000);
			portalHomePage.clickBackArrow(driver);
			
			
			portalHomePage.clickMessagesAndNotifications();
			Thread.sleep(10000);
			PortalMessagesAndNotificationsPage portalMessagesAndNotificationsPage = new PortalMessagesAndNotificationsPage(driver);
			portalMessagesAndNotificationsPage.clickOnMessage();
			checkForConsoleErrors(driver);
			Thread.sleep(5000);
			
			portalMessagesAndNotificationsPage.clickOnNotificationTab();
			Thread.sleep(2000);
			portalMessagesAndNotificationsPage.clickOnNotification();
			checkForConsoleErrors(driver);
				
			logoutPortal(driver);
			
			test.info("Test #3 - External links return status code 200 and messages load without error - Complete");
			
			test.info("Test #4 - Logging into internal portal and checking status code is 200 - In Progress");
			
			driver.get(INTERNAL_PORTAL_URL);
			Thread.sleep(2000);
			
			// Initial login
			PortalSignInFirstPage objInternalPortalSigninFirstPage = new PortalSignInFirstPage(driver);
			objInternalPortalSigninFirstPage.clickOnIDIRLogin();
			
			loginPortal(driver, INTERNAL_PORTAL_USERNAME, INTERNAL_PORTAL_PASSWORD);
			Thread.sleep(5000);
			logoutPortal(driver);
			loginPortal(driver, INTERNAL_PORTAL_USERNAME, INTERNAL_PORTAL_PASSWORD);
			checkHTTPResponse(INTERNAL_PORTAL_URL);
			
			test.info("Test #4 - Logging into internal portal and checking status code is 200 - Complete");
			
			test.info("Test #5 - Using impersonate - In Progress");
			
			portalHomePage.clickOnUsername();
			portalHomePage.clickImpersonate();
			
			Thread.sleep(2000);
			PortalImpersonatePage portalImpersonatePage = new PortalImpersonatePage(driver);
			portalImpersonatePage.setImpersonateField(PORTAL_USERNAME);
			portalImpersonatePage.clickSearchButton();
			
			test.info("Test #5 - Using impersonate - Complete");
			
			test.info("Test #6 - Using impersonate, click all tiles without error - In Progress");
			
			Thread.sleep(2000);
			portalHomePage.clickOnApplicationBox();
			Thread.sleep(2000);
			portalHomePage.home();
			checkForConsoleErrors(driver);
			
			Thread.sleep(2000);
			portalHomePage.clickReportTile();
			Thread.sleep(2000);
			portalHomePage.home();
			checkForConsoleErrors(driver);
			
			Thread.sleep(2000);
			portalHomePage.clickFundingTile();
			Thread.sleep(2000);
			portalHomePage.home();
			checkForConsoleErrors(driver);
			
			Thread.sleep(2000);
			portalHomePage.clickAccountManagementTile();
			Thread.sleep(2000);
			portalHomePage.home();
			checkForConsoleErrors(driver);
			
			test.info("Test #6 - Using impersonate, click all tiles without error - Complete");
			
			test.info("Test #7 - Using impersonate, login to another user - In Progress");
			
			portalHomePage.clickOnUsername();
			portalHomePage.clickImpersonate();
			
			Thread.sleep(3000);
			portalImpersonatePage.setImpersonateField("ofmqa224");
			portalImpersonatePage.clickSearchButton();
			
			test.info("Test #7 - Using impersonate, login to another user - Complete");
			
			test.info("Test #8 - Using impersonate, External link return status code 200 and messages load without error - In Progress");
			
			Thread.sleep(3000);
			portalHomePage.clickFooterHome();
			checkHTTPResponse("https://www2.gov.bc.ca/gov/content/home");
			Thread.sleep(5000);
			portalHomePage.clickBackArrow(driver);
			
			logoutPortal(driver);
			
			test.info("Test #8 - Using impersonate, External link return status code 200 and messages load without error - Complete");
			
			test.info("Test #9 - Log into CRM");
			
			driver.get(CRM_URL);
			
			loginToCRM(driver, CRM_URL, CRM_USERNAME, CRM_PASSWORD);
			
			test.info("Test #9 - Log into CRM - Complete");
			
			test.info("Test #10 - Navigation pain - In progress");
			
			// Zooms out page
			JavascriptExecutor js = (JavascriptExecutor) driver;
	        js.executeScript("document.body.style.zoom='75%'");
	        
	        CRMHomePage crmHomePage = new CRMHomePage(driver);
	        crmHomePage.selectOrgFacButton();
	        Thread.sleep(2000);
	        crmHomePage.selectContacts();
	        Thread.sleep(2000);
	        crmHomePage.selectNotifications();
	        Thread.sleep(2000);
	        crmHomePage.selectProviderReports();
	        Thread.sleep(2000);
	        crmHomePage.selectApplications();
	        Thread.sleep(2000);
	        crmHomePage.selectSupplementaries();
	        Thread.sleep(2000);
	        crmHomePage.selectFundings();
	        Thread.sleep(2000);
	        crmHomePage.selectAssistanceRequests();
	        
	        test.info("Test #10 - Navigation pain - Complete");
	        
	        test.pass("Completed - Smoke test passed");
		}
		catch(Exception e) {
			e.printStackTrace();
			test.fail("Fail - Smoke test failed");
			Assert.fail("Fail - Smoke test failed");
		}
	}
	
	public static void loginPortal(WebDriver driver, String portalUsername, String portalPassword) throws Exception {
		
		PortalSignInCredentialPage objPortalSignInCredentialPage = new PortalSignInCredentialPage(driver);
		Thread.sleep(2000);
		objPortalSignInCredentialPage.enterUserId(portalUsername);
		objPortalSignInCredentialPage.enterPassword(portalPassword);
		objPortalSignInCredentialPage.clickSubmit();
		objPortalSignInCredentialPage.clickSignatureRequired();
	}
	
	public static void logoutPortal(WebDriver driver) throws Exception {
		
		PortalHomePage portalHomePage = new PortalHomePage(driver);
		portalHomePage.clickOnUsername();
		portalHomePage.logout();
		portalHomePage.login();
	}

	public static void checkForConsoleErrors(WebDriver driver) throws Exception {
		
		LogEntries logs = driver.manage().logs().get(LogType.BROWSER);
		List<String> filteredErrors = Arrays.asList("Unauthorized", "and strict MIME checking is enabled"); // Errors on portal load up that will be filtered out
		boolean consoleError = false;
			
        for (LogEntry log : logs) {
            if (log.getLevel().getName().equals("SEVERE")) {
            	if (filteredErrors.stream().anyMatch(log.toString()::contains)) {
                    continue;
                }
                System.out.println("Console error: " + log.getMessage());
                consoleError = true;
            }
        }
        
        if (consoleError) {
        	throw new Exception("There is one or more console errors");
        }
	}
	
	@SuppressWarnings("deprecation")
	public static void checkHTTPResponse(String url) throws IOException {
		
		HttpURLConnection connection = (HttpURLConnection) new URL(url).openConnection();
		
		try {
			connection.setRequestMethod("GET");
            int statusCode = connection.getResponseCode();
            
            // Checks for if the response code is 200 (OK)
            Assert.assertEquals(statusCode, 200, "Expected response code is not 200");
		}
		finally {
			connection.disconnect();
		}
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
	
	public static void logoutCRM(WebDriver driver) {
		
		CRMHomePage crmHomePage = new CRMHomePage(driver);
		crmHomePage.selectProfile();
		crmHomePage.clickSignOut();
	}
}