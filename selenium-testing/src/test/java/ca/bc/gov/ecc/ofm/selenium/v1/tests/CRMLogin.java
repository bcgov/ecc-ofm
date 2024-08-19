package ca.bc.gov.ecc.ofm.selenium.v1.tests;

import java.time.Duration;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.testng.annotations.AfterTest;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.Test;

import ca.bc.gov.ecc.ofm.selenium.v1.PageFactory_CRM.CRMSignInCredentialPage;
import io.github.bonigarcia.wdm.WebDriverManager;

public class CRMLogin extends BaseTest {
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
	public void loginToCRM() {

		// test = extent.createTest("Test - Login to CRM");
		// test.info("Starting Test - Login to CRM");
		try {
			Thread.sleep(10000);

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

			objCRMSignInCredentialPage.clickOrgFacilities();
//		test.pass("testcase passed!");
		} catch (Exception e) {
			// TODO Auto-generated catch block
			test.fail("testcase failed!");
			e.printStackTrace();
		}

	}

	@AfterTest
	public void tearDown() {
		// driver.close();
		driver.quit();
	}

}
