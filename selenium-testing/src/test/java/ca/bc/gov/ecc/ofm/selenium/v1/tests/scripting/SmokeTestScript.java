package ca.bc.gov.ecc.ofm.selenium.v1.tests.scripting;

import ca.bc.gov.ecc.ofm.selenium.v1.PageFactory_Portal.*;
import ca.bc.gov.ecc.ofm.selenium.v1.PageFactory_CRM.*;
import ca.bc.gov.ecc.ofm.selenium.v1.tests.BaseTest;
import io.github.bonigarcia.wdm.WebDriverManager;

import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.testng.Assert;
import org.testng.annotations.AfterTest;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.Listeners;
import org.testng.annotations.Test;
import org.openqa.selenium.logging.LogEntries;
import org.openqa.selenium.logging.LogEntry;
import org.openqa.selenium.logging.LogType;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Arrays;
import java.util.List;
import java.util.logging.Level;

public class SmokeTestScript extends BaseTest {
	
	WebDriver driver;

	@BeforeTest
	private void initDriver() {
		
		ChromeOptions options = new ChromeOptions();
		options.setCapability("goog:loggingPrefs", java.util.Collections.singletonMap("browser", Level.ALL));
		
		// Setting up headless
		options.addArguments("--headless=new");
		options.addArguments("--disable-extensions");
        options.addArguments("--disable-gpu");
        options.addArguments("--window-size=1920x1080");
        
        WebDriverManager.chromedriver().setup();
		driver = new ChromeDriver(options);
		driver.manage().window().maximize();
	}
	
