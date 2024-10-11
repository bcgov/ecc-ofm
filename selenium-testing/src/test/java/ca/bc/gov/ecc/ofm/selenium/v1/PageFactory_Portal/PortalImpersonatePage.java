package ca.bc.gov.ecc.ofm.selenium.v1.PageFactory_Portal;

import java.time.Duration;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class PortalImpersonatePage {
	
	WebDriver driver;
	WebDriverWait wait;
	
	@FindBy(id = "businessBCeId-field")
	WebElement bceidField;
	
	@FindBy(id = "bceid-search")
	WebElement bceidSearchButton;
	
	
	
	public PortalImpersonatePage(WebDriver driver) {
		this.driver = driver;
		PageFactory.initElements(driver, this);
		wait = new WebDriverWait(driver, Duration.ofMillis(10000));
	}
	
	public void setImpersonateField(String bceid) {
		bceidField.sendKeys(bceid);
	}
	
	public void clickSearchButton() {
		wait.until(ExpectedConditions.elementToBeClickable(bceidSearchButton)).click();
	}
	
}