package ca.bc.gov.ecc.ofm.selenium.v1.tests;

import com.aventstack.extentreports.ExtentReports;
import com.aventstack.extentreports.ExtentTest;
import com.aventstack.extentreports.reporter.ExtentSparkReporter;

import io.github.bonigarcia.wdm.WebDriverManager;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Properties;

import org.apache.commons.io.FileUtils;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.testng.ITestResult;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.AfterSuite;
import org.testng.annotations.BeforeSuite;

public class BaseTest {
	protected static ExtentReports extent;
	protected static ExtentTest test;
	protected static Properties properties;
	protected static String QA_PORTAL_URL;
	protected static String QA_PORTAL_USERNAME;
	protected static String QA_PORTAL_PASSWORD;
	protected static String QA_SECONDARY_PORTAL_USERNAME;
	protected static String QA_INTERNAL_PORTAL_URL;
	protected static String INTERNAL_PORTAL_USERNAME;
	protected static String INTERNAL_PORTAL_PASSWORD;
	protected static String QA_CRM_URL;
	protected static String CRM_USERNAME;
	protected static String CRM_PASSWORD;
	protected static String UAT_PORTAL_URL;
	protected static String UAT_PORTAL_USERNAME;
	protected static String UAT_PORTAL_PASSWORD;
	protected static String UAT_SECONDARY_PORTAL_USERNAME;
	protected static String UAT_INTERNAL_PORTAL_URL;
	protected static String UAT_CRM_URL;

	@BeforeSuite
	public void setup() {
		try {
			ExtentSparkReporter sparkReporter = new ExtentSparkReporter("extent-report.html");
			extent = new ExtentReports();
			extent.attachReporter(sparkReporter);

			properties = new Properties();
			FileInputStream fileInputStream = new FileInputStream("config.properties");
			properties.load(fileInputStream);
			fileInputStream.close();
			
			CRM_USERNAME = properties.getProperty("crm_username");
			CRM_PASSWORD = properties.getProperty("crm_password");
			INTERNAL_PORTAL_USERNAME = properties.getProperty("internal_portal_username");
			INTERNAL_PORTAL_PASSWORD = properties.getProperty("internal_portal_password");
			
			// QA credentials
			QA_PORTAL_URL = properties.getProperty("qa_portal_url");
			QA_PORTAL_USERNAME = properties.getProperty("qa_portal_username");
			QA_PORTAL_PASSWORD = properties.getProperty("qa_portal_password");
			QA_SECONDARY_PORTAL_USERNAME = properties.getProperty("qa_secondary_portal_username");
			QA_INTERNAL_PORTAL_URL = properties.getProperty("qa_internal_portal_url");
			QA_CRM_URL = properties.getProperty("qa_crm_url");
			
			// UAT credentials
			UAT_PORTAL_URL = properties.getProperty("uat_portal_url");
			UAT_PORTAL_USERNAME = properties.getProperty("uat_portal_username");
			UAT_PORTAL_PASSWORD = properties.getProperty("uat_portal_password");
			UAT_SECONDARY_PORTAL_USERNAME = properties.getProperty("uat_secondary_portal_username");
			UAT_INTERNAL_PORTAL_URL = properties.getProperty("uat_internal_portal_url");
			UAT_CRM_URL = properties.getProperty("uat_crm_url");
					

		} catch (IOException e) {
			e.printStackTrace();
		}

	}

	public static String getScreenshot(WebDriver driver, String screenshotName) throws Exception {
		String dateName = new SimpleDateFormat("yyyyMMddhhmmss").format(new Date());
		TakesScreenshot ts = (TakesScreenshot) driver;
		File source = ts.getScreenshotAs(OutputType.FILE);
		String destination;
		
		// after execution, takes screenshot of either failed or pass
		if (screenshotName.contains("failed")) {
			destination = System.getProperty("user.dir") + File.separator + "FailedTestsScreenshots" + File.separator + screenshotName + dateName
					+ ".png";
		}
		else {
			destination = System.getProperty("user.dir") + File.separator + "SuccessTestsScreenshots" + File.separator + screenshotName + dateName
					+ ".png";
		}
		
		File finalDestination = new File(destination);
		FileUtils.copyFile(source, finalDestination);
		return destination;
	}

	@AfterMethod
	public void getResult(ITestResult result) {
//		try {
//			if (result.getStatus() == ITestResult.FAILURE) {
//				test.fail("Error Details" + result.getThrowable());
//
//				WebDriver driver;
//
//				driver = (WebDriver) result.getTestClass().getRealClass().getDeclaredField("driver")
//						.get(result.getInstance());
//				BaseTest.getScreenshot(driver, result.getMethod().getMethodName());
//				
//			}
//
//		} catch (Exception e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		}
	}

	@AfterSuite
	private void teardown() {
		extent.flush();
	}

}
