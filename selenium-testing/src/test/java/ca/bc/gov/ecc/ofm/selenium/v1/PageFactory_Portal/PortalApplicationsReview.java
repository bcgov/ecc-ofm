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

public class PortalApplicationsReview {
	private WebDriver driver;

	@FindBy(id = "app-next-button")
	@CacheLookup
	private WebElement next;

	public PortalApplicationsReview(WebDriver driver) {

		this.driver = driver;
		PageFactory.initElements(driver, this);

	}


	public void clickNextButton() {
		WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(20));
		wait.until(ExpectedConditions.elementToBeClickable(next));
		wait.until(ExpectedConditions.visibilityOf(next));
		next.click();

	}
}
