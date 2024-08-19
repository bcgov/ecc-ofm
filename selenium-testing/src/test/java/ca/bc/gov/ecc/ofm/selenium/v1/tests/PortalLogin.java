package ca.bc.gov.ecc.ofm.selenium.v1.tests;

import java.time.Duration;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.PageFactory;
import org.testng.annotations.AfterTest;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.Test;

import ca.bc.gov.ecc.ofm.selenium.v1.PageFactory_Portal.PortalSignInCredentialPage;
import ca.bc.gov.ecc.ofm.selenium.v1.PageFactory_Portal.PortalSignInFirstPage;
import io.github.bonigarcia.wdm.WebDriverManager;

public class PortalLogin extends BaseTest {
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
	public void loginToPortal() throws InterruptedException {
		try {
			driver.get(PORTAL_URL);
			 test = extent.createTest("Test - Login to Portal");
			 test.info("Starting Test - Login to Portal");
			wait(10);
			PortalSignInFirstPage objPortalSigninFirstPage = new PortalSignInFirstPage(driver);
			objPortalSigninFirstPage.clickOnBCeIdLogin();

			PortalSignInCredentialPage objPortalSignInCredentialPage = new PortalSignInCredentialPage(driver);
			objPortalSignInCredentialPage.enterUserId(PORTAL_USERNAME);
			wait(20);
			objPortalSignInCredentialPage.enterPassword(PORTAL_PASSWORD);
			wait(20);
			objPortalSignInCredentialPage.clickSubmit();
			wait(20);
			objPortalSignInCredentialPage.clickSignatureRequired();

			 test.pass("testcase passed!");
		} 
		
		catch (Exception e) {
			test.fail("testcase failed!");
			e.printStackTrace();
		}

	}

	@AfterTest
	public void tearDown() {
		driver.quit();
	}

}
