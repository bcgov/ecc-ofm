package ca.bc.gov.ecc.ofm.selenium.v1.PageFactory_Portal;

import java.time.Duration;
import java.util.List;
import java.util.Map;
import org.openqa.selenium.support.CacheLookup;
import org.openqa.selenium.support.FindAll;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.Wait;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class PortalApplicationsDeclareSubmit {
	private WebDriver driver;
	WebDriverWait wait;
	
	@FindBy(id = "app-submit-button")
	@CacheLookup
	private WebElement submit;


	public PortalApplicationsDeclareSubmit(WebDriver driver) {
		this.driver = driver;
		PageFactory.initElements(driver, this);
		wait = new WebDriverWait(driver, Duration.ofMillis(10000));

	}

	public void clickDeclare() {
		WebElement checkboxDeclare = driver.findElements(By.xpath("//*[contains(@for, 'declaration') and text()='I certify that all of the information provided is true and complete to the best of my knowledge.']")).get(0);
		((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", checkboxDeclare);
		wait.until(ExpectedConditions.elementToBeClickable(checkboxDeclare)).click();
	}
	
	public void clickSubmitButton() {
		wait.until(ExpectedConditions.elementToBeClickable(submit));
		wait.until(ExpectedConditions.visibilityOf(submit));
		submit.click();

	}
	
}
