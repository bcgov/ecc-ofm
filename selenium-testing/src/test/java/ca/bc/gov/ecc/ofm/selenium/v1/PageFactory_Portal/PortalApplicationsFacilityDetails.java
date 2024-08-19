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
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class PortalApplicationsFacilityDetails {
	private WebDriver driver;

	@FindBy(id = "select-expense-authority")
	@CacheLookup
	private WebElement selectExpenseAuthority;

	@FindBy(id = "select-primary-contact")
	@CacheLookup
	private WebElement selectPrimaryContact;

	@FindBy(id = "select-secondary-contact")
	@CacheLookup
	private WebElement selectSecondaryContact;
	
	   @FindBy(id = "fiscal-year-end-date")
	    @CacheLookup
	    private WebElement fiscalYearEndDate;

	@FindBy(xpath = "//*[@id='app-next-button']/span[3]/span")
	private WebElement next;

	public PortalApplicationsFacilityDetails(WebDriver driver) {

		this.driver = driver;
		PageFactory.initElements(driver, this);

	}

	private final String pageLoadedText = "This person may be the same as your primary or secondary contact";

	public void clickNextButton() {
		try {
			WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(20));
			wait.until(ExpectedConditions.elementToBeClickable(next));
			wait.until(ExpectedConditions.visibilityOf(next));
			next.click();

			Thread.sleep(20);
		} catch (Exception e) {
			System.out.println(e.toString());

		}

	}

	public void setSelectPrimaryContactTextField(String selectPrimaryContactValue) {
		selectPrimaryContact.sendKeys(selectPrimaryContactValue);

	}

	public void setSelectSecondaryContactTextField(String selectSecondaryContactValue) {
		selectSecondaryContact.sendKeys(selectSecondaryContactValue);

	}

	public void setSelectExpenseAuthorityTextField(String selectExpenseAuthorityValue) {
		selectExpenseAuthority.sendKeys(selectExpenseAuthorityValue);

	}
	
	 public void setFiscalYearEndDateDateField(String fiscalDate) {
		 fiscalYearEndDate.sendKeys(fiscalDate);
	    }

	public PortalApplicationsFacilityDetails verifyPageLoaded() {
		(new WebDriverWait(driver, Duration.ofSeconds(30))).until(new ExpectedCondition<Boolean>() {
			public Boolean apply(WebDriver d) {
				return d.getPageSource().contains(pageLoadedText);
			}
		});
		return this;
	}

}
