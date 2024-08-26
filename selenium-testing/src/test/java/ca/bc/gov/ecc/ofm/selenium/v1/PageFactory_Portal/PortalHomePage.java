package ca.bc.gov.ecc.ofm.selenium.v1.PageFactory_Portal;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;

public class PortalHomePage {
	WebDriver driver;
	
	@FindBy(id = "applications-card")
	WebElement box_Applications;
	
	@FindBy(xpath = "//*[contains(text(), '" + "Log Out" + "')]")
	WebElement logout;

	public PortalHomePage(WebDriver driver) {
		this.driver = driver;
		PageFactory.initElements(driver, this);
	}

	public void clickOnApplicationBox() {
		box_Applications.click();
	}
	
	public void logout() {
		logout.click();
	}
}
