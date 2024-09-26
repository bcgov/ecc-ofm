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

public class PortalApplicationsOperatingCosts {
	private WebDriver driver;
	WebDriverWait wait;

	@FindBy(id = "select-facility-types")
	@CacheLookup
	private WebElement selectAFacilityType;

	public PortalApplicationsOperatingCosts(WebDriver driver) {
		this.driver = driver;
		PageFactory.initElements(driver, this);
		wait = new WebDriverWait(driver, Duration.ofMillis(10000));
	}

	public void setSelectAFacilityTypeTextField(String selectAFacilityTypeValue) {
		selectAFacilityType.sendKeys(selectAFacilityTypeValue);

	}

}
