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

	@FindBy(id = "core-application-button")
	@CacheLookup
	WebElement button_addOFMApplication;

	private final String pageLoadedText = "OFM Application";

	public PortalApplicationsHomePage(WebDriver driver) {
		this.driver = driver;
		PageFactory.initElements(driver, this);
	}

	public void addOFMApplication() throws InterruptedException {
		WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(100));
		wait.until(ExpectedConditions.visibilityOf(button_addOFMApplication));
		wait.until(ExpectedConditions.elementToBeClickable(button_addOFMApplication));

		button_addOFMApplication.click();
		
	}

	public PortalApplicationsHomePage verifyPageLoaded() {
		WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(80));
		wait.until(new ExpectedCondition<Boolean>() {
			public Boolean apply(WebDriver d) {
				return d.getPageSource().contains(pageLoadedText);
			}
		});
		return this;
	}
}
