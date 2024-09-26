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
import org.openqa.selenium.support.ui.Wait;
import org.openqa.selenium.support.ui.WebDriverWait;

import io.opentelemetry.exporter.logging.SystemOutLogRecordExporter;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class PortalApplicationsOperatingCostsDetails {
	private WebDriver driver;

	@FindBy(id = "app-back-button")
	@CacheLookup
	private WebElement back;

	@FindBy(id = "app-next-button")
	@CacheLookup
	private WebElement next;

	@FindBy(id = "app-save-button")
	@CacheLookup
	private WebElement save;

	private final String filePath = System.getProperty("user.dir") + "/src/test/resources/testFile.jpg";

	public PortalApplicationsOperatingCostsDetails(WebDriver driver) {
		this.driver = driver;
		PageFactory.initElements(driver, this);
	}

	public void setInsuranceCost(String cost) {
		WebElement insuranceCost = driver.findElements(By.xpath("//*[contains(@id, 'input-')]")).get(0);
		insuranceCost.sendKeys(Keys.CONTROL + "a");
		insuranceCost.sendKeys(cost);
	}

	public void addIncomeStatement() {
		WebElement uploadDocumentsField = driver.findElements(By.xpath("//*[text()='Upload Documents']")).get(0);
		((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", uploadDocumentsField);
		
		WebElement addFile = driver.findElements(By.xpath("//*[contains(@id, 'input-') and @type ='file']")).get(0);
		addFile.sendKeys(filePath);

		WebElement description = driver.findElements(By.xpath("//*[@placeholder = 'Enter a description (Optional)']")).get(0);
		description.sendKeys("incomeStatement");
	}

	public void addBalanceSheet() {
		WebElement addFile = driver.findElements(By.xpath("//*[contains(@id, 'input-') and @type ='file']")).get(1);
		addFile.sendKeys(filePath);

		WebElement description = driver.findElements(By.xpath("//*[@placeholder = 'Enter a description (Optional)']")).get(1);
		description.sendKeys("Balance Statement");
	}

	public void addSupportingDoc() {
		WebElement addFile = driver.findElements(By.xpath("//*[contains(@id, 'input-') and @type ='file']")).get(2);
		addFile.sendKeys(filePath);

		WebElement description = driver.findElements(By.xpath("//*[@placeholder = 'Enter a description (Optional)']")).get(2);
		description.sendKeys("Supporting File");
	}

	public void setIAttestThatTheRentleaseAgreement() {
		WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(20));

		WebElement iAttestThatTheRentleaseAgreement = driver.findElement(By.xpath("//*[contains(@id, 'checkbox-')]"));
		if (!iAttestThatTheRentleaseAgreement.isSelected()) {
			iAttestThatTheRentleaseAgreement.click();
		}
	}

	public void clickNextButton() {
		WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(20));
		wait.until(ExpectedConditions.elementToBeClickable(next));
		wait.until(ExpectedConditions.visibilityOf(next));
		next.click();
	}

	public void clickSaveButton() {
		WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(20));
		wait.until(ExpectedConditions.elementToBeClickable(save));
		wait.until(ExpectedConditions.visibilityOf(save));
		save.click();
	}

	public void clickBackButton() {
		WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(20));
		wait.until(ExpectedConditions.elementToBeClickable(back));
		wait.until(ExpectedConditions.visibilityOf(back));
		back.click();
	}

}
