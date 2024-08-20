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
	protected static String PORTAL_URL;
	protected static String PORTAL_USERNAME;
	protected static String PORTAL_PASSWORD;
	protected static String CRM_URL;
	protected static String CRM_USERNAME;
	protected static String CRM_PASSWORD;

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
			PORTAL_URL = properties.getProperty("portal_url");
			PORTAL_USERNAME = properties.getProperty("portal_username");
			PORTAL_PASSWORD = properties.getProperty("portal_password");
			CRM_URL = properties.getProperty("crm_url");
			CRM_USERNAME = properties.getProperty("crm_username");
			CRM_PASSWORD = properties.getProperty("crm_password");
					

		} catch (IOException e) {
			e.printStackTrace();
		}

	}

	public static String getScreenshot(WebDriver driver, String screenshotName) throws Exception {
		String dateName = new SimpleDateFormat("yyyyMMddhhmmss").format(new Date());
		TakesScreenshot ts = (TakesScreenshot) driver;
		File source = ts.getScreenshotAs(OutputType.FILE);
		// after execution, you could see a folder "FailedTestsScreenshots" under src folder
		String destination = System.getProperty("user.dir") + "/FailedTestsScreenshots/" + screenshotName + dateName
				+ ".png";
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
	public void teardown() {
		extent.flush();
	}

}
