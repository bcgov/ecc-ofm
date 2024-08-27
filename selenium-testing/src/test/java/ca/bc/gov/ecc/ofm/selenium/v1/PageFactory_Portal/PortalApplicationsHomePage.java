package ca.bc.gov.ecc.ofm.selenium.v1.PageFactory_Portal;

import java.time.Duration;

import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.CacheLookup;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class PortalApplicationsHomePage {
	WebDriver driver;
	WebDriverWait wait;

	@FindBy(id = "core-application-button")
	@CacheLookup
	WebElement button_addOFMApplication;

	public PortalApplicationsHomePage(WebDriver driver) {
		this.driver = driver;
		PageFactory.initElements(driver, this);
		wait = new WebDriverWait(driver, Duration.ofSeconds(10000));
	}

	public void addOFMApplication() throws InterruptedException {
		wait.until(ExpectedConditions.visibilityOf(button_addOFMApplication));
		wait.until(ExpectedConditions.elementToBeClickable(button_addOFMApplication));
		button_addOFMApplication.click();
		
	}
}
