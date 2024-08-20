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
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class PortalApplicationsSelectFacility {
	private WebDriver driver;

	@FindBy(id = "confirm-info")
	private WebElement iConfirmThatOrganizationInformationIs;

	@FindBy(id = "select-facility")
	private WebElement toStartYourApplicationSelectA;
	
    @FindBy(xpath = "//*[@id=\"app\"]/div/main/div/div/div/div[2]/div/div[2]/div/button/span[3]/span/i")
    private WebElement next;
	
  private final String pageLoadedText = "To apply for Supplementary Funding, you must have an active OFM application for the facility";


	public PortalApplicationsSelectFacility(WebDriver driver) {

		this.driver = driver;
		PageFactory.initElements(driver, this);
		
	}

	public void setToStartYourApplicationSelectATextField(String facility) {
		toStartYourApplicationSelectA.sendKeys(facility);
	}

	public void setIConfirmThatOrganizationInformationIsCheckboxField() {
		
		((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", iConfirmThatOrganizationInformationIs);
		 if (!iConfirmThatOrganizationInformationIs.isSelected()) {
		iConfirmThatOrganizationInformationIs.click();
		 }

	}
	
	 public void clickNextButton() {
		 	WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(20));
			wait.until(ExpectedConditions.elementToBeClickable(next));
			wait.until(ExpectedConditions.visibilityOf(next));
	        next.click();
	       
	    }
	
	  public PortalApplicationsSelectFacility verifyPageLoaded() {
	        (new WebDriverWait(driver, Duration.ofSeconds(30))).until(new ExpectedCondition<Boolean>() {
	            public Boolean apply(WebDriver d) {
	                return d.getPageSource().contains(pageLoadedText);
	            }
	        });
	        return this;
	    }
	  
	  public WebElement getIConfirmThatOrganizationInformationIs() {
		  return this.iConfirmThatOrganizationInformationIs;
	  }

}
