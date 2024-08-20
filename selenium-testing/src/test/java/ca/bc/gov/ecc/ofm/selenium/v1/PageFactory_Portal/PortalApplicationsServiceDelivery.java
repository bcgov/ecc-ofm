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

public class PortalApplicationsServiceDelivery {
	private WebDriver driver;

	@FindBy(id = "confirmation")
	@CacheLookup
	private WebElement iConfirmThatTheAboveInformation;

	@FindBy(id = "app-next-button")
	@CacheLookup
	private WebElement next;

	private final String pageLoadedText = "We acknowledge the rights, interests, priorities, and concerns of all Indigenous Peoples - First Nations, Métis, and Inuit - respecting and acknowledging their distinct cultures, histories, rights, laws, and governments";   

	public PortalApplicationsServiceDelivery(WebDriver driver) {
		this.driver = driver;
		PageFactory.initElements(driver, this);
		
	}
	
	
	public void setIConfirmThatTheAboveInformationCheckboxField() {
		((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", iConfirmThatTheAboveInformation);
		if (!iConfirmThatTheAboveInformation.isSelected()) {
			iConfirmThatTheAboveInformation.click();
		}
	}
	 
	 

	
	
	 public void clickNextButton() {
		 	WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(20));
			wait.until(ExpectedConditions.elementToBeClickable(next));
			wait.until(ExpectedConditions.visibilityOf(next));
	        next.click();
	       
	    }
	
	  public PortalApplicationsServiceDelivery verifyPageLoaded() {
		  (new WebDriverWait(driver, Duration.ofSeconds(30))).until(new ExpectedCondition<Boolean>() {
	            public Boolean apply(WebDriver d) {
	                return d.getPageSource().contains(pageLoadedText);
	            }
	      });
	      return this;
	  }

}
