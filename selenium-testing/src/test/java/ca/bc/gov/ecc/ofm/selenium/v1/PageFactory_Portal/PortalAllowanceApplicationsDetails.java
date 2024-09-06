package ca.bc.gov.ecc.ofm.selenium.v1.PageFactory_Portal;

import java.time.Duration;
import java.util.List;
import java.util.Map;
import org.openqa.selenium.support.CacheLookup;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class PortalAllowanceApplicationsDetails {
	private WebDriver driver;

//	@FindBy(xpath = "//*[@aria-label = 'Honoraria for Elder involvement, language revitalization and/ or other resource people including curriculum development resource']")

	@FindBy(xpath = "//*[contains(@aria-label, 'Honoraria for Elder involvement')]")
	private WebElement honorariaForElderInvolvementLanguageRevitalization;

	@FindBy(xpath = "//*[@class='header-label' and contains(text(),'Indigenous Programming')]")
	private WebElement headerIndigenous;

	@FindBy(xpath = "//*[contains(@aria-label, 'Resources to proactively support')]")
	private WebElement resourcesToProactivelySupport;

	@FindBy(xpath = "//*[@class='header-label' and contains(text(),'Support Needs Programming Allowance')]")
	private WebElement headerSupportNeeds;
	
	
	@FindBy(id = "add-new-file")
	private WebElement addNewFile;
	
	@FindBy(xpath = "//*[@id='app-next-button']/span[3]/span")
	private WebElement next;
	
	@FindBy(xpath = "//*[@id='app-save-button']/span[3]/span")
	private WebElement save;


	private final String filePath1 = System.getProperty("user.dir") + "/src/test/resources/testFile.jpg";
	private final String filePath2 = System.getProperty("user.dir") + "/src/test/resources/testFile2.jpg";
	
	public PortalAllowanceApplicationsDetails(WebDriver driver) {

		this.driver = driver;
		PageFactory.initElements(driver, this);

	}

	public void setHonorariaForElderInvolvementLanguageRevitalizationCheckboxField() {
		((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", headerIndigenous);

		if (!honorariaForElderInvolvementLanguageRevitalization.isSelected()) {
			honorariaForElderInvolvementLanguageRevitalization.click();
		}

	}

	public void setResourcesToProactivelySupportCheckboxField() {
		((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", headerSupportNeeds);

		WebElement resourcesToProactivelySupport = driver
				.findElements(By.xpath("//*[@type = 'checkbox' and @value = '2']")).get(1);

		if (!resourcesToProactivelySupport.isSelected()) {
			resourcesToProactivelySupport.click();
		}

	}

	public void fillTransportationDetails() {

		WebElement vin = driver.findElements(By.xpath("//*[@type='text']")).get(1);
		((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", vin);
		vin.sendKeys("AB1334");

		WebElement mileage = driver.findElements(By.xpath("//*[@type='number']")).get(0);
		mileage.sendKeys("98777");
		
		WebElement yearlyKM = driver.findElements(By.xpath("//*[@type='number']")).get(1);
		yearlyKM.sendKeys("10000");


		WebElement leaseCost = driver.findElements(By.xpath("//*[@type='text']")).get(2);
		leaseCost.sendKeys(Keys.CONTROL + "a");
		leaseCost.sendKeys("5000");
		
		addNewFile.click();
		WebElement file1 = driver.findElements(By.xpath("//*[@type='file']")).get(0);
		file1.sendKeys(filePath1);
		
		
		WebElement file2 = driver.findElements(By.xpath("//*[@type='file']")).get(1);
		file2.sendKeys(filePath2);
		
		
		next.click();
		
	}

}
