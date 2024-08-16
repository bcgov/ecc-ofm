package com.testng.selenium.v1.PageFactory_Portal;

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

	@FindBy(id = "select-facility-types")
	@CacheLookup
	private WebElement selectAFacilityType;

	private final String pageLoadedText = "We acknowledge the rights, interests, priorities, and concerns of all Indigenous Peoples - First Nations, Métis, and Inuit - respecting and acknowledging their distinct cultures, histories, rights, laws, and governments";

	public PortalApplicationsOperatingCosts(WebDriver driver) {

		this.driver = driver;
		PageFactory.initElements(driver, this);

	}

	public void setSelectAFacilityTypeTextField(String selectAFacilityTypeValue) {
		selectAFacilityType.sendKeys(selectAFacilityTypeValue);

	}

	public PortalApplicationsOperatingCosts verifyPageLoaded() {
		(new WebDriverWait(driver, Duration.ofSeconds(30))).until(new ExpectedCondition<Boolean>() {
			public Boolean apply(WebDriver d) {
				return d.getPageSource().contains(pageLoadedText);
			}
		});
		return this;
	}

}