	@SuppressWarnings("deprecation")
	@Test
	public void SmokeTest() throws Exception {
		
		try {
			
			test = extent.createTest("Test - Smoke test");
			test.info("Starting Test - Smoke test");
			
			System.out.println("[INFO] Starting Test - Smoke test");
			
			test.info("Test #1 - Logging into external portal - In Progress");
			
			System.out.println("[INFO] Test #1 - Logging into external portal - [In Progress]");
			
			driver.get(UAT_PORTAL_URL);
			
			// Initial login
			Thread.sleep(2000);
			PortalSignInFirstPage objPortalSigninFirstPage = new PortalSignInFirstPage(driver);
			objPortalSigninFirstPage.clickOnBCeIdLogin();
			
			loginPortal(driver, UAT_PORTAL_USERNAME, UAT_PORTAL_PASSWORD);
			logoutPortal(driver);
			loginPortal(driver, UAT_PORTAL_USERNAME, UAT_PORTAL_PASSWORD);
			
			test.info("Test #1 - Logging into external portal - Complete");
			
			System.out.println("[INFO] Test #1 - Logging into external portal - [Complete]");
			
			test.info("Test #2 - All tiles load without error - In Progress");
			
			System.out.println("[INFO] Test #2 - All tiles load without error - [In Progress]");
			
			// Click on all tiles and verify there are no console errors
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
			
			System.out.println("[INFO] Test #2 - Applications, Reports, and Funding load without error - [Complete]");
			
			test.info("Test #3 - External links return status code 200 and messages load without error - In Progress");
			
			System.out.println("[INFO] Test #3 - External links return status code 200 and messages load without error - [In Progress]");
			
			// Check external link loads with no error
			portalHomePage.clickFooterHome();
			checkHTTPResponse("https://www2.gov.bc.ca/gov/content/home");
			Thread.sleep(5000);
			portalHomePage.clickBackArrow(driver);
			
			// Check messages and notifications load without error
			portalHomePage.clickMessagesAndNotifications();
			Thread.sleep(5000);
			PortalMessagesAndNotificationsPage portalMessagesAndNotificationsPage = new PortalMessagesAndNotificationsPage(driver);
//			portalMessagesAndNotificationsPage.clickOnMessage();
			checkForConsoleErrors(driver);
			Thread.sleep(5000);
			
			portalMessagesAndNotificationsPage.clickOnNotificationTab();
			Thread.sleep(2000);
//			portalMessagesAndNotificationsPage.clickOnNotification();
			checkForConsoleErrors(driver);
				
			logoutPortal(driver);
			
			test.info("Test #3 - External links return status code 200 and messages load without error - Complete");
			
			System.out.println("[INFO] Test #3 - External links return status code 200 and messages load without error - [Complete]");
			
			test.info("Test #4 - Logging into internal portal and checking status code is 200 - In Progress");
			
			System.out.println("[INFO] Test #4 - Logging into internal portal and checking status code is 200 - [In Progress]");
			
			driver.get(UAT_INTERNAL_PORTAL_URL);
			Thread.sleep(2000);
			
			// Initial login
			InternalPortalSignInFirstPage internalPortalSigninFirstPage = new InternalPortalSignInFirstPage(driver);
			internalPortalSigninFirstPage.clickOnIDIRLogin();
			
			loginPortal(driver, INTERNAL_PORTAL_USERNAME, INTERNAL_PORTAL_PASSWORD);
			Thread.sleep(3000);
			logoutPortal(driver);
			loginPortal(driver, INTERNAL_PORTAL_USERNAME, INTERNAL_PORTAL_PASSWORD);
			checkHTTPResponse(UAT_INTERNAL_PORTAL_URL);
			
			test.info("Test #4 - Logging into internal portal and checking status code is 200 - Complete");
			
			System.out.println("[INFO] Test #4 - Logging into internal portal and checking status code is 200 - [Complete]");
			
			test.info("Test #5 - Using impersonate - In Progress");
			
			System.out.println("[INFO] Test #5 - Using impersonate - [In Progress]");
			
			// Use impersonate
			portalHomePage.clickOnUsername();
			portalHomePage.clickImpersonate();
			
			Thread.sleep(2000);
			InternalPortalImpersonatePage portalImpersonatePage = new InternalPortalImpersonatePage(driver);
			portalImpersonatePage.setImpersonateField(UAT_PORTAL_USERNAME);
			portalImpersonatePage.clickSearchButton();
			
			test.info("Test #5 - Using impersonate - Complete");
			
			System.out.println("[INFO] Test #5 - Using impersonate - [Complete]");
			
			test.info("Test #6 - Using impersonate, click all tiles without error - In Progress");
			
			System.out.println("[INFO] Test #6 - Using impersonate, click all tiles without error - [In Progress]");
			
			// Using impersonate, clicks on all tiles and checks for no console errors
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
			
			System.out.println("[INFO] Test #6 - Using impersonate, click all tiles without error - [Complete]");
			
			test.info("Test #7 - Using impersonate, login to another user - In Progress");
			
			System.out.println("[INFO] Test #7 - Using impersonate, login to another user - [In Progress]");
			
			// Logs into secondary account using impersonate
			portalHomePage.clickOnUsername();
			portalHomePage.clickImpersonate();
			
			Thread.sleep(3000);
			portalImpersonatePage.setImpersonateField("UAT_SECONDARY_PORTAL_USERNAME");
			portalImpersonatePage.clickSearchButton();
			
			test.info("Test #7 - Using impersonate, login to another user - Complete");
			
			System.out.println("[INFO] Test #7 - Using impersonate, login to another user - [Complete]");
			
			test.info("Test #8 - Using impersonate, External link return status code 200 and messages load without error - In Progress");
			
			System.out.println("[INFO] Test #8 - Using impersonate, External link return status code 200 and messages load without error - [In Progress]");
			
			// Using impersonate, external links return a status code of 200
			Thread.sleep(3000);
			portalHomePage.clickFooterHome();
			checkHTTPResponse("https://www2.gov.bc.ca/gov/content/home");
			Thread.sleep(3000);
			portalHomePage.clickBackArrow(driver);
			
			logoutPortal(driver);
			
			test.info("Test #8 - Using impersonate, External link return status code 200 and messages load without error - Complete");
			
			System.out.println("[INFO] Test #8 - Using impersonate, External link return status code 200 and messages load without error - [Complete]");
			
			test.info("Test #9 - Log into CRM - In Progress");
			
			System.out.println("[INFO] Test #9 - Log into CRM - [In Progress]");
			
			driver.get(UAT_CRM_URL);
			
			loginToCRM(driver, UAT_CRM_URL, CRM_USERNAME, CRM_PASSWORD);
			
			test.info("Test #9 - Log into CRM - Complete");
			
			System.out.println("[INFO] Test #9 - Log into CRM - [Complete]");
			
			test.info("Test #10 - Navigation pain - In progress");
			
			System.out.println("[INFO] Test #10 - Navigation pain - [In progress]");
			
			// Zooms out page
			JavascriptExecutor js = (JavascriptExecutor) driver;
	        js.executeScript("document.body.style.zoom='75%'");
	        
	        // Navigates to each view
	        CRMHomePage crmHomePage = new CRMHomePage(driver);
	        crmHomePage.selectOrgFacButton();
	        Thread.sleep(2000);
	        crmHomePage.selectContacts();
	        Thread.sleep(2000);
	        crmHomePage.selectLicenses();
	        Thread.sleep(2000);
	        crmHomePage.selectContactList();
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
	        
	        logoutCRM(driver);
	        
	        Thread.sleep(10000);
	        CRMSignInCredentialPage objCRMSignInCredentialPage = new CRMSignInCredentialPage(driver);
	        objCRMSignInCredentialPage.isLoginScreenAvailable();
	        
	        test.info("Test #10 - Navigation pain - Complete");
	        
	        System.out.println("[INFO] Test #10 - Navigation pain - [Complete]");
	        
			BaseTest.getScreenshot(driver, "success-result-");
			
	        test.pass("Completed - Smoke test passed");
	        
	        System.out.println("[INFO] Completed - Smoke test passed");
		}
		catch(Exception e) {
			
			BaseTest.getScreenshot(driver, "failed-result-");
			test.fail("Fail - Smoke test failed");
			Assert.fail("Fail - Smoke test failed: " + e.getMessage());
		}
	}
	
	@AfterTest
	private void tearDown() {
		
		driver.quit();
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
                System.out.println("[ERROR] " + log.getMessage());
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