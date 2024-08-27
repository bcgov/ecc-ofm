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

public class PortalAllowanceApplicationsSelectFacility {
	private WebDriver driver;

	@FindBy(id = "select-facility")
	private WebElement toStartYourApplicationSelectA;

	public PortalAllowanceApplicationsSelectFacility(WebDriver driver) {
		this.driver = driver;
		PageFactory.initElements(driver, this);
		
	}

	public void setToStartYourApplicationSelectATextField(String facility) {
		toStartYourApplicationSelectA.sendKeys(facility);
	}
	
}
