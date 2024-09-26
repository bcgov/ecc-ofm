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
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class PortalApplicationsServiceDelivery {
	private WebDriver driver;
	WebDriverWait wait;

	@FindBy(id = "confirmation")
	@CacheLookup
	private WebElement iConfirmThatTheAboveInformation;

	@FindBy(id = "app-next-button")
	@CacheLookup
	private WebElement next;
	
//	@FindBy(xpath = "text()='Upload Documents']")
//	WebElement uploadDocumentsField;
	
	private final String filePath = System.getProperty("user.dir") + "/src/test/resources/testFile.jpg";

	private final String pageLoadedText = "We acknowledge the rights, interests, priorities, and concerns of all Indigenous Peoples - First Nations, Métis, and Inuit - respecting and acknowledging their distinct cultures, histories, rights, laws, and governments";   

	public PortalApplicationsServiceDelivery(WebDriver driver) {
		this.driver = driver;
		PageFactory.initElements(driver, this);
		wait = new WebDriverWait(driver, Duration.ofSeconds(20));
	}
	
	public void addLicense() {
		WebElement uploadDocumentsField = driver.findElements(By.xpath("//*[text()='Upload Documents']")).get(0);
		((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", uploadDocumentsField);

		WebElement addFile = driver.findElements(By.xpath("//*[contains(@id, 'input-') and @type ='file']")).get(0);
		addFile.sendKeys(filePath);

		WebElement description = driver.findElements(By.xpath("//*[@placeholder = 'Enter a description (Optional)']")).get(0);
		description.sendKeys("License");
	}
	
	public void addHealthAuthorityCompliance() {
		WebElement addFile = driver.findElements(By.xpath("//*[contains(@id, 'input-') and @type ='file']")).get(1);
		addFile.sendKeys(filePath);

		WebElement description = driver.findElements(By.xpath("//*[@placeholder = 'Enter a description (Optional)']")).get(1);
		description.sendKeys("Health Authority Compliance");
	}
	
	public void setIConfirmThatTheAboveInformationCheckboxField() {
		((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", iConfirmThatTheAboveInformation);
		if (!iConfirmThatTheAboveInformation.isSelected()) {
			iConfirmThatTheAboveInformation.click();
		}
	}
	
	 public void clickNextButton() {
		 wait.until(ExpectedConditions.elementToBeClickable(next));
		 wait.until(ExpectedConditions.visibilityOf(next));
		 next.click();
	 }

}
