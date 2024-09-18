package ca.bc.gov.ecc.ofm.selenium.v1.PageFactory_CRM;

import java.time.Duration;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import io.github.bonigarcia.wdm.webdriver.WebDriverBrowser;

public class CRMOrgSearchPage {
	WebDriver driver;
	WebDriverWait wait;

	@FindBy(xpath = "//button[contains(@id, 'ViewSelector')]")
	WebElement orgFacdropDown;
	
	@FindBy(xpath = "//*[text()='Active Facilities']")
	WebElement button_activeFacilities;
	
	@FindBy(id="quickFind_text_4")
	WebElement searchbar;
	
	@FindBy(xpath = "//*[@role = 'link' and @aria-label = 'ofmqa_fac_automation']")
	WebElement facilityLink;

	public CRMOrgSearchPage(WebDriver driver) {
		this.driver = driver;
		PageFactory.initElements(driver, this);
		wait = new WebDriverWait(driver, Duration.ofMillis(30000));
	}

	
	public void selectFacility(String facility) {
		wait.until(ExpectedConditions.visibilityOf(orgFacdropDown)).click();
		wait.until(ExpectedConditions.visibilityOf(button_activeFacilities)).click();
		try {
			Thread.sleep(1000);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		searchbar.sendKeys(facility);

		searchbar.sendKeys(Keys.RETURN);
		wait.until(ExpectedConditions.visibilityOf(facilityLink)).click();
		
		
	}

	
	
}
