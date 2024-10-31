package ca.bc.gov.ecc.ofm.selenium.v1.tests.crm;

import java.time.Duration;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.testng.Assert;
import org.testng.annotations.AfterTest;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.Test;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import ca.bc.gov.ecc.ofm.selenium.v1.PageFactory_CRM.*;
import ca.bc.gov.ecc.ofm.selenium.v1.tests.BaseTest;
import io.github.bonigarcia.wdm.WebDriverManager;

public class CRMCreateIrregularExpenseApplication extends BaseTest {
	WebDriver driver;

	@BeforeTest
	public void initDriver() {
		WebDriverManager.chromedriver().setup();
		driver = new ChromeDriver();
		driver.manage().window().maximize();
	}
	
	// Change this value to your application number eg: APP-24001446
	private final static String applicationNumber = "APP-24001446";

	@SuppressWarnings("deprecation")
	@Test
	public void CreateIrregularExpenseApplication() throws InterruptedException {
		
		try {
			test = extent.createTest("Test - Create Irregular Expense Application - CRM");
			
			// Sign in to CRM
			loginToCRM(driver, QA_CRM_URL, CRM_USERNAME, CRM_PASSWORD);
			
			test.info("Login complete");
			
			// Zooms out page
			JavascriptExecutor js = (JavascriptExecutor) driver;
	        js.executeScript("document.body.style.zoom='75%'");
	        
	        // Finds the most recently submitted expense application in assistance request
	        CRMSignInCredentialPage crmSignInCredentialPage = new CRMSignInCredentialPage(driver);
	        crmSignInCredentialPage.clickAssistanceRequest();
	        
	        CRMHomePage crmHomePage = new CRMHomePage(driver);
	        crmHomePage.selectIrregularExpenseApplication();
	        
	        test.info("CRM home page complete");
	        
	        Thread.sleep(2000);
	        CRMIrregularExpensePage crmIrregularExpensePage = new CRMIrregularExpensePage(driver);
	        crmIrregularExpensePage.selectExpenseApplications();
			
			// Creates new expense application with all the required info
	        CRMNewIrregularExpenseApplicationPage crmNewIrregularExpensePage = new CRMNewIrregularExpenseApplicationPage(driver);
	        crmNewIrregularExpensePage.addIrregularExpense();
	        crmNewIrregularExpensePage.enterApplication(applicationNumber);
	        crmNewIrregularExpensePage.enterFundingAmount("5000");
	        crmNewIrregularExpensePage.enterPaymentFrequency();
	        crmNewIrregularExpensePage.enterStartDate();
	        crmNewIrregularExpensePage.enterEndDate();
	        crmNewIrregularExpensePage.enterRequestSummary("Irregular Expense Application Test");
	        
	        test.info("Irregular Expense general page complete");
	        
	        // Verifies expense application and sets it to recommended for approval
	        CRMIrregularExpenseVerificationPage crmIrregularExpenseVerificationPage = new CRMIrregularExpenseVerificationPage(driver);
	        crmIrregularExpenseVerificationPage.selectVerificationTab();
	        crmIrregularExpenseVerificationPage.setVerifyFields();
	        crmIrregularExpenseVerificationPage.saveIrregularExpenseApplication();
	        Thread.sleep(5000);
	        crmIrregularExpenseVerificationPage.setStatusRecommendedForApproval();
	        crmIrregularExpenseVerificationPage.saveIrregularExpenseApplication();
	        
	        test.info("Irregular Expense recommend to approval complete");
			
	        test.pass("Testcase passed!");
		}
		catch (Exception e) {
			test.fail("testcase failed!");
			Assert.fail("testcase failed!");
			e.printStackTrace();
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

	@AfterTest
	public void tearDown() {
//		driver.quit();
	}
}
