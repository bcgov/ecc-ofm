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

public class PortalAllowanceApplicationsReviewSubmit {
	private WebDriver driver;

	@FindBy(id = "declaration")
	@CacheLookup
	private WebElement checkboxDeclare;

	@FindBy(id = "app-submit-button")
	@CacheLookup
	private WebElement submit;

	public PortalAllowanceApplicationsReviewSubmit(WebDriver driver) {

		this.driver = driver;
		PageFactory.initElements(driver, this);

	}

	public void clickDeclare() {

		((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", checkboxDeclare);
		if (!checkboxDeclare.isSelected()) {
			checkboxDeclare.click();
		}

	}

	public void clickSubmitButton() {
		WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(50));
		wait.until(ExpectedConditions.elementToBeClickable(submit));
		wait.until(ExpectedConditions.visibilityOf(submit));
		submit.click();

	}

}
