package ca.bc.gov.ecc.ofm.selenium.v1.PageFactory_Portal;

import java.time.Duration;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.CacheLookup;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class PortalIrregularExpenseApplicationsHomePage {
	WebDriver driver;
	WebDriverWait wait;

    @FindBy(id = "irregular-expense-button")
    @CacheLookup
    private WebElement addIrregularExpensesFundingApplication;

	private final String pageLoadedText = "Irregular Expenses Funding Application";

	public PortalIrregularExpenseApplicationsHomePage(WebDriver driver) {
		this.driver = driver;
		PageFactory.initElements(driver, this);
		wait = new WebDriverWait(driver, Duration.ofMillis(10000));
	}

	public void addIrregularExpenseApplication() throws InterruptedException {
		try {
			wait.until(ExpectedConditions.visibilityOf(addIrregularExpensesFundingApplication));
			wait.until(ExpectedConditions.elementToBeClickable(addIrregularExpensesFundingApplication)).click();
		}
		catch(Exception e) {
			System.out.println("Irregular application button is not available");
			driver.quit();
		}
	}
}
